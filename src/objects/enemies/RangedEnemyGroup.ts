import Phaser from 'phaser';
import { EnemyTemplates, EnemyType } from '../../config/enemiesContainer';
import { gameOptions } from '../../config/gameOptionsConfig';
import { Player } from '../player/playerObject';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';
import { scaleEnemyBaseStats } from "../../utils/scaleEnemy"; // Supondo que scaleEnemy está em utils

export class RangedEnemyGroup extends Phaser.Physics.Arcade.Group {
  private player: Player;
  private enemyType: EnemyType = 'RangedEnemy';
  private currentWave: number = 1; // Adicionar um valor padrão ou receber via construtor

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

    // Este timer controla o spawn de UM inimigo. A GameScene controlará quantos e quando chamar este grupo.
    // Para múltiplos spawns, a GameScene chamaria um método como `spawnEnemy()` deste grupo.
    // Por enquanto, manteremos um spawn de exemplo, mas isso será ajustado.
    scene.time.addEvent({
      delay: stats.Rate, // Usar a taxa do inimigo escalonado
      loop: true, // Isso provavelmente será falso e controlado pela GameScene
      callback: () => {
        this.spawnEnemy(scene, outerRectangle, innerRectangle);
      },
    });
  }

  public spawnEnemy(scene: Phaser.Scene, outerRect?: Phaser.Geom.Rectangle, innerRect?: Phaser.Geom.Rectangle) {
    const stats = this.getStatsForWave();
    const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
        outerRect || new Phaser.Geom.Rectangle(-100, -100, gameOptions.gameSize.width + 200, gameOptions.gameSize.height + 200),
        innerRect || new Phaser.Geom.Rectangle(-50, -50, gameOptions.gameSize.width + 100, gameOptions.gameSize.height + 100)
    );
    const enemy = this.create(spawnPoint.x, spawnPoint.y, 'ranged_enemy_texture') as Phaser.Physics.Arcade.Sprite; // Usar textura específica
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
      // enemy.play('ranged_enemy_animation', true);
    }
    return enemy;
  }

  public updateEnemyMovement(scene: Phaser.Scene) {
    const stats = this.getStatsForWave();
    this.getChildren().forEach((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy.active && enemy instanceof Phaser.Physics.Arcade.Sprite) {
        // Lógica de movimento específica para RangedEnemy (pode ser diferente do BasicEnemy)
        // Por exemplo, manter distância, atirar, etc.
        // Por enquanto, movimento simples em direção ao jogador:
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

  // Método para atualizar a onda, se necessário, para reescalonar estatísticas
  public setWave(wave: number) {
    this.currentWave = wave;
    // Poderia reconfigurar timers de spawn ou outras lógicas baseadas na nova onda aqui
  }
}

