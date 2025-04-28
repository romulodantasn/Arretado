import Phaser from "phaser";
  import { globalEventEmitter } from "../../components/events/globalEventEmitter";
  import { healthEvents } from "../../components/events/healthEvent";
  import { enemyStats, playerStats } from "../../config/gameOptionsConfig";
  
  export class EnemyHealth extends Phaser.Scene {
    #maxHealth: number;
    #currentMaxHealth= enemyStats.enemyHealth;
    #healthText!: Phaser.GameObjects.Text;
    #hasTakenDamage: boolean;
    
    readonly textStyle = {
      fontFamily: "Cordelina",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    };


    constructor() {
      super({
        key: 'EnemyHealth',
      });
    
    }
  
    create() {
      this.#currentMaxHealth;
      globalEventEmitter.on(healthEvents.healthChanged, this.handleHealthUpdate, this);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
          globalEventEmitter.off(healthEvents.healthChanged, this.handleHealthUpdate, this);
      });
    }

    private handleHealthUpdate(currentHealth: number, maxHealth: number, ownerId: string) {
      if(ownerId === 'enemy') {
        console.log(`Vida do Inimigo: Mudança detectada - Atual=${currentHealth}, Máximo=${maxHealth}`);
        this.#currentMaxHealth = maxHealth;
      }
    
    }
  }
