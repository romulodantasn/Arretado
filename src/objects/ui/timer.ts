import Phaser from 'phaser';
import { nextPhase } from '../../components/events/nextPhase';
export class timer extends Phaser.Scene {
  timeLeft: number;
  timerText: Phaser.GameObjects.Text;

  create() {
    this.timer();
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
      callback: nextPhase.prototype.updateTimer,
      //Referenciando o metodo updateTimer que está dentro de nextPhase.Ts diretamente
      callbackScope: this,
      loop: true,
    });
  }
}
