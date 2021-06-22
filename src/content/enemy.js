import { Entity } from './entity';

export class Enemy extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.setOrigin(0);
  }
}
