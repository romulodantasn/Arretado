import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';

export class EnemyMovement extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemyGroup: Phaser.Physics.Arcade.Group;
  constructor() {
    super({
      key: 'EnemyMovement',
    });
  }
  update() {
    this.updateEnemyMovement();
  }

  public updateEnemyMovement() {
    this.enemyGroup.getMatching('visible', true).forEach((enemy: any) => {
      this.physics.moveToObject(enemy, this.player, gameOptions.enemySpeed);
    });
  }
}
