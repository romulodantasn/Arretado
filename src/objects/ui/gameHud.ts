import Phaser from 'phaser';
import { timer } from '../../components/timer/timer';
export class gameHud extends Phaser.Scene {
  private timerInstance: timer;
  private waveCount: number;
  private waveText: Phaser.GameObjects.Text;
  private actCount: number;
  private actText: Phaser.GameObjects.Text;
  private coinGame: number;
  private coinText: Phaser.GameObjects.Text;
  private timeLeft: number;
  private timerText: Phaser.GameObjects.Text;
  private nextPhaseText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'gameHud',
    });
  }

  create() {
    this.phaseCount();
    this.coinCount();
    this.add.image(80, 40, 'health-bar').setDisplaySize(120, 120);
    this.add.image(60, 130, 'gun').setDisplaySize(90, 90);
    this.add.image(1770, 130, 'coin').setDisplaySize(60, 60);

    this.timerInstance = new timer(this);
    this.timerInstance.create();
  }

  public phaseCount() {
    this.waveCount ? this.waveCount++ : (this.waveCount = 1);
    this.actCount && this.waveCount > 9 ? this.actCount++ : (this.actCount = 1);
    this.waveText = this.add
      .text(1740, 48, `Onda:${this.waveCount}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
    this.actText = this.add
      .text(1744, 8, `Ato:${this.actCount}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
  }

  public advanceWaveCount() {
    console.log(this.waveCount, 'waveCount');
  }

  public coinCount() {
    this.coinGame = 10;
    this.coinText = this.add
      .text(1820, 110, `${this.coinGame}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
  }
}
