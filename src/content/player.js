import Entity from './entity';

class Player extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'Player');
    this.setScale(2);
  }
}

export default Player;
