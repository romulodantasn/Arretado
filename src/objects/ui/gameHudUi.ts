import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptionsConfig';
import { timer } from '../../components/timer/timerComponent';

type hudElement = 'coins' | 'wave' | 'act' | 'timer' | 'gun';
export class gameHud extends Phaser.Scene {
  #timerInstance: timer | null = null;
  #waveText: Phaser.GameObjects.Text | null = null;
  #actText: Phaser.GameObjects.Text | null = null;
  #coinGame: number;
  #coinText: Phaser.GameObjects.Text | null = null;
  #coinImage: Phaser.GameObjects.Image | null = null;
  #gunImage: Phaser.GameObjects.Image | null = null;
  shouldIncrementWave: boolean = true;
  #elementsToShow: hudElement[] = ['coins', 'wave', 'act', 'timer', 'gun'];

  constructor() {
    super({
      key: 'gameHud',
    });
  }

  init(data?: { elementsToShow?: hudElement[] }) {
    if (data?.elementsToShow) {
      this.#elementsToShow = data.elementsToShow;
    } else {
      this.#elementsToShow = ['coins', 'wave', 'act', 'timer', 'gun'];
    }
  }

  create() {
    this.#coinGame = gameOptions.playerCoinGame;
    this.coinCount();
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 6 };

    if (this.#elementsToShow.includes('coins')) {
      this.#coinImage = this.add.image(1770, 130, 'coin').setDisplaySize(60, 60);
      this.#coinText = this.add.text(1840, 130, `${this.#coinGame}`, textStyle).setFontSize(36).setOrigin(0.5);
      this.events.off('updateCoins');
      this.events.on('updateCoins', this.coinCount, this);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.events.off('updateCoins', this.coinCount, this);
      });
    }

    if (this.#elementsToShow.includes('wave')) {
      this.#waveText = this.add
        .text(1785, 80, `Onda: ${gameOptions.currentWave}`, textStyle)
        .setFontSize(36)
        .setOrigin(0.5);
    }

    if (this.#elementsToShow.includes('act')) {
      this.#actText = this.add
        .text(1780, 40, `Ato: ${gameOptions.currentAct}`, textStyle)
        .setFontSize(36)
        .setOrigin(0.5);
    }

    if (this.#elementsToShow.includes('gun')) {
      this.#gunImage = this.add.image(60, 130, 'gun').setDisplaySize(90, 90);
    }

    if (this.#elementsToShow.includes('timer')) {
      this.events.off('timeUp');
      this.events.on('timeUp', () => {
        console.log('timeUp disparado');
        this.phaseCount();
      });
      this.#timerInstance = new timer(this);
      this.#timerInstance.create();
    }

    this.updateHud();
  }

  public phaseCount() {
    if (!this.shouldIncrementWave || !this.#elementsToShow.includes('wave')) return;
    console.log(`Chamando phaseCount(). waveNumber: ${gameOptions.currentWave}, actNumber: ${gameOptions.currentAct}`);
    if (gameOptions.currentWave > 9) {
      gameOptions.currentWave = 1;
      gameOptions.currentAct++;
    }
    console.log(`Depois do incremento. waveNumber: ${gameOptions.currentWave}, actNumber: ${gameOptions.currentAct}`);
    this.updateHud();
  }

  public updateHud() {
    if (this.#waveText && this.#actText) {
      this.#waveText.setText(`Onda: ${gameOptions.currentWave}`);
    }
    if (this.#actText) {
      this.#actText.setText(`Ato: ${gameOptions.currentAct}`);
    }
  }

  public coinCount() {
    this.#coinGame = gameOptions.playerCoinGame;
    if (this.#coinText) {
      this.#coinText.setText(`${this.#coinGame}`);
    }
  }

  public advanceWaveCount() {
    console.log(gameOptions.currentWave, 'waveCount');
  }

  public enableWaveIncrement() {
    this.shouldIncrementWave = true;
  }

  public disableWaveIncrement() {
    this.shouldIncrementWave = false;
  }
}
