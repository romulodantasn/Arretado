import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';
import { player } from '../player/player';

export class enemyGroup extends Phaser.Physics.Arcade.Group {
  private player: player;

  constructor(scene: Phaser.Scene, player: player) {
    super(scene.physics.world, scene);
    this.player = player;
    scene.add.existing(this);

    this.initializeEnemyGroup(scene);
    this.setDepth(10);
  }

  private initializeEnemyGroup(scene: Phaser.Scene) {
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
        const enemy = this.create(spawnPoint.x, spawnPoint.y, 'enemy') as Phaser.Physics.Arcade.Sprite;
        enemy.play('enemy', true);
      },
    });
  }

  public updateEnemyMovement(scene: Phaser.Scene) {
    this.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy instanceof Phaser.Physics.Arcade.Sprite) {
        scene.physics.moveToObject(enemy, this.player, gameOptions.enemySpeed);
      }
    });
  }
}
