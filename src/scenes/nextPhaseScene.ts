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
 
    // if (this.scene.isActive('gameScene')) {
      this.scene.stop('gameScene');
    // }
    if (this.scene.isActive('gameHud')) {
      this.scene.stop('gameHud');
    }
    if (this.scene.isActive('PlayerHealthBar')) {
       this.scene.stop('PlayerHealthBar');
    }
    if (this.scene.isActive('PauseScene')) {
      this.scene.stop('PauseScene');
    }
    this.input.enabled = false;
    this.input.setDefaultCursor('none');
  }

  public nextPhase() {
    const hudScene = this.scene.get('gameHud') as gameHud;
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
    const nextPhaseText = ['Eita caba danado! Sobreviveu! Avançando para a próxima fase...'];
    this.add.text( this.scale.width / 2, this.scale.height / 2 + 3, nextPhaseText, textStyle).setFontSize(36).setAlign('center').setOrigin(0.5);

    if (hudScene) {
      hudScene.advanceWaveCount();
    }
    this.time.delayedCall(2000, () => {
      this.scene.stop('nextPhaseScene');
      this.scene.start('itemScene');
    });

    console.log('Avançando para a próxima fase..');
  }
}
