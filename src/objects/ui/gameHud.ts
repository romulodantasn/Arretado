import Phaser from 'phaser';
import { timer } from '../../components/timer/timer';
import { gameOptions } from '../../config/gameOptions';

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
    this.advanceWaveCount();
    const gameScene = this.scene.get('gameScene');
    gameScene.events.on('nextPhase', this.advanceWaveCount, this);
    this.add.image(60, 130, 'gun').setDisplaySize(90, 90);
    this.add.image(1770, 130, 'coin').setDisplaySize(60, 60);

    // Create an instance of the Timer class and call its methods
    this.timerInstance = new timer(this);
    this.timerInstance.create();

    // Listen for pause and resume events
    this.events.on('pause', this.timerInstance.pauseTimer, this.timerInstance);
    this.events.on('resume', this.timerInstance.resumeTimer, this.timerInstance);
  }

  public phaseCount() {
    this.actCount = 1;
    this.actText = this.add
      .text(1744, 8, `Ato:${this.actCount}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
  }

  public advanceWaveCount() {
    this.waveCount = 1;
    this.waveText = this.add
      .text(1740, 48, `Onda:${this.waveCount}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);

    if (this.waveCount > 9) {
      this.waveCount = 1;
      this.actCount += 1;
      this.actText.setText(`Ato:${this.actCount}`);
    }
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
