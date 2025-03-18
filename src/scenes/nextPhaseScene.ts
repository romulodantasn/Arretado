import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptions';
import { gameHud } from '../objects/ui/gameHud';

export class nextPhaseScene extends Phaser.Scene {
  private waveCount: number = 0;
  private waveText: Phaser.GameObjects.Text;
  private actCount: number = 0;
  private timerLeft: number;
  private actText: Phaser.GameObjects.Text;
  private nextPhaseText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'nextPhaseScene',
    });
  }

  create() {
    this.nextPhase();
    console.log('nexPhaseScene Carregada');
  }

  public nextPhase() {
    this.nextPhaseText = this.add
      .text(380, 410, `Eita caba danado! Sobreviveu! Avançando para a próxima fase...`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
    console.log('Eita caba danado! Sobreviveu! Avançando para a próxima fase..');
    const hudScene = this.scene.get('gameHud') as gameHud;
    if (hudScene) {
      hudScene.advanceWaveCount();
    }
    this.time.delayedCall(2000, () => {
      this.scene.start('gameScene');
    });
    gameOptions.enemyRate -= 100;
    console.log('enemyRateUpdated: ' + gameOptions.enemyRate);
  }
}
