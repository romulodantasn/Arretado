import Phaser from "phaser";
  import { globalEventEmitter } from "../../components/events/globalEventEmitter";
  import { healthEvents } from "../../components/events/healthEvent";
  import { gameOptions } from "../../config/gameOptionsConfig";
  
  export class healthUi extends Phaser.Scene {
    #healthBar!: Phaser.GameObjects.Image;
    #maxHealth: number;
    #healthBarWidth: number = 250; 
    #healthBarHeight: number = 45;
    #currentMaxHealth: number = 0;
    #healthText!: Phaser.GameObjects.Text;
    #hasTakenDamage: boolean = false;
    textStyle = {
      fontFamily: "Cordelina",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    };


    constructor() {
      super({
        key: 'healthUi',
      });
    
    }
  
    create() {
      const barX = 25;
      const barY = 45;  
      const initialPlaceholderMax = gameOptions.playerHealth;

   
      this.add.image(barX, barY, 'health-frame')
        .setOrigin(0, 0.5)
        .setDisplaySize(this.#healthBarWidth, this.#healthBarHeight);
      this.#healthBar = this.add.image(barX, barY, 'health-bar')
        .setOrigin(0, 0.5) 
        .setDisplaySize(this.#healthBarWidth, this.#healthBarHeight);

     
      this.#currentMaxHealth = initialPlaceholderMax;
      this.#healthText = this.add.text(145, 45, `${initialPlaceholderMax} / ${initialPlaceholderMax}`, this.textStyle).setOrigin(0.5);
      this.#hasTakenDamage = false;

      globalEventEmitter.on(healthEvents.healthInitialized, this.handleHealthUpdate, this);
      globalEventEmitter.on(healthEvents.healthChanged, this.handleHealthUpdate, this);
      globalEventEmitter.on(healthEvents.maxHealthChanged, this.handleHealthUpdate, this);
      console.log('healthUi: elementos e listeners criados')

      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
          console.log('HealthUi desligando, removendo listeners');
          globalEventEmitter.off(healthEvents.healthInitialized, this.handleHealthUpdate, this);
          globalEventEmitter.off(healthEvents.healthChanged, this.handleHealthUpdate, this);
          globalEventEmitter.off(healthEvents.maxHealthChanged, this.handleHealthUpdate, this);
      });
    }

    private handleHealthUpdate(currentHealth: number, maxHealth: number) {
      console.log(`HealthUI: Mudança detectada - Atual=${currentHealth}, Máximo=${maxHealth}`);

      this.#currentMaxHealth = maxHealth;
      this.#hasTakenDamage = true;
      this.updateHealthBar(currentHealth);
    }


    private updateHealthBar(currentHealth: number) {
      const maxHealth = this.#currentMaxHealth > 0 ? this.#currentMaxHealth : 1;
      const clampedHealth = Phaser.Math.Clamp(currentHealth, 0, maxHealth);
      const healthRatio = clampedHealth / maxHealth;
      const newWidth = this.#healthBarWidth * healthRatio;

      console.log(`Atualizando health bar: Atual=${clampedHealth}, Maximo=${maxHealth}, Ratio=${healthRatio.toFixed(2)}, NewWidth=${newWidth.toFixed(2)}`);
  
      this.#healthBar.setCrop(0, 0, newWidth, this.#healthBarHeight);
      this.#healthText.setText(`${clampedHealth} / ${maxHealth}`);
   
    }
  }
