import '../assets/styles/style.css';

import Phaser from './phaser';
import Start from './scenes/start';

const config = {
  type: Phaser.WEBGL,
  width: 700,
  height: 600,
  backgroundColor: 'black',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [
    Start
  ],
  pixelArt: true,
  roundPixels: true,
};

const game = new Phaser.Game(config);