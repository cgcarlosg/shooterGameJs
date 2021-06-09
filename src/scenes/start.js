import Phaser from '../phaser';
import playButton from '../../assets/images/playbutton.jpeg';
import leadBoard from '../../assets/images/leader.png';
import soundButton from '../../assets/audio/soundButton.wav';
import Background from '../../assets/images/background.jpg';

  export default class Start extends Phaser.Scene {
    constructor() {
      super({ key: 'Start' });
    }
  preload() {
    this.load.image('btnPlay', playButton);
    this.load.image('backgStart', Background);
    this.load.image('leadBtn', leadBoard);
    this.load.audio('soundBtn', soundButton);
  }

  create() {
    this.sfx = {
      btn: this.soundButton.add('soundBtn'),
    };

    this.add.image(400, 300, 'backgStart');

    this.textTitle = this.add.text(
      this.game.config.width * 0.5,
      64,
      'Galaxy War Classic Video Game',
      {
        fontFamily: 'monospace',
        fontSize: 32,
        align: 'center',
      },
    );
    this.textTitle.setOrigin(0.5);

    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.2,
      this.game.config.height * 0.3,
      'btnPlay',
    );
    this.btnPlay.setInteractive();

    this.btnPlay.on('pointerover', () => {
      this.sfx.btn.play();
    }, this);

    this.btnPlay.on('pointerdown', () => {
      this.sfx.btn.play();
      this.scene.start('MainScene');
    }, this);

    this.leaderBoard = this.add.sprite(
      this.game.config.width * 0.7,
      this.game.config.height * 0.6,
      'leadBtn',
    );
    this.leaderBoard.setInteractive();

    this.leaderBoard.on('pointerover', () => {
      this.sfx.btn.play();
    }, this);

    this.leaderBoard.on('pointerdown', () => {
      this.sfx.btn.play();
      this.scene.start('Score');
    }, this);

    const style = {
      fontFamily: 'san-serif',
      fontSize: 16,
      color: '#aaf',
      align: 'center',
    };
    const instructionone = 'Arrow keys to move the ship';
    const instructiontwo = 'Space Bar to shoot.';
    const xPos = this.game.config.width * 0.5;
    const yPos = this.game.config.height - 40;
    this.instructionsone = this.add.text(xPos, yPos, instructionone, style);
    this.instructionsone.setOrigin(0.5);
    this.instructionstwo = this.add.text(xPos, yPos + 20, instructiontwo, style);
    this.instructionstwo.setOrigin(0.5);
  }
}