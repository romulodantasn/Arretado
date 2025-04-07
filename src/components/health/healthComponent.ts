import { gameOptions } from '../../config/gameOptionsConfig';
import { healthEvents } from '../events/healthEvent';
import { globalEventEmitter } from '../events/globalEventEmitter';

export class healthComponent {
  #currentHealth: number;
  #maxHealth: number;

  constructor() {
    this.#currentHealth = gameOptions.playerHealth;
    this.#maxHealth = gameOptions.playerHealth;
    console.log(`healthComponent criado. MaxHealth: ${this.#maxHealth})`);
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

      globalEventEmitter.emit(healthEvents.loseHealth, this.#currentHealth, prevHealth);
      console.log(`Jogador perdeu ${damage} ponto(s) de vida. Vida atual: ${this.#currentHealth}`);
    }
  }
}
