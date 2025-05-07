import { gameScene } from '../../scenes/gameScene';
import { Player } from '../../objects/player/playerObject';
import { enemyGroup } from '../../objects/enemies/BasicEnemyGroup';
import { basicEnemyStats, bossEnemyStats, gameOptions } from '../../config/gameOptionsConfig';
import { gameHud } from '../../objects/ui/gameHudUi';
import { HealthComponent } from '../playerHealth/HealthComponent';
import { healthEvents } from '../events/healthEvent';
import { BossEnemy } from '../../objects/enemies/BossEnemy';

export class collider {
  #scene: gameScene;
  #player: Player;
  #enemyGroup: enemyGroup; 
  #boss: BossEnemy;
  #playerHealth: HealthComponent; 
  #isInvulnerable: boolean = false;
  #playerEnemyCollider: Phaser.Physics.Arcade.Collider; 
  #playerBossCollider: Phaser.Physics.Arcade.Collider; 

  constructor(scene: gameScene, player: Player, enemyGroup: enemyGroup, boss: BossEnemy, playerHealth: HealthComponent) {
    this.#scene = scene;
    this.#player = player;
    this.#enemyGroup = enemyGroup;
    this.#boss = boss;
    this.#playerHealth = playerHealth;
  }

  create() {
    this.setupCollision();
  }

  public setupCollision() {
    this.#playerEnemyCollider = this.#scene.physics.add.collider(this.#player, this.#enemyGroup, () => {
      if (!this.#isInvulnerable) {
        this.#handlePlayerHit(basicEnemyStats.enemyDamage, this.#playerEnemyCollider); 
      }
    });

   
    if (this.#boss && this.#boss.active) {
        this.#playerBossCollider = this.#scene.physics.add.collider(this.#player, this.#boss, () => {
            if (!this.#isInvulnerable) {
                this.#handlePlayerHit(bossEnemyStats.bossDamage, this.#playerBossCollider);
            }
        });
    } else {
        console.warn("Boss instance not provided or inactive, skipping player-boss collider setup.");
    }
  }

  #handlePlayerHit(damage: number, colliderToDeactivate: Phaser.Physics.Arcade.Collider) {
    this.#scene.cameras.main.shake(200, 0.0025);
    this.#player.setTint(0xff0000);
    this.#scene.time.delayedCall(200, () => {
      this.#player.clearTint();
    });
    console.log(`Colisão detectada! Jogador perde ${damage} de vida.`);

    this.#playerHealth.loseHealth(damage);
    this.#scene.events.emit(
      healthEvents.loseHealth,
      this.#playerHealth.currentHealth,
      this.#playerHealth.currentHealth + damage 
    );

    if (this.#playerHealth.currentHealth <= 0) {
      this.#handlePlayerDeath();
      return;
    }

    this.#isInvulnerable = true;
    colliderToDeactivate.active = false;

    this.#scene.time.delayedCall(gameOptions.invulnerabilityDuration, () => {
      this.#isInvulnerable = false;
      if (this.#playerEnemyCollider) this.#playerEnemyCollider.active = true;
      if (this.#playerBossCollider) this.#playerBossCollider.active = true;
    });
  }

  // Método auxiliar para lidar com a morte do jogador
  #handlePlayerDeath() {
    console.log('Jogador morreu. Reiniciando o jogo.');
    this.#scene.scene.stop('healthUi');
    this.#scene.scene.stop('PlayerHealthBar'); // Parar a barra de vida também

    const gameHud = this.#scene.scene.get('gameHud') as gameHud;
    if (gameHud) {
      // Resetar stats globais TODO-> trocar futuramente por um GameStateManager
      gameOptions.currentWave = 1;
      gameOptions.currentAct = 1;
      basicEnemyStats.enemyRate = 800;
      console.log('enemyRate Reset: ' + basicEnemyStats.enemyRate);
      gameHud.shouldIncrementWave = true; 
      gameHud.updateHud(); 
    }
    this.#scene.scene.restart();
  }
}
