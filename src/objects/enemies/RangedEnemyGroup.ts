import Phaser from 'phaser';
import { gameOptions } from '../../config/GameOptionsConfig';
import { currentEnemyStats } from '../../config/enemies/EnemiesContainer';
import { Player } from '../player/Player';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';

export class RangedEnemyGroup extends Phaser.Physics.Arcade.Group {
  private player: Player;
  public bulletGroup: Phaser.Physics.Arcade.Group;
  private spawnedRangedEnemiesCount: number = 0;

  constructor(scene: Phaser.Scene, player: Player) {
    super(scene.physics.world, scene);
    this.player = player;
    this.bulletGroup = this.scene.physics.add.group();
    this.initializeRangedEnemyGroup(scene);
    this.setupContinuousShooting(scene);
    this.setDepth(10);
  }

  private initializeRangedEnemyGroup(scene: Phaser.Scene) {
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
      delay: currentEnemyStats.RangedEnemy.Rate,
      loop: true,
      callback: () => {
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
        const rangedEnemy = this.create(spawnPoint.x, spawnPoint.y, 'enemy') as Phaser.Physics.Arcade.Sprite;
        

        if (rangedEnemy) {
          rangedEnemy.setDepth(10).
          setActive(true).setVisible(true).play('rangedEnemy', true);
          rangedEnemy.setDisplaySize(64,64);
        

          const enemyId = `enemy_${Date.now()}_${Math.random().toString(16).slice(2)}`;
          const enemyHealthComponent = new HealthComponent(
            currentEnemyStats.RangedEnemy.Health,
            currentEnemyStats.RangedEnemy.Health,
            enemyId
          );
          rangedEnemy.setData('healthComponent', enemyHealthComponent);

          this.spawnedRangedEnemiesCount++;
        }
      },
    });
  }

  private setupContinuousShooting(scene: Phaser.Scene) {
    scene.time.addEvent({
      delay: currentEnemyStats.RangedEnemy.FireRate || 1000, 
      loop: true,
      callback: () => {
        this.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
          if (enemy.active && enemy instanceof Phaser.Physics.Arcade.Sprite) {
            const bullet = this.scene.physics.add.sprite(enemy.x, enemy.y, 'enemyBullet');
            this.bulletGroup.add(bullet);
            bullet.play('enemyBullet');
            scene.physics.moveToObject(bullet, this.player, currentEnemyStats.RangedEnemy.BulletSpeed);
          }
        });
      },
    });
  }

  public updateEnemyMovement(scene: Phaser.Scene) {
    this.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy.active && enemy instanceof Phaser.Physics.Arcade.Sprite) {
        scene.physics.moveToObject(enemy, this.player, currentEnemyStats.RangedEnemy.Speed);
      }
    });
  }

  public static getHealthComponent(enemy: Phaser.GameObjects.GameObject) {
    if (enemy && enemy.getData) {
      return enemy.getData('healthComponent') as HealthComponent || null;
    }
  }
}
