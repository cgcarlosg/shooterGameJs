import { Entity } from './entity';

export class Player extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'Player');
    this.setScale(2);
  }
}
