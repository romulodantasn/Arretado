import { gameOptions } from '../../config/gameOptions';
import { gameHud } from '../../objects/ui/gameHud';
import { timer } from '../timer/timer';

export class nextPhase {
  private scene: Phaser.Scene;
  private timeLeft: number;
  private timerText: Phaser.GameObjects.Text;
  private nextPhaseText: Phaser.GameObjects.Text;
  private advanceWaveCount: gameHud['advanceWaveCount'];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create() {
    this.nextPhase();
  }

  public nextPhase() {
    console.log('Eita caba danado! Sobreviveu! Avançando para a próxima fase');
    this.nextPhaseText = this.scene.add
      .text(1744, 8, `Eita caba danado! Sobreviveu! Avançando para a próxima fase`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
    this.timeLeft = 45;
    gameOptions.enemyRate -= 500;
    this.advanceWaveCount();
    this.scene.scene.restart();
  }
}
