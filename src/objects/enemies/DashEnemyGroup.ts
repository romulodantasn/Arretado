import Phaser from 'phaser';
import { currentEnemyStats } from '../../config/enemies/EnemiesContainer';
import { gameOptions } from '../../config/GameOptionsConfig';
import { Player } from '../player/Player';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';



export class DashEnemyGroup extends Phaser.Physics.Arcade.Group {
  private player: Player;
  private spawnedDashEnemiesCount: number = 0;

  constructor(scene: Phaser.Scene, player: Player) {
    super(scene.physics.world, scene);
    this.player = player;
    this.initializeDashEnemyGroup(scene);
    this.setDepth(10);
  }


   private initializeDashEnemyGroup(scene: Phaser.Scene) {
      const outerRectangle = new Phaser.Geom.Rectangle(
        -105,
        -105,
        gameOptions.gameSize.width + 200,
        gameOptions.gameSize.height + 200
      );
  
      const innerRectangle = new Phaser.Geom.Rectangle(
        -55,
        -55,
        gameOptions.gameSize.width + 100,
        gameOptions.gameSize.height + 100
      );
  
      scene.time.addEvent({
        delay: currentEnemyStats.DashEnemy.Rate,
        loop: true,
        callback: () => {
          const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
          const dashEnemy = this.create(spawnPoint.x, spawnPoint.y, 'dashEnemy') as Phaser.Physics.Arcade.Sprite;
          if(dashEnemy) {
            dashEnemy.setDepth(10)
            dashEnemy.setActive(true)
            dashEnemy.setVisible(true);
            dashEnemy.setScale(3);
            dashEnemy.setOffset(14, 18);
            
            const enemyId = `enemy_${Date.now()}_${Math.random().toString(16).slice(2)}`; 
            const enemyHealthComponent = new HealthComponent(
              currentEnemyStats.DashEnemy.Health,
              currentEnemyStats.DashEnemy.Health,
                enemyId 
            );
            dashEnemy.setData('healthComponent', enemyHealthComponent)
            this.spawnedDashEnemiesCount++;
          }
          if(dashEnemy) dashEnemy.play('dashEnemy', true);
        },
      });
    }
  

  public updateEnemyMovement(scene: Phaser.Scene) {
    const now = scene.time.now;
    this.getChildren().forEach((dashEnemy: Phaser.GameObjects.GameObject) => {
      if (dashEnemy.active && dashEnemy instanceof Phaser.Physics.Arcade.Sprite) {
        const lastDash = dashEnemy.getData('lastDash') || 0;
        const dashCooldown = dashEnemy.getData('dashCooldown') || 3000; // 3s 
        const isDashing = dashEnemy.getData('isDashing') || false;
         if (this.player.x < dashEnemy.x) {
          dashEnemy.setFlipX(false); // se estiver invertido
        } else {
          dashEnemy.setFlipX(true);
        }
        const direction = new Phaser.Math.Vector2 (
          this.player.x - dashEnemy.x,
          this.player.y - dashEnemy.y
        ).normalize();
        if (now - lastDash >= dashCooldown) {
          const dashSpeed = currentEnemyStats.DashEnemy.Speed * 80;
          dashEnemy.setVelocity(direction.x * dashSpeed, direction.y * dashSpeed);
          dashEnemy.setData('isDashing', true);
          dashEnemy.setData('lastDash', now);
          scene.time.delayedCall(200, () => {
            dashEnemy.setData('isDashing', false);
          });
        } if(!isDashing) {
          scene.physics.moveToObject(dashEnemy, this.player, currentEnemyStats.DashEnemy.Speed);
        }
      }
    });
  }

   public static getHealthComponent(enemy: Phaser.GameObjects.GameObject) {
      if (enemy && enemy.getData) {
        return enemy.getData('healthComponent') as HealthComponent || null;
      }
    }
  // public setWave(wave: number) {
  //   this.currentWave = wave;
  // }
}
