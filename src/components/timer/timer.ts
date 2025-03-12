import Phaser from 'phaser';
import { nextPhase } from '../events/nextPhase';

export class timer {
  private scene: Phaser.Scene;
  private timerEvent: Phaser.Time.TimerEvent;
  private timeLeft: number;
  private timerText: Phaser.GameObjects.Text;
  private nextPhaseInstance: nextPhase;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.nextPhaseInstance = new nextPhase(this.scene);
  }

  public create() {
    this.initializeTimer();
  }

  public initializeTimer() {
    this.timeLeft = 45;
    this.timerText = this.scene.add
      .text(920, 16, `00:${this.timeLeft}`, {
        fontSize: '24px',
        color: '#fff',
      })
      .setDepth(10);

    this.timerEvent = this.scene.time.addEvent({
      delay: 1000, // milliseconds
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  public updateTimer() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.timerText.setText(`00:${this.timeLeft}`);
    }
    if (this.timeLeft <= 0) {
      this.nextPhaseInstance.nextPhase();
    }
  }

  public pauseTimer() {
    if (this.timerEvent) {
      this.timerEvent.paused = true;
    }
  }

  public resumeTimer() {
    if (this.timerEvent) {
      this.timerEvent.paused = false;
    }
  }
}
