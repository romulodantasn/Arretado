import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';
import { player } from '../player/player';

export class enemyGroup extends Phaser.Physics.Arcade.Sprite {
  private enemyGroup: Phaser.Physics.Arcade.Group;
  private enemySprite: Phaser.Physics.Arcade.Sprite;
  private player: player;

  constructor(scene: Phaser.Scene, player: player) {
    super(scene, 0, 0, 'enemy');
    this.player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.initializeEnemyGroup(scene);
  }

  private initializeEnemyGroup(scene: Phaser.Scene) {
    this.enemyGroup = scene.physics.add.group();

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

    scene.time.addEvent({
      delay: gameOptions.enemyRate,
      loop: true,
      callback: () => {
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
        this.enemySprite = scene.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'enemy');
        this.enemySprite.play('enemy', true);
        this.enemyGroup.add(this.enemySprite);
      },
    });
  }

  public updateEnemyMovement(scene: Phaser.Scene) {
    this.enemyGroup.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy instanceof Phaser.Physics.Arcade.Sprite) {
        scene.physics.moveToObject(enemy, this.player, gameOptions.enemySpeed);
      }
    });
  }

  public getEnemyGroup() {
    return this.enemyGroup;
  }
}
