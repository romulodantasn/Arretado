import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptionsConfig';
import { timer } from '../../components/timer/timerComponent';
import { healthComponent } from '../../components/health/healthComponent';

export class gameHud extends Phaser.Scene {
  #customEventEmitter: Phaser.Events.EventEmitter;
  #health: healthComponent;
  #timerInstance: timer;
  waveNumber: number = 1;
  #waveText: Phaser.GameObjects.Text;
  actNumber: number = 1;
  #actText: Phaser.GameObjects.Text;
  #coinGame: number;
  #coinText: Phaser.GameObjects.Text;
  shouldIncrementWave: boolean = true;

  constructor() {
    super({
      key: 'gameHud',
    });

    this.#customEventEmitter = new Phaser.Events.EventEmitter();
    this.#health = new healthComponent(this.#customEventEmitter);
  }

  create() {
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 6 };

    this.events.off('timeUp');
    this.events.on('timeUp', () => {
      console.log('timeUp disparado');
      this.phaseCount();
    });

    console.log('actNumber: ', this.actNumber, 'waveNumber: ', this.waveNumber);
    this.add.image(60, 130, 'gun').setDisplaySize(90, 90);
    this.add.image(1770, 130, 'coin').setDisplaySize(60, 60);

    this.#waveText = this.add.text(1785, 80, `Onda: ${this.waveNumber}`, textStyle).setFontSize(36).setOrigin(0.5);

    this.#actText = this.add.text(1780, 40, `Ato: ${this.actNumber}`, textStyle).setFontSize(36).setOrigin(0.5);

    this.#coinText = this.add.text(1820, 130, ' 10', textStyle).setFontSize(36).setOrigin(0.5);

    this.updateHud();

    this.#timerInstance = new timer(this);
    this.#timerInstance.create();

    this.scene.launch('healthUi', {
      emitter: this.#customEventEmitter,
      health: this.#health,
    });
  }

  public phaseCount() {
    if (!this.shouldIncrementWave) return;

    console.log(`Chamando phaseCount(). waveNumber: ${this.waveNumber}, actNumber: ${this.actNumber}`);

    this.waveNumber++;

    if (this.waveNumber > 9) {
      this.waveNumber = 1;
      this.actNumber++;
    }

    console.log(`Depois do incremento. waveNumber: ${this.waveNumber}, actNumber: ${this.actNumber}`);

    this.updateHud();
  }

  public updateHud() {
    if (this.#waveText && this.#actText) {
      this.#waveText.setText(`Onda: ${this.waveNumber}`);
      this.#actText.setText(`Ato: ${this.actNumber}`);
    }
  }

  public advanceWaveCount() {
    console.log(this.waveNumber, 'waveCount');
  }

  public enableWaveIncrement() {
    this.shouldIncrementWave = true;
  }

  public disableWaveIncrement() {
    this.shouldIncrementWave = false;
  }

  public coinCount() {
    this.#coinGame = 10;
    if (this.#coinText) {
      this.#coinText.setText(`${this.#coinGame}`);
    }
  }
}
