import { gameScene } from '../../scenes/gameScene';
import { player } from '../../objects/player/playerObject';
import { enemyGroup } from '../../objects/enemies/enemyObject';
import { gameOptions } from '../../config/gameOptionsConfig';
import { gameHud } from '../../objects/ui/gameHudUi';
import { healthComponent } from '../health/healthComponent';
import { healthEvents } from '../events/healthEvent';

export class collider {
  #scene: gameScene;
  #player: player;
  #enemy: enemyGroup;
  #health: healthComponent;
  #isInvulnerable: boolean = false;
  #collider: Phaser.Physics.Arcade.Collider;

  constructor(scene: gameScene, player: player, enemy: enemyGroup, health: healthComponent) {
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

        this.#health.loseHealth(gameOptions.enemyDamage);
        this.#scene.events.emit(
          healthEvents.loseHealth,
          this.#health.currentHealth,
          this.#health.currentHealth + gameOptions.enemyDamage
        );

        if (this.#health.currentHealth <= 0) {
          console.log('Jogador morreu. Reiniciando o jogo.');

          this.#scene.scene.stop('healthUi');

          const gameHud = this.#scene.scene.get('gameHud') as gameHud;
          if (gameHud) {
            gameOptions.currentWave = 1;
            gameOptions.currentAct = 1;
            gameOptions.enemyRate = 800;
            console.log('enemyRate Reset: ' + gameOptions.enemyRate);
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
