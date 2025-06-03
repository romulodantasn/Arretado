import Phaser from 'phaser';
import { gameOptions } from '../../config/GameOptionsConfig';
import { currentEnemyStats } from '../../config/enemies/EnemiesContainer';
import { Player } from '../player/Player';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';
export class TankEnemyGroup extends Phaser.Physics.Arcade.Group {
  private player: Player;
  private spawnedTankEnemyCount: number = 0;

  constructor(scene: Phaser.Scene, player: Player) {
    super(scene.physics.world, scene);
    this.player = player;
    this.initializeTankEnemyGroup(scene);
    this.setDepth(10);
  }

 

  private initializeTankEnemyGroup(scene: Phaser.Scene) {
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
      delay: currentEnemyStats.TankEnemy.Rate,
      loop: true,
      callback: () => {
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
        const TankEnemy = this.create(spawnPoint.x, spawnPoint.y, 'enemy') as Phaser.Physics.Arcade.Sprite;
        if(TankEnemy) {
            TankEnemy.setDepth(10)
            TankEnemy.setActive(true).setVisible(true);
            TankEnemy.setScale(3);
            TankEnemy.setOffset(14, 18);
          
          const enemyId = `enemy_${Date.now()}_${Math.random().toString(16).slice(2)}`; 
          const enemyHealthComponent = new HealthComponent(
            currentEnemyStats.TankEnemy.Health,
            currentEnemyStats.TankEnemy.Health,
              enemyId 
          );
          TankEnemy.setData('healthComponent', enemyHealthComponent)
            this.spawnedTankEnemyCount++;
        }
        if (TankEnemy) TankEnemy.play('tankEnemy', true); 
      },
    });
  }

  public updateEnemyMovement(scene: Phaser.Scene) {
    this.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy.active && enemy instanceof Phaser.Physics.Arcade.Sprite) {
        scene.physics.moveToObject(enemy, this.player, currentEnemyStats.TankEnemy.Speed);
         if (this.player.x < enemy.x) {
          enemy.setFlipX(true);
        } else {
          enemy.setFlipX(false);
        }
      }
    });
  }

  public static getHealthComponent(enemy: Phaser.GameObjects.GameObject) {
    if (enemy && enemy.getData) {
      return enemy.getData('healthComponent') as HealthComponent || null;
    }
  }
}
