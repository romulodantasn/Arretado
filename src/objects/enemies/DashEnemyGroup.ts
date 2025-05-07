import Phaser from 'phaser';
import { EnemyTemplates, EnemyType } from '../../config/enemiesContainer';
import { gameOptions } from '../../config/gameOptionsConfig';
import { Player } from '../player/playerObject';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';
import { scaleEnemyBaseStats, scaleEnemySpecificStats } from "../../utils/scaleEnemy"; // Supondo que scaleEnemy está em utils

export class DashEnemyGroup extends Phaser.Physics.Arcade.Group {
  private player: Player;
  private enemyType: EnemyType = 'DashEnemy';
  private currentWave: number = 1;

  constructor(scene: Phaser.Scene, player: Player, wave: number) {
    super(scene.physics.world, scene);
    this.player = player;
    this.currentWave = wave;
    this.initializeEnemyGroup(scene);
    this.setDepth(10);
  }

  private getStatsForWave() {
    // Usar scaleEnemySpecificStats para DashEnemy se houver atributos específicos como DashCooldown
    return scaleEnemySpecificStats(this.enemyType, this.currentWave);
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
    const enemy = this.create(spawnPoint.x, spawnPoint.y, 'dash_enemy_texture') as Phaser.Physics.Arcade.Sprite; // Usar textura específica
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
      enemy.setData('dashCooldown', stats.DashCooldown); // Armazenar cooldown para lógica de dash

      // enemy.play('dash_enemy_animation', true);
    }
    return enemy;
  }

  public updateEnemyMovement(scene: Phaser.Scene) {
    const stats = this.getStatsForWave();
    this.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy.active && enemy instanceof Phaser.Physics.Arcade.Sprite) {
        // Lógica de movimento para DashEnemy: mover-se e executar dash periodicamente
        // Isso exigirá um timer por inimigo ou uma lógica de estado
        scene.physics.moveToObject(enemy, this.player, stats.Speed);
        // Implementar lógica de Dash aqui, usando o 'dashCooldown'
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

