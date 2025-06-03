import Phaser from "phaser";
import { globalEventEmitter } from "../../components/events/globalEventEmitter";
import { healthEvents } from "../../components/events/healthEvent";
import { currentEnemyStats } from "../../config/enemies/EnemiesContainer";

export class BossHealthBar extends Phaser.Scene {
  #healthBar!: Phaser.GameObjects.Image;
  #healthBarWidth: number = 800; 
  #healthBarHeight: number = 45;
  #currentMaxHealth: number = 0;
  #healthText!: Phaser.GameObjects.Text;
  #bossNameText!: Phaser.GameObjects.Text;
  
  readonly textStyle = {
    fontFamily: "Cordelina",
    fontSize: "32px",
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4,
  };

  readonly bossNameStyle = {
    fontFamily: "Cordelina",
    fontSize: "48px",
    color: "#ff0000", 
    stroke: "#000000",
    strokeThickness: 6,
  };

  constructor() {
    super({
      key: 'BossHealthBar',
    });
  }

  create() {
    const barX = (this.cameras.main.width - this.#healthBarWidth) / 2; 
    const barY = this.cameras.main.height - 100; 
    
    this.#bossNameText = this.add.text(
      this.cameras.main.width / 2,
      barY - 50,
      'JUAZEIRO ANCESTRAL',
      this.bossNameStyle
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(100);

    this.add.image(barX, barY, 'health-frame')
      .setOrigin(0, 0.5)
      .setDisplaySize(this.#healthBarWidth, this.#healthBarHeight)
      .setScrollFactor(0)
      .setDepth(100);

    this.#healthBar = this.add.image(barX, barY, 'health-bar')
      .setOrigin(0, 0.5)
      .setDisplaySize(this.#healthBarWidth, this.#healthBarHeight)
      .setScrollFactor(0)
      .setTint(0xff0000) 
      .setDepth(100);

    const initialBossHealth = currentEnemyStats.BossEnemy.Health;
    this.#currentMaxHealth = initialBossHealth;
    const textX = barX + this.#healthBarWidth / 2;
    this.#healthText = this.add.text(
      textX,
      barY,
      `${initialBossHealth} / ${initialBossHealth}`,
      this.textStyle
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(100);

    this.tweens.add({
      targets: [this.#healthBar, this.#healthText, this.#bossNameText],
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Power2'
    });

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
    if (ownerId.startsWith('boss_')) {
      this.#currentMaxHealth = maxHealth;
      this.updateHealthBar(currentHealth);
    }
  }

  private updateHealthBar(currentHealth: number) {
    const maxHealth = this.#currentMaxHealth > 0 ? this.#currentMaxHealth : 1;
    const clampedHealth = Phaser.Math.Clamp(currentHealth, 0, maxHealth);
    const healthRatio = clampedHealth / maxHealth;
    const newWidth = this.#healthBarWidth * healthRatio;

    this.tweens.add({
      targets: this.#healthBar,
      displayWidth: newWidth,
      duration: 200,
      ease: 'Power2'
    });

    this.#healthText.setText(`${clampedHealth} / ${maxHealth}`);

    if (currentHealth <= 0) {
      this.tweens.add({
        targets: [this.#healthBar, this.#healthText, this.#bossNameText],
        alpha: 0,
        duration: 1000,
        ease: 'Power2'
      });
    }
  }
} 