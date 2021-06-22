/* eslint-disable max-classes-per-file */
import { Entity } from './entity';

class Enemy extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.setOrigin(0);
  }
}

class EnemyLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'LaserEnemy');
  }
}

export { Enemy, EnemyLaser };