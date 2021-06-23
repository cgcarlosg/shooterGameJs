import Entity from './entity';

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

export default Explosion;