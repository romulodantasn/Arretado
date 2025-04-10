import Phaser from 'phaser';
import { gameHud } from '../objects/ui/gameHudUi';

export class nextPhaseScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'nextPhaseScene',
    });
  }

  create() {
    this.nextPhase();
    console.log('nextPhaseScene Carregada');
  }

  public nextPhase() {
    const hudScene = this.scene.get('gameHud') as gameHud;
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
    const nextPhaseText = ['Eita caba danado! Sobreviveu! Avançando para a próxima fase...'];
    this.add.text(980, 510, nextPhaseText, textStyle).setFontSize(36).setAlign('center').setOrigin(0.5);

    if (hudScene) {
      hudScene.advanceWaveCount();
    }
    this.time.delayedCall(2000, () => {
      this.scene.stop('healthUi');
      this.scene.stop('gameHud');
      // this.scene.stop('nextPhaseScene');
      this.scene.stop('gameScene');
      this.scene.start('itemScene');
    });

    console.log('Avançando para a próxima fase..');
  }
}
