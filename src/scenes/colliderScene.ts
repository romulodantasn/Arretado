import Phaser from 'phaser';
import { gameHud } from '../objects/ui/gameHudObject';

export class colliderScene extends Phaser.Scene {
  private colliderSceneText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'colliderScene',
    });
  }

  preload() {
    this.load.font('Cordelina', 'assets/font/cordelina.otf');
  }
  create() {
    this.colliderScene();
    console.log('colliderScene Carregada');
  }

  public colliderScene() {
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 5 };
    const colliderSceneText = ['Eita macho tu perdesse. Reiniciando...'];
    this.add.text(960, 510, colliderSceneText, textStyle).setFontSize(36).setAlign('center').setOrigin(0.5);
    console.log('Eita macho tu perdesse. Reiniciando...');

    this.time.delayedCall(2500, () => {
      this.scene.start('gameScene');
    });
  }
}
