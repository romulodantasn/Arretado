import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';

export class deathCollision extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemyGroup: Phaser.Physics.Arcade.Group;
  timeLeft: number;
  constructor() {
    super({
      key: 'deathCollision',
    });
  }
  create() {
    this.deathCollision();
  }

  public deathCollision() {
    this.physics.add.collider(this.player, this.enemyGroup, () => {
      console.log('Eita macho tu perdesse. Reiniciando.');
      this.resetGameSettings();
      this.scene.restart();
    });
  }

  public resetGameSettings() {
    this.timeLeft = 45;
    gameOptions.enemyRate = 800;
  }
}
