import Phaser from "phaser";
import { globalEventEmitter } from "../../components/events/globalEventEmitter";
import { healthEvents } from "../../components/events/healthEvent";
import { playerStats } from "../../config/player/PlayerConfig";
  
  export class PlayerHealthBar extends Phaser.Scene {
    #healthBar!: Phaser.GameObjects.Image;
    #healthBarWidth: number = 250; 
    #healthBarHeight: number = 45;
    #currentMaxHealth: number = 0;
    #healthText!: Phaser.GameObjects.Text;
    
    readonly textStyle = {
      fontFamily: "Cordelina",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    };


    constructor() {
      super({
        key: 'PlayerHealthBar',
      });
    
    }
  
    create() {
      const barX = 25;
      const barY = 45;  
   
      this.add.image(barX, barY, 'health-frame')
        .setOrigin(0, 0.5)
        .setDisplaySize(this.#healthBarWidth, this.#healthBarHeight)
        .setScrollFactor(0);

      this.#healthBar = this.add.image(barX, barY, 'health-bar')
        .setOrigin(0, 0.5) 
        .setDisplaySize(this.#healthBarWidth, this.#healthBarHeight)
        .setScrollFactor(0)

     const initialPlayerHealth = playerStats.Health
     this.#currentMaxHealth = initialPlayerHealth;
     const textX = barX + this.#healthBarWidth / 2;
     this.#healthText = this.add.text(textX, barY, ` ${initialPlayerHealth} / ${initialPlayerHealth}`, this.textStyle)
     .setOrigin(0.5)
     .setScrollFactor(0)
     

      globalEventEmitter.on(healthEvents.healthInitialized, this.handleHealthUpdate, this);
      globalEventEmitter.on(healthEvents.healthChanged, this.handleHealthUpdate, this);
      globalEventEmitter.on(healthEvents.maxHealthChanged, this.handleHealthUpdate, this);

      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
          globalEventEmitter.off(healthEvents.healthInitialized, this.handleHealthUpdate, this);
          globalEventEmitter.off(healthEvents.healthChanged, this.handleHealthUpdate, this);
          globalEventEmitter.off(healthEvents.maxHealthChanged, this.handleHealthUpdate, this);
      });
    }

    private handleHealthUpdate(currentHealth: number, maxHealth: number, ownerId: string) {
      if (ownerId === 'player') {
        this.#currentMaxHealth = maxHealth;
        this.updateHealthBar(currentHealth);
      }
    }


    private updateHealthBar(currentHealth: number) {
      const maxHealth = this.#currentMaxHealth > 0 ? this.#currentMaxHealth : 1;
      const clampedHealth = Phaser.Math.Clamp(currentHealth, 0, maxHealth);
      const healthRatio = clampedHealth / maxHealth;
      const newWidth = this.#healthBarWidth * healthRatio;
  
      this.#healthBar.setCrop(0, 0, newWidth, this.#healthBarHeight);
      this.#healthText.setText(`${clampedHealth} / ${maxHealth}`);
   
    }
  }
