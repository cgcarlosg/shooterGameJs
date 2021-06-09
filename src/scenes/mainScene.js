import Phaser from '../phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MainScene' });
    }
  
    init(data) {
      this.passingData = data;
    }
  
    preload() {
    
     
    }
  
    create() {
     
  }
}