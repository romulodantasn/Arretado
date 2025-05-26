import Phaser from 'phaser';
import { gameOptions, waveIndicator } from '../../config/GameOptionsConfig';
import { playerStats } from '../../config/player/PlayerConfig';
import { timer } from '../../components/timer/Timer';

type hudElement = 'coins' | 'wave' | 'act' | 'timer' | 'gun';
export class gameHud extends Phaser.Scene {
  #timerInstance: timer | null = null;
  #waveText: Phaser.GameObjects.Text | null = null;
  #actText: Phaser.GameObjects.Text | null = null;
  #coinGame: number;
  #coinText: Phaser.GameObjects.Text;
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
    this.game.events.on('buyUpdatedCoin', this.coinCount, this);
    this.game.events.on('enemyKilled', this.coinCount, this)
    this.#coinGame = playerStats.CoinGame;

    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 6 };

    if (this.#elementsToShow.includes('coins')) {
      this.#coinImage = this.add.image(1770, 130, 'coin').setDisplaySize(60, 60);
      this.#coinText = this.add.text(1840, 130, `${this.#coinGame}`, textStyle).setFontSize(36).setOrigin(0.5);
      this.events.on('buyUpdatedCoin', this.coinCount, this);
      this.game.events.on('enemyKilled', this.coinCount, this)
    
    }

    if (this.#elementsToShow.includes('wave')) {
      this.#waveText = this.add
        .text(1785, 80, `Onda: ${waveIndicator.currentWave}`, textStyle)
        .setFontSize(36)
        .setOrigin(0.5);
    }

    if (this.#elementsToShow.includes('act')) {
      this.#actText = this.add
        .text(1780, 40, `Ato: ${waveIndicator.currentAct}`, textStyle)
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

    this.coinCount();
    this.updateHud();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('buyUpdatedCoin', this.coinCount, this);
    });
  }

  public phaseCount() {
    if (!this.shouldIncrementWave || !this.#elementsToShow.includes('wave')) return;
   
    if (waveIndicator.currentWave >= 9) {
      waveIndicator.currentWave = 1;
      waveIndicator.currentAct++;
    }

    if (waveIndicator.currentAct == 2 && waveIndicator.currentWave == 3) {
      waveIndicator.currentAct = 3;
      waveIndicator.currentWave = 1;
    };
    this.updateHud();
  }

  public updateHud() {
    if (this.#waveText && this.#actText) {
      this.#waveText.setText(`Onda: ${waveIndicator.currentWave}`);
    }
    if (this.#actText) {
      this.#actText.setText(`Ato: ${waveIndicator.currentAct}`);
    }
  }

  public coinCount() {
    this.#coinGame = playerStats.CoinGame;
    if (this.#coinText) {
      this.#coinText.setText(`${this.#coinGame}`);
    }
  }

  public advanceWaveCount() {
    console.log(waveIndicator.currentWave, 'waveCount');
  }

  public enableWaveIncrement() {
    this.shouldIncrementWave = true;
  }

  public disableWaveIncrement() {
    this.shouldIncrementWave = false;
  }
}
