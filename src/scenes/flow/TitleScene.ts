import { gameOptions } from '../../config/GameOptionsConfig';

export class titleScene extends Phaser.Scene {
  private titleMusic!: Phaser.Sound.BaseSound; 
  private titleFont = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 6 };

  constructor() {
    super('titleScene');
  }

  private transitionToScene(targetScene: string) {
    // Para todas as cenas ativas exceto a atual
    this.scene.manager.scenes.forEach(scene => {
      if (scene.scene.key !== this.scene.key && scene.scene.isActive()) {
        this.scene.stop(scene.scene.key);
      }
    });

    // Para a música
    if (this.titleMusic) {
      this.titleMusic.stop();
    }

    // Limpa eventos
    this.events.removeAllListeners();
    this.input.keyboard?.removeAllListeners();

    // Para a cena atual e inicia a nova
    this.scene.stop();
    this.scene.start(targetScene);
  }

  create() {
    this.add.nineslice(gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2, "molduraMenu",0, gameOptions.gameSize.width - 10, gameOptions.gameSize.height -10 , 16, 16, 16, 16)
    console.log('titleScene carregada');

    this.add
      .image(0, 0, 'titleSceneBackground')
      .setOrigin(0, 0)
      .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);

    this.titleMusic = this.sound.add('titleSceneAudio', { loop: true, volume: 0.15 });

    if (this.sound.locked) {
      this.sound.once('unlocked', () => {
        this.titleMusic.play();
      });
    } else {
      this.titleMusic.play();
    }

    const gameName = ['ARRETADO'];
    const instructions = ['Pressione ENTER para começar'];

    this.add.text(960, 550, gameName, this.titleFont).setFontSize(64).setAlign('center').setOrigin(0.5);
    this.add.text(980, 850, instructions, this.titleFont).setFontSize(48).setAlign('center').setOrigin(0.5);

    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    const enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    enterKey.on('down', () => {
      this.transitionToScene('menuScene');
    });
  }

  shutdown() {
    if (this.titleMusic) {
      this.titleMusic.stop();
    }
    this.events.removeAllListeners();
    this.input.keyboard?.removeAllListeners();
  }
}
