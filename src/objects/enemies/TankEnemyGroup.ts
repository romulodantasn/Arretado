import Phaser from 'phaser';
import { EnemyTemplates, EnemyType } from '../../config/enemiesContainer';
import { gameOptions } from '../../config/gameOptionsConfig';
import { Player } from '../player/playerObject';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';
import { scaleEnemyBaseStats } from "../../utils/scaleEnemy"; // Assumindo que scaleEnemy está em src/utils/

export class TankEnemyGroup extends Phaser.Physics.Arcade.Group {
  private player: Player;
  private enemyType: EnemyType = 'TankEnemy';
  private currentWave: number = 1;

  constructor(scene: Phaser.Scene, player: Player, wave: number) {
    super(scene.physics.world, scene);
    this.player = player;
    this.currentWave = wave;
    this.initializeEnemyGroup(scene);
    this.setDepth(10);
  }

  private getStatsForWave() {
    const baseStats = EnemyTemplates[this.enemyType];
    return scaleEnemyBaseStats(baseStats, this.currentWave);
  }

  private initializeEnemyGroup(scene: Phaser.Scene) {
    const stats = this.getStatsForWave();
    // O timer de spawn individual será gerenciado pela GameScene, que chamará spawnEnemy()
    // Exemplo de timer, mas a GameScene controlará a frequência e quantidade.
    scene.time.addEvent({
      delay: stats.Rate, 
      loop: true, // Será falso e controlado pela GameScene
      callback: () => {
        this.spawnEnemy(scene);
      },
    });
  }

  public spawnEnemy(scene: Phaser.Scene, outerRect?: Phaser.Geom.Rectangle, innerRect?: Phaser.Geom.Rectangle) {
    const stats = this.getStatsForWave();
    const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
        outerRect || new Phaser.Geom.Rectangle(-100, -100, gameOptions.gameSize.width + 200, gameOptions.gameSize.height + 200),
        innerRect || new Phaser.Geom.Rectangle(-50, -50, gameOptions.gameSize.width + 100, gameOptions.gameSize.height + 100)
    );
    // Usar uma textura específica para o TankEnemy, ex: 'tank_enemy_texture'
    const enemy = this.create(spawnPoint.x, spawnPoint.y, 'tank_enemy_texture') as Phaser.Physics.Arcade.Sprite;
    if (enemy) {
      enemy.setDepth(10);
      enemy.setActive(true).setVisible(true);
      
      const enemyId = `${this.enemyType}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const enemyHealthComponent = new HealthComponent(
        stats.Health,
        stats.Health,
        enemyId
      );

      enemy.setData('healthComponent', enemyHealthComponent);
      enemy.setData('damage', stats.Damage);
      enemy.setData('enemyType', this.enemyType);
      // Adicionar lógica de animação específica se necessário
      // enemy.play('tank_enemy_animation', true);
    }
    return enemy;
  }

  public updateEnemyMovement(scene: Phaser.Scene) {
    const stats = this.getStatsForWave();
    this.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy.active && enemy instanceof Phaser.Physics.Arcade.Sprite) {
        // Lógica de movimento para TankEnemy: geralmente mais lento mas resistente
        scene.physics.moveToObject(enemy, this.player, stats.Speed);
      }
    });
  }

  public static getHealthComponent(enemy: Phaser.GameObjects.GameObject): HealthComponent | null {
    if (enemy && enemy.getData) {
      return enemy.getData('healthComponent') as HealthComponent || null;
    }
    return null;
  }

  public setWave(wave: number) {
    this.currentWave = wave;
  }
}

