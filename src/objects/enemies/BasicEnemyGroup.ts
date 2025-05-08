import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptionsConfig';
import { BaseEnemyStatsStructure, currentEnemyStats } from '../../config/enemiesContainer';
import { Player } from '../player/playerObject';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';
export class BasicEnemyGroup extends Phaser.Physics.Arcade.Group {
  private player: Player;

  constructor(scene: Phaser.Scene, player: Player) {
    super(scene.physics.world, scene);
    this.player = player;
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
      delay: currentEnemyStats.BasicEnemy.Rate,
      loop: true,
      callback: () => {
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
        const enemy = this.create(spawnPoint.x, spawnPoint.y, 'enemy') as Phaser.Physics.Arcade.Sprite;
        if(enemy) {
          enemy.setDepth(10)
          enemy.setActive(true).setVisible(true);
          
          const enemyId = `enemy_${Date.now()}_${Math.random().toString(16).slice(2)}`; 
          const enemyHealthComponent = new HealthComponent(
            currentEnemyStats.BasicEnemy.Health,
            currentEnemyStats.BasicEnemy.Health,
              enemyId 
          );
          enemy.setData('healthComponent', enemyHealthComponent)
        }
        enemy.play('enemy', true);
        
      },
    });
  }

  public updateEnemyMovement(scene: Phaser.Scene) {
    this.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy.active && enemy instanceof Phaser.Physics.Arcade.Sprite) {
        scene.physics.moveToObject(enemy, this.player, currentEnemyStats.BasicEnemy.Speed);
      }
    });
  }

  public static getHealthComponent(enemy: Phaser.GameObjects.GameObject) {
    if (enemy && enemy.getData) {
      return enemy.getData('healthComponent') as HealthComponent || null;
    }
  }
}
