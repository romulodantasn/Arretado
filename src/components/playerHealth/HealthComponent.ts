import { healthEvents } from '../events/healthEvent';
import { globalEventEmitter } from '../events/globalEventEmitter';

export class HealthComponent {
  #currentHealth: number;
  #maxHealth: number;
  #ownerId: string;

  constructor(initialHealth: number, maxHealth: number, ownerId: string) {
    this.#currentHealth = initialHealth;
    this.#maxHealth = maxHealth;
    this.#ownerId = ownerId;

    setTimeout(() => {
      globalEventEmitter.emit(healthEvents.healthInitialized, this.#currentHealth, this.#maxHealth, this.#ownerId)
    }, 0);
  }

  get ownerId(): string {
    return this.#ownerId;
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
    if(healToFull){
      this.#currentHealth = this.#maxHealth;
    } else {
      this.#currentHealth = Math.min(this.#currentHealth, this.#maxHealth)
    }
    globalEventEmitter.emit(healthEvents.maxHealthChanged,this.#currentHealth, this.#maxHealth, this.#ownerId)

  }


  public loseHealth(damage: number): void {
    if (this.#currentHealth <= 0) {
      return
    }
      
     this.#currentHealth -= damage;

      if (this.#currentHealth < 0) {
        this.#currentHealth = 0;
      }
      globalEventEmitter.emit(healthEvents.healthChanged, this.#currentHealth, this.#maxHealth, this.#ownerId);
    }

    public isDead() : boolean {
      return this.#currentHealth <= 0;
    }
    
  }

