import { Entity } from './entity';

export class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'LaserPlayer');
  }
}