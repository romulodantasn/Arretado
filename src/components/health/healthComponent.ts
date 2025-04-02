import { gameOptions } from '../../config/gameOptionsConfig';
import { healthEvents } from '../events/healthEvent';

export class healthComponent {
  #customEventEmitter: Phaser.Events.EventEmitter;
  #currentHealth: number;
  #maxHealth: number;

  constructor(customEventEmitter: Phaser.Events.EventEmitter) {
    this.#currentHealth = gameOptions.playerHealth;
    this.#maxHealth = gameOptions.playerHealth;
    this.#customEventEmitter = customEventEmitter;
  }

  get maxHealth(): number {
    return this.#maxHealth;
  }

  get currentHealth(): number {
    return this.#currentHealth;
  }

  public loseHealth(damage: number): void {
    if (this.#currentHealth > 0) {
      const prevHealth = this.#currentHealth;
      this.#currentHealth -= damage;

      if (this.#currentHealth < 0) {
        this.#currentHealth = 0;
      }

      this.#customEventEmitter.emit(healthEvents.loseHealth, this.#currentHealth, prevHealth);
      console.log('Evento loseHealth emitido:', {
        currentHealth: this.#currentHealth,
        prevHealth,
      });
      console.log(`Jogador perdeu ${damage} ponto(s) de vida. Vida atual: ${this.#currentHealth}`);
    }
  }
}
