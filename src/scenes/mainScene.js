import Phaser from '../phaser';
import player from '../../assets/images/player.png';
import enemies from '../../assets/images/enemy.png';
import enemyLaser from '../../assets/images/LaserEnemy.png';
import playerLaser from '../../assets/images/LaserPlayer.png';
import explosion from '../../assets/images/Explosion.png';
import exploSound from '../../assets/audio/sndExplode.wav';
import laserSnd1 from '../../assets/audio/sndLaserPlayer.wav';
import laserSnd2 from '../../assets/audio/sndLaserEnemy.wav';
import { Player, PlayerLaser } from '../content/player';
import { Enemy, EnemyLaser } from '../content/enemy';
import { Explosion } from '../content/entity';
import Background from '../../assets/images/backk.jpg';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init(data) {
    this.passingData = data;
  }

  preload() {
    this.load.image('bgStart', Background);
    this.load.image('Player', player);

    this.load.spritesheet('enemy', enemies, {
      frameWidth: 7,
      frameHeight: 7,
    });
    this.load.image('LaserEnemy', enemyLaser);
    this.load.image('LaserPlayer', playerLaser);
    this.load.spritesheet('Explosion', explosion, {
      frameWidth: 7,
      frameHeight: 7,
    });

    this.load.audio('sndExplode', exploSound);
    this.load.audio('sndLaserPlayer', laserSnd1);
    this.load.audio('sndLaserEnemy', laserSnd2);
  }

  create() {
    if (Object.getOwnPropertyNames(this.passingData).length === 0
      && this.passingData.constructor === Object) {
      this.passingData = {
        maxLives: 1,
        lives: 0,
        score: 0,
      };
    }
    this.add.image(300, 300, 'bgStart');

    this.sfx = {
      explode: this.sound.add('sndExplode'),
      laserPlayer: this.sound.add('sndLaserPlayer'),
      laserEnemy: this.sound.add('sndLaserEnemy'),
    };

    this.anims.create({
      key: 'Explosion',
      frames: this.anims.generateFrameNumbers('Explosion'),
      frameRate: 20,
      repeat: 0,
    });

    this.textScore = this.add.text(
      250,
      50,
      `Score: ${this.passingData.score}`,
      {
        fontFamily: 'arial',
        fontSize: 34,
        align: 'right',
        color: 'black',
      },
    );

    this.player = new Player(

      this,
      this.game.config.width,
      this.game.config.height - 40,
      this.scale = 1,
    );
    this.player.body.collideWorldBounds = true;
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.playerShootDelay = 15;
    this.playerShootTick = 1;

    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();
    this.explosions = this.add.group();
    this.lastEnemyMoveDir = 'RIGHT';
    this.enemyMoveDir = 'LEFT';
    this.enemyRect = new Phaser.Geom.Rectangle(0, 0,
      Math.round((this.game.config.width / 24) * 0.7) * 24,
      Math.round((this.game.config.height / 20) * 0.3) * 20);

    for (let x = 0; x < Math.round((this.game.config.width / 40) * 1.2); x += 1) {
      for (let y = 0; y < Math.round((this.game.config.height / 32) * 0.5); y += 1) {
        const enemy = new Enemy(this, x * 24, 100 + (y * 20), 'enemy');
        enemy.play('enemy');
        enemy.setScale(4);
        this.enemies.add(enemy);
      }
    }

    this.updateEnemiesMovement();
    this.updateEnemiesShooting();
    this.updatePlayerMovement();
    this.updatePlayerShooting();
    this.updateLasers();
    this.createLivesIcons();
    this.physics.add.overlap(this.playerLasers, this.enemies, (laser, enemy) => {
      if (laser) {
        laser.destroy();
      }

      if (enemy) {
        this.createExplosion(enemy.x, enemy.y);
        this.addScore(10);
        enemy.destroy();
      } else {
        this.scene.start('GameOver', {
          gameScore: this.passingData.score,
        });
      }
    }, null, this);

    this.physics.add.overlap(this.playerLasers, this.enemyLasers, (playerLaser, enemyLaser) => {
      if (playerLaser) {
        playerLaser.destroy();
      }
      if (enemyLaser) {
        enemyLaser.destroy();
      }
    }, null, this);

    this.physics.add.overlap(this.playerLasers, (laser) => {
      if (laser) {
        laser.destroy();
      }
    }, null, this);

    this.physics.add.overlap(this.enemyLasers, (laser) => {
      if (laser) {
        laser.destroy();
      }
    }, null, this);

    this.physics.add.overlap(this.player, this.enemies, (player) => {
      if (player) {
        player.destroy();
        this.onLifeDown();
      }
    }, null, this);

    this.physics.add.overlap(this.player, this.enemyLasers, (player, laser) => {
      if (player) {
        player.destroy();
        this.onLifeDown();
      }
      if (laser) {
        laser.destroy();
      }
    }, null, this);
  }

  addScore(amount) {
    this.passingData.score += amount;
    this.textScore.setText(`Score: ${this.passingData.score}`);
  }

  setEnemyDirection(direction) {
    this.lastEnemyMoveDir = this.enemyMoveDir;
    this.enemyMoveDir = direction;
  }

  updateEnemiesMovement() {
    this.enemyMoveTimer = this.time.addEvent({
      delay: 700,
      callback() {
        if (this.enemyMoveDir === 'RIGHT') {
          this.enemyRect.x += 10;

          if (this.enemyRect.x + this.enemyRect.width > this.game.config.width - 20) {
            this.setEnemyDirection('DOWN');
          }
        } else if (this.enemyMoveDir === 'LEFT') {
          this.enemyRect.x -= 10;

          if (this.enemyRect.x < 20) {
            this.setEnemyDirection('DOWN');
          }
        } else if (this.enemyMoveDir === 'DOWN') {
          this.enemyMoveTimer.delay -= 100;
          this.moveEnemiesDown();
        }

        for (let i = this.enemies.getChildren().length - 1; i >= 0; i -= 1) {
          const enemy = this.enemies.getChildren()[i];
          if (this.enemyMoveDir === 'RIGHT') {
            enemy.x += 6;
          } else if (this.enemyMoveDir === 'LEFT') {
            enemy.x -= 6;
          }
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  updateEnemiesShooting() {
    this.time.addEvent({
      delay: 300,
      callback() {
        for (let i = 0; i < this.enemies.getChildren().length; i += 1) {
          const enemy = this.enemies.getChildren()[i];
          if (Phaser.Math.Between(0, 1000) > 995) {
            const laser = new EnemyLaser(this, enemy.x, enemy.y);
            this.enemyLasers.add(laser);
            this.sfx.laserEnemy.play();
          }
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  moveEnemiesDown() {
    for (let i = this.enemies.getChildren().length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies.getChildren()[i];
      enemy.y += 25;
      if (this.lastEnemyMoveDir === 'LEFT') {
        this.setEnemyDirection('RIGHT');
      } else if (this.lastEnemyMoveDir === 'RIGHT') {
        this.setEnemyDirection('LEFT');
      }
    }
  }

  updatePlayerMovement() {
    this.keys = this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,Z,X');
    this.time.addEvent({
      delay: 50,
      callback() {
        if (this.keys.RIGHT.isDown) {
          this.player.x += 8;
        }

        if (this.keys.LEFT.isDown) {
          this.player.x -= 8;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  updatePlayerShooting() {
    this.time.addEvent({
      delay: 1,
      callback() {
        if (this.keySpace.isDown && this.player.active) {
          if (this.playerShootTick < this.playerShootDelay) {
            this.playerShootTick += 1;
          } else {
            const laser = new PlayerLaser(this, this.player.x, this.player.y);
            this.playerLasers.add(laser);
            this.sfx.laserPlayer.play();
            this.playerShootTick = 0;
          }
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  updateLasers() {
    this.time.addEvent({
      delay: 7,
      callback() {
        for (let i = 0; i < this.playerLasers.getChildren().length; i += 1) {
          const laser = this.playerLasers.getChildren()[i];
          laser.y -= laser.displayHeight;
          if (laser.y < 16) {
            this.createExplosion(laser.x, laser.y);
            if (laser) {
              laser.destroy();
            }
          }
        }
      },
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 128,
      callback() {
        for (let i = 0; i < this.enemyLasers.getChildren().length; i += 1) {
          const laser = this.enemyLasers.getChildren()[i];
          laser.y += laser.displayHeight;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  createExplosion(x, y) {
    this.sfx.explode.play();
    const explosion = new Explosion(this, x, y);
    this.explosions.add(explosion);
  }

  createLivesIcons() {
    for (let i = 0; i < this.passingData.lives; i += 1) {
      const icon = this.add.sprite(
        32 + (i * 492),
        this.game.config.height - 24,
        'Player',
      );
      icon.setScale(2);
      icon.setDepth(5);
    }
  }

  onLifeDown() {
    if (this.passingData.lives === 0) {
      this.textScore.setVisible(false);
      this.scene.start('GameOver', {
        gameScore: this.passingData.score,
      });
      this.passingData.score = 0;
      this.passingData.lives = 1;
    }

    this.time.addEvent({
      delay: 1000,
      callback() {
        if (this.passingData.lives > 0) {
          this.passingData.lives -= 1;
          this.scene.start('MainScene', this.passingData);
        } else {
          this.scene.start('MainScene', { });
        }
      },
      callbackScope: this,
      loop: false,
    });
  }
}
