import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptions';
import { gameHud } from '../objects/ui/gameHud';

export class nextPhaseScene extends Phaser.Scene {
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
    gameOptions.enemySpeed += 10;
    console.log('enemySpeedUpdated: ' + gameOptions.enemySpeed);
    console.log('enemyRateUpdated: ' + gameOptions.enemyRate);
  }
}
