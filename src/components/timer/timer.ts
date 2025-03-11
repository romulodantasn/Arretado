import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';

export class timer extends Phaser.Scene {
  timeLeft: number;
  timerText: Phaser.GameObjects.Text;
  nextPhaseText: Phaser.GameObjects.Text;

  create() {
    this.timer();
    this.updateTimer();
    this.nextPhase();
  }
  public nextPhase() {
    console.log('Eita caba danado! Sobreviveu! Avançando para a próxima fase');
    this.nextPhaseText = this.add
      .text(1744, 8, `Eita caba danado! Sobreviveu! Avançando para a próxima fase:${this.nextPhaseText}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
    this.timeLeft = 45;
    gameOptions.enemyRate -= 500;
    this.scene.restart();
  }

  public timer() {
    this.timeLeft = 45;
    this.timerText = this.add
      .text(920, 16, `00:${this.timeLeft}`, {
        fontSize: '24px',
        color: '#fff',
      })
      .setDepth(10);

    this.time.addEvent({
      delay: 1000, // milissegundos
      callback: this.nextPhase,
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
      this.nextPhase();
    }
  }
}
