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
     
  }
}