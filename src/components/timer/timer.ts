import Phaser from 'phaser';

export class timer {
  private scene: Phaser.Scene;
  private timerEvent: Phaser.Time.TimerEvent;
  private timeLeft: number;
  private timerText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.initializeTimer();
  }

  public initializeTimer() {
    this.timeLeft = 10;
    this.timerText = this.scene.add
      .text(920, 16, `00:${this.timeLeft}`, {
        fontSize: '24px',
        fontFamily: 'Cordelina',
        color: '#fff',
      })
      .setDepth(10);

    this.timerEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  public updateTimer() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.timerText.setText(`00:${this.timeLeft}`);
    } else {
      this.scene.events.emit('timeUp');
      this.timerEvent.remove(false);
      this.scene.scene.start('nextPhaseScene');
    }
  }
}
