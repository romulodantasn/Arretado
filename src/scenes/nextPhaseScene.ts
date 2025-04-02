import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptionsConfig';
import { gameHud } from '../objects/ui/gameHudUi';

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
    const hudScene = this.scene.get('gameHud') as gameHud;
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
    const nextPhaseText = ['Eita caba danado! Sobreviveu! Avançando para a próxima fase...'];

    if (hudScene) {
      hudScene.advanceWaveCount();
    }
    this.time.delayedCall(2000, () => {
      this.scene.start('gameScene');
    });

    this.add.text(980, 510, nextPhaseText, textStyle).setFontSize(36).setAlign('center').setOrigin(0.5);
    gameOptions.enemyRate -= 100;
    gameOptions.enemySpeed += 10;
    console.log('Eita caba danado! Sobreviveu! Avançando para a próxima fase..');
    console.log('enemySpeedUpdated: ' + gameOptions.enemySpeed);
    console.log('enemyRateUpdated: ' + gameOptions.enemyRate);
  }
}
