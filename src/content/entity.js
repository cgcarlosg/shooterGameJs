/* eslint-disable max-classes-per-file */
import Phaser from '../phaser';

class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
  }
}

class ShieldTile extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.setOrigin(0);
    this.setScale(2);

  }
}

class Explosion extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'Explosion');
    this.play('Explosion');
    this.setOrigin(0);
    this.setScale(2);
    this.on('animationcomplete', () => {
      if (this) {
        this.destroy();
      }
    });
  }
}

export { Entity, ShieldTile, Explosion };