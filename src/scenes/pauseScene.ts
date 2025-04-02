import Phaser from 'phaser';

export class pauseScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'pauseScene',
    });
  }

  create(): void {
    const textStyle = {
      fontFamily: 'Cordelina',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    };
    const pauseText = ['Pausado'];
    const returnText = ['Pressione Esc para voltar ao jogo'];
    this.add.text(960, 510, pauseText, textStyle).setFontSize(36).setAlign('center').setOrigin(0.5);

    this.add.text(960, 550, returnText, textStyle).setFontSize(24).setAlign('center').setOrigin(0.5);

    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    const escKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    escKey.on('down', () => {
      console.log('Jogo Retomado');
      this.scene.stop('pauseScene');
      this.scene.resume('gameScene');
      this.scene.resume('gameHud');
    });
  }
}
