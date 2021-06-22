/* eslint-disable max-classes-per-file */
import { Entity } from './entity';

class Player extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'Player');
    this.setScale(2);
  }
}

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'LaserPlayer');
  }
}

export { Player, PlayerLaser };
