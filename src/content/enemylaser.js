import { Entity } from './entity';

export class EnemyLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'LaserEnemy');
  }
}
