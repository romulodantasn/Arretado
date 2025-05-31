import Phaser from "phaser";
import { globalEventEmitter } from "../../components/events/globalEventEmitter";
import { healthEvents } from "../../components/events/healthEvent";
import { currentEnemyStats } from "../../config/enemies/EnemiesContainer";

export class BossHealthBar extends Phaser.Scene {
  #healthBar!: Phaser.GameObjects.Image;
  #healthBarWidth: number = 800; // Barra maior para o boss
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
    color: "#ff0000", // Vermelho para dar destaque
    stroke: "#000000",
    strokeThickness: 6,
  };

  constructor() {
    super({
      key: 'BossHealthBar',
    });
  }

  create() {
    // Posiciona a barra na parte inferior da tela
    const barX = (this.cameras.main.width - this.#healthBarWidth) / 2; // Centralizado
    const barY = this.cameras.main.height - 100; // 100 pixels do fundo
    
    // Nome do Boss
    this.#bossNameText = this.add.text(
      this.cameras.main.width / 2,
      barY - 50,
      'JUAZEIRO ANCESTRAL',
      this.bossNameStyle
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(100);

    // Frame da barra de vida
    this.add.image(barX, barY, 'health-frame')
      .setOrigin(0, 0.5)
      .setDisplaySize(this.#healthBarWidth, this.#healthBarHeight)
      .setScrollFactor(0)
      .setDepth(100);

    // Barra de vida
    this.#healthBar = this.add.image(barX, barY, 'health-bar')
      .setOrigin(0, 0.5)
      .setDisplaySize(this.#healthBarWidth, this.#healthBarHeight)
      .setScrollFactor(0)
      .setTint(0xff0000) // Vermelho para o boss
      .setDepth(100);

    // Texto da vida
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

    // Efeito de fade in na entrada
    this.tweens.add({
      targets: [this.#healthBar, this.#healthText, this.#bossNameText],
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Power2'
    });

    // Event listeners
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
    // Verifica se o evento é do boss
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

    // Atualiza a barra com uma animação suave
    this.tweens.add({
      targets: this.#healthBar,
      displayWidth: newWidth,
      duration: 200,
      ease: 'Power2'
    });

    this.#healthText.setText(`${clampedHealth} / ${maxHealth}`);

    // Se o boss morrer, faz um fade out na barra
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