import { healthEvents } from '../../components/events/healthEvent';
import { healthComponent } from '../../components/health/healthComponent';
import { globalEventEmitter } from '../../components/events/globalEventEmitter';

export class healthUi extends Phaser.Scene {
  #health: healthComponent;
  #hearts: Phaser.GameObjects.Sprite[];

  private static readonly healthAnimations = {
    loseFirstHalf: 'loseFirstHalf',
    loseSecondHalf: 'loseSecondHalf',
  } as const;

  constructor() {
    super({ key: 'healthUi' });
    this.#hearts = [];
  }

  init(data: { health: healthComponent }) {
    this.#health = data.health;
    this.#createHearts();
  }

  create() {
    globalEventEmitter.on(healthEvents.loseHealth, (newHealth: number, prevHealth: number) => {
      console.log('Evento loseHealth recebido:', { newHealth, prevHealth });
      this.#handleHealthLoss(newHealth, prevHealth);
    });
  }

  #handleHealthLoss(newHealth: number, prevHealth: number) {
    const heartIndex = Math.floor(prevHealth / 2) - 1;
    const isHalfHeart = prevHealth % 2 === 1;

    if (heartIndex >= 0 && heartIndex < this.#hearts.length) {
      if (isHalfHeart) {
        this.#hearts[heartIndex].play(healthUi.healthAnimations.loseSecondHalf);
      } else {
        this.#hearts[heartIndex].play(healthUi.healthAnimations.loseFirstHalf);
      }
    } else {
      console.warn(`Índice inválido para coração: ${heartIndex}`);
    }
  }

  #createHearts(): void {
    this.#hearts = [];
    const numberOfHearts = Math.floor(this.#health.maxHealth / 2);

    for (let i = 0; i < numberOfHearts; i++) {
      const heart = this.add
        .sprite(10 + i * 50, 10, 'health-bar', 0)
        .setScale(6)
        .setOrigin(0);
      this.#hearts.push(heart);
    }
  }
}
