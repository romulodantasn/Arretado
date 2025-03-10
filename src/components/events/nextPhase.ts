import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';
export class nextPhase extends Phaser.Scene {
  timeLeft: number;
  timerText: Phaser.GameObjects.Text;
  constructor() {
    super({
      key: 'nextPhase',
    });
  }
  create() {
    this.updateTimer();
    this.nextPhase();
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

  public nextPhase() {
    console.log('Eita caba danado! Sobreviveu! Avançando para a próxima fase');
    this.timeLeft = 45;
    gameOptions.enemyRate -= 500;
    this.scene.restart();
  }
}
