import Phaser from 'phaser';
import { gameHud } from '../objects/ui/gameHudObject';

export class colliderScene extends Phaser.Scene {
  private colliderSceneText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'colliderScene',
    });
  }

  create() {
    this.colliderScene();
    console.log('colliderScene Carregada');
  }

  public colliderScene() {
    this.colliderSceneText = this.add
      .text(560, 410, `Eita macho tu perdesse. Reiniciando...`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
    this.time.delayedCall(2500, () => {
      this.scene.start('gameScene');
    });
  }
}
