import { gameScene } from '../../scenes/gameScene';
import { player } from '../../objects/player/playerObject';
import { enemyGroup } from '../../objects/enemies/enemyObject';
import { enemyStats, gameOptions } from '../../config/gameOptionsConfig';
import { gameHud } from '../../objects/ui/gameHudUi';
import { playerHealthComponent } from '../playerHealth/HealthComponent';
import { healthEvents } from '../events/healthEvent';

export class collider {
  #scene: gameScene;
  #player: player;
  #enemy: enemyGroup;
  #health: playerHealthComponent;
  #isInvulnerable: boolean = false;
  #collider: Phaser.Physics.Arcade.Collider;

  constructor(scene: gameScene, player: player, enemy: enemyGroup, health: playerHealthComponent) {
    this.#scene = scene;
    this.#player = player;
    this.#enemy = enemy;
    this.#health = health;
  }

  create() {
    this.setupCollision();
  }

  public setupCollision() {
    this.#collider = this.#scene.physics.add.collider(this.#player, this.#enemy, () => {
      if (!this.#isInvulnerable) {
        console.log('Colisão detectada! Jogador perde vida.');

        this.#health.loseHealth(enemyStats.enemyDamage);
        this.#scene.events.emit(
          healthEvents.loseHealth,
          this.#health.currentHealth,
          this.#health.currentHealth + enemyStats.enemyDamage
        );

        if (this.#health.currentHealth <= 0) {
          console.log('Jogador morreu. Reiniciando o jogo.');

          this.#scene.scene.stop('healthUi');

          const gameHud = this.#scene.scene.get('gameHud') as gameHud;
          if (gameHud) {
            gameOptions.currentWave = 1;
            gameOptions.currentAct = 1;
            enemyStats.enemyRate = 800;
            console.log('enemyRate Reset: ' + enemyStats.enemyRate);
            gameHud.shouldIncrementWave = true;
            gameHud.updateHud();
          }

          this.#scene.scene.start('GameOverScene');
          this.#scene.scene.restart();
        }

        this.#isInvulnerable = true;

        this.#collider.active = false;

        this.#scene.time.delayedCall(gameOptions.invulnerabilityDuration, () => {
          this.#isInvulnerable = false;
          this.#collider.active = true;
        });
      }
    });
  }
}
