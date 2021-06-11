import Phaser from '../phaser';
import player from '../../assets/images/player.png';
import enemies from '../../assets/images/ships.png';
import shield from '../../assets/images/Shield.png';
import enemyLaser from '../../assets/images/LaserEnemy.png';
import playerLaser from '../../assets/images/LaserPlayer.png';
import explosion from '../../assets/images/Explosion.png';
import exploSound from '../../assets/audio/soundExpl.wav';
import laserSnd1 from '../../assets/audio/soundLaserPlayer.wav';
import laserSnd2 from '../../assets/audio/soundLaserEnemy.wav';
import { Player, PlayerLaser } from '../content/player';
import { Enemy, EnemyLaser } from '../content/enemy';
import { ShieldTile, Explosion } from '../content/entity';
import Background from '../../assets/images/background.jpg';

export default class MainScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MainScene' });
    }
  
    init(data) {
      this.passingData = data;
    }
  
    preload() {
      this.load.image('bgStart', Background);
      this.load.image('sprPlayer', player);
  
      this.load.spritesheet('sprEnemy0', enemies, {
        frameWidth: 8,
        frameHeight: 8,
      });
      this.load.image('sprShieldTile', shield);
      this.load.image('sprLaserEnemy', enemyLaser);
      this.load.image('sprLaserPlayer', playerLaser);
      this.load.spritesheet('sprExplosion', explosion, {
        frameWidth: 8,
        frameHeight: 8,
      });
  
      this.load.audio('sndExplode', exploSound);
      this.load.audio('sndLaserPlayer', laserSnd1);
      this.load.audio('sndLaserEnemy', laserSnd2);
    }
  
    create() {
      if (Object.getOwnPropertyNames(this.passingData).length === 0
        && this.passingData.constructor === Object) {
        this.passingData = {
          maxLives: 2,
          lives: 2,
          score: 0,
        };
      }
      this.add.image(400, 300, 'bgStart');
  
      this.sfx = {
        explode: this.sound.add('soundExpl'),
        laserPlayer: this.sound.add('soundLaserPlayer'),
        laserEnemy: this.sound.add('soundLaserEnemy'),
      };
  
      this.anims.create({
        key: 'Explosion',
        frames: this.anims.generateFrameNumbers('Explosion'),
        frameRate: 18,
        repeat: 0,
      });
  
      this.textScore = this.add.text(
        12,
        10,
        `Score: ${this.passingData.score}`,
        {
          fontFamily: 'monospace',
          fontSize: 16,
          align: 'left',
        },
      );
  
      this.player = new Player(
  
        this,
        this.game.config.width * 0.5,
        this.game.config.height - 54,
        this.scale = 0.5,
      );
      this.player.body.collideWorldBounds = true;
  
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
      this.playerShootDelay = 22;
      this.playerShootTick = 0;
  
      this.shieldPattern = [
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
  
      ];
  
      this.enemies = this.add.group();
      this.enemyLasers = this.add.group();
      this.playerLasers = this.add.group();
      this.explosions = this.add.group();
      this.shieldTiles = this.add.group();
      this.shieldHoles = this.add.group();
  
      this.lastEnemyMoveDir = 'RIGHT';
      this.enemyMoveDir = 'LEFT';
      this.enemyRect = new Phaser.Geom.Rectangle(
        0,
        0,
        Math.round((this.game.config.width / 24) * 0.75) * 24,
        Math.round((this.game.config.height / 20) * 0.25) * 20,
      );

      for (let x = 0; x < Math.round((this.game.config.width / 25) * 0.75); x += 1) {
        for (let y = 0; y < Math.round((this.game.config.height / 20) * 0.25); y += 1) {
          const enemy = new Enemy(this, x * 24, 128 + (y * 20), 'sprEnemy0');
          enemy.play('sprEnemy0');
          enemy.setScale(2);
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
  
      this.physics.add.overlap(this.playerLasers, this.shieldTiles, (laser, tile) => {
        if (laser) {
          laser.destroy();
        }
  
        this.destroyShieldTile(tile);
      }, null, this);
  
      this.physics.add.overlap(this.enemyLasers, this.shieldTiles, (laser, tile) => {
        if (laser) {
          laser.destroy();
        }
  
        this.destroyShieldTile(tile);
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