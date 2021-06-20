/* eslint-disable max-classes-per-file */
import { Entity } from './entity';

class EnemyLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'LaserEnemy');
  }
}

class Enemy extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.setOrigin(0);
  }
}

export { Enemy, EnemyLaser };