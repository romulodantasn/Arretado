import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';

export class initializeEnemyGroup extends Phaser.Scene {
  enemyGroup: Phaser.Physics.Arcade.Group;
  enemySprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  constructor() {
    super({
      key: 'enemyGroup',
    });
  }

  create() {
    this.initializeEnemyGroup();
  }

  public initializeEnemyGroup() {
    this.enemyGroup = this.physics.add.group();

    const outerRectangle = new Phaser.Geom.Rectangle(
      -100,
      -100,
      gameOptions.gameSize.width + 200,
      gameOptions.gameSize.height + 200
    );

    const innerRectangle = new Phaser.Geom.Rectangle(
      -50,
      -50,
      gameOptions.gameSize.width + 100,
      gameOptions.gameSize.height + 100
    );

    this.time.addEvent({
      delay: gameOptions.enemyRate,
      loop: true,
      callback: () => {
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
        this.enemySprite = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'enemy');
        this.enemySprite.play('enemy', true);
        this.enemyGroup.add(this.enemySprite);
      },
    });
  }
}
