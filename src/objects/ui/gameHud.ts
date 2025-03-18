import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';
import { timer } from '../../components/timer/timer';

export class gameHud extends Phaser.Scene {
  private timerInstance: timer;
  public waveNumber: number = 1;
  private waveText: Phaser.GameObjects.Text;
  public actNumber: number = 1;
  private actText: Phaser.GameObjects.Text;
  private coinGame: number;
  private coinText: Phaser.GameObjects.Text;
  private timeLeft: number;
  private timerText: Phaser.GameObjects.Text;
  private nextPhaseText: Phaser.GameObjects.Text;
  public shouldIncrementWave: boolean = true;

  constructor() {
    super({
      key: 'gameHud',
    });
  }

  create() {
    const gameScene = this.scene.get('gameScene') as Phaser.Scene;

    this.events.off('timeUp');
    this.events.on('timeUp', () => {
      console.log('timeUp disparado');
      this.phaseCount();
    });
    
    console.log('actNumber: ', this.actNumber, 'waveNumber: ', this.waveNumber);
    this.add.image(80, 40, 'health-bar').setDisplaySize(120, 120);
    this.add.image(60, 130, 'gun').setDisplaySize(90, 90);
    this.add.image(1770, 130, 'coin').setDisplaySize(60, 60);
    this.waveText = this.add
      .text(1740, 48, `Onda:${this.waveNumber}`, {
        fontSize: '36px',
        fontFamily: 'Cordelina',
        color: '#fff',
      })
      .setDepth(10);
    this.actText = this.add
      .text(1744, 8, `Ato:${this.actNumber}`, {
        fontSize: '36px',
        fontFamily: 'Cordelina',
        color: '#fff',
      })
      .setDepth(10);
    this.coinText = this.add
      .text(1820, 110, `10`, {
        fontSize: '36px',
        fontFamily: 'Cordelina',
        color: '#fff',
      })
      .setDepth(10);

    this.updateHud();

    this.coinCount();

    this.timerInstance = new timer(this);
    this.timerInstance.create();
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
    if (this.waveText && this.actText) {
      this.waveText.setText(`Onda: ${this.waveNumber}`);
      this.actText.setText(`Ato: ${this.actNumber}`);
    } else {
      console.warn('HUD ainda não foi criado.');
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
    this.coinGame = 10;
  }
}
