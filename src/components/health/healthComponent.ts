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

    setTimeout(() => {
      globalEventEmitter.emit(healthEvents.healthInitialized, this.#currentHealth, this.#maxHealth)
    }, 0);
  }

  get maxHealth(): number {
    return this.#maxHealth;
  }

  get currentHealth(): number {
    return this.#currentHealth;
  }

  public increaseHealth(amount: number, healToFull: boolean = false) : void {
    if(amount <= 0 ) return;
    this.#maxHealth += amount ;
    console.log( `healthComponent: vida maxima aumentada em ${amount}. Nova vida maxima: ${this.#maxHealth}`)
    if(healToFull){
      this.#currentHealth = this.#maxHealth;
      console.log(`healthComponent: vida maxima aumentada em ${amount}. Nova vida maxima: ${this.#maxHealth}`)
    } else {
      this.#currentHealth = Math.min(this.#currentHealth, this.#maxHealth)
    }
    globalEventEmitter.emit(healthEvents.maxHealthChanged,this.#currentHealth, this.#maxHealth)

  }


  public loseHealth(damage: number): void {
    if (this.#currentHealth <= 0) {
      return
    }
    
      const prevHealth = this.#currentHealth;
      this.#currentHealth -= damage;

      if (this.#currentHealth < 0) {
        this.#currentHealth = 0;
      }
      globalEventEmitter.emit(healthEvents.healthChanged, this.#currentHealth, this.#maxHealth);
      console.log(`Jogador perdeu ${damage} ponto(s) de vida. Vida atual: ${this.#currentHealth}/${this.#maxHealth}`);
    }
  }

