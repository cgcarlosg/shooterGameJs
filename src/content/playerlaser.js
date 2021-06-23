import Entity from './entity';

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'LaserPlayer');
  }
}

export default PlayerLaser;