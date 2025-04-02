import { healthEvents } from '../../components/events/healthEvent';
import { healthComponent } from '../../components/health/healthComponent';

export class healthUi extends Phaser.Scene {
  #customEventEmitter: Phaser.Events.EventEmitter;
  #health: healthComponent;

  constructor() {
    super({ key: 'healthUi' });
  }

  init(data: { emitter: Phaser.Events.EventEmitter; health: healthComponent }) {
    console.log('healthUi init data:', data);
    this.#customEventEmitter = data.emitter;
    this.#health = data.health;
  }

  create() {
    const healthAnimations = {
      loseFirstHalf: 'loseFirstHalf',
      loseSecondHalf: 'loseSecondHalf',
    } as const;

    this.#createHearts();
    const hearts = this.#createHearts();
    console.log('EventEmitter em create:', this.#customEventEmitter);
    console.log('Métodos disponíveis:', Object.keys(this.#customEventEmitter));
    console.log('É um EventEmitter?', this.#customEventEmitter instanceof Phaser.Events.EventEmitter);
    console.log('this.anims:', this.anims);
    console.log('Métodos disponíveis:', Object.keys(this.#customEventEmitter));
    console.log('Tipo de on:', typeof this.#customEventEmitter.on);

    this.#customEventEmitter.on(healthEvents.loseHealth, (newHealth: number, prevHealth: number) => {
      console.log('Evento loseHealth recebido:', { newHealth, prevHealth });
      this.#handleHealthLoss(newHealth, prevHealth, hearts);
    });
    this.scene.launch('healthUi', { emitter: this.events, health: this.#health });
    console.log('Health UI lançada com emitter:', this.events);
  }

  #handleHealthLoss(newHealth: number, prevHealth: number, hearts: Phaser.GameObjects.Sprite[]) {
    console.log('Evento loseHealth recebido:', { newHealth, prevHealth });

    const heartIndex = Math.floor(prevHealth / 2) - 1;
    const isHalfHeart = prevHealth % 2 === 1;
    console.log(`Executando animação no coração ${heartIndex}, nova vida: ${newHealth}`);

    if (heartIndex >= 0 && heartIndex < hearts.length) {
      if (isHalfHeart) {
        console.log(`Executando animação loseSecondHalf no coração ${heartIndex}`);
        hearts[heartIndex].play('loseSecondHalf');
      } else {
        console.log(`Executando animação loseFirstHalf no coração ${heartIndex}`);
        hearts[heartIndex].play('loseFirstHalf');
      }
    } else {
      console.warn(`Índice inválido para coração: ${heartIndex}`);
    }

    console.log(`Vida Atualizada: ${newHealth}/${this.#health.maxHealth}`);
  }

  #createHearts(): Phaser.GameObjects.Sprite[] {
    const numberOfHearts = Math.floor(this.#health.maxHealth / 2);
    const hearts: Phaser.GameObjects.Sprite[] = [];

    for (let i = 0; i < numberOfHearts; i++) {
      const heart = this.add
        .sprite(10 + i * 50, 10, 'health-bar', 0)
        .setScale(6)
        .setOrigin(0);
      hearts.push(heart);
    }

    return hearts;
  }
}
