export class pauseScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'pauseScene',
    });
  }

  create(): void {
    this.add
      .text(960, 510, 'Pausado', {
        fontSize: '32px',
        color: '#fff',
      })
      .setOrigin(0.5);

    this.add
      .text(960, 550, 'Pressione Esc para voltar ao jogo', {
        fontSize: '16px',
        color: '#fff',
      })
      .setOrigin(0.5);

    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    const escKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    escKey.on('down', () => {
      console.log('Jogo Reiniciado');
      this.scene.stop('pauseScene');
      this.scene.resume('PlayGame');
    });
  }
  private handlePause() {
    if (Phaser.Input.Keyboard.JustDown(this.controlKeys.pause as Phaser.Input.Keyboard.Key)) {
      if (this.scene.isPaused('PlayGame')) {
        console.log('Jogo retomado');
        this.scene.resume('PlayGame');
        this.scene.stop('pauseScene');
      } else {
        console.log('Jogo Pausado');
        this.scene.pause('PlayGame');
        this.scene.launch('pauseScene');
      }
    }
  }
}
