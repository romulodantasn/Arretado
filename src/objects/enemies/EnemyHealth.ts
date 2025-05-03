// import Phaser from "phaser";
//   import { globalEventEmitter } from "../../components/events/globalEventEmitter";
//   import { healthEvents } from "../../components/events/healthEvent";
//   import { basicEnemyStats, playerStats } from "../../config/gameOptionsConfig";
  
//   export class EnemyHealth extends Phaser.Scene {
//     #maxHealth: number;
//     #currentMaxHealth= basicEnemyStats.enemyHealth;


//     constructor() {
//       super({
//         key: 'EnemyHealth',
//       });
    
//     }
  
//     create() {
//       this.#currentMaxHealth;
//       globalEventEmitter.on(healthEvents.healthChanged, this.handleHealthUpdate, this);
//       this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
//           globalEventEmitter.off(healthEvents.healthChanged, this.handleHealthUpdate, this);
//       });
//     }

//     private handleHealthUpdate(currentHealth: number, maxHealth: number, ownerId: string) {
//       if(ownerId === 'enemy') {
//         console.log(`Vida do Inimigo: Mudança detectada - Atual=${currentHealth}, Máximo=${maxHealth}`);
//         this.#currentMaxHealth = maxHealth;
//       }
    
//     }
//   }
