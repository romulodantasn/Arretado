import { gameOptions } from '../config/gameOptionsConfig';
import { gameScene } from './gameScene';

export class titleScene extends Phaser.Scene {
  static controlKeys: any;
  static titleSceneAudio: Phaser.Sound.BaseSound;
  titleFont = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 6 };

  constructor() {
    super('titleScene');
  }

  preload() {
    this.load.audio('titleSceneAudio', [
      'assets/audio/titleSceneAudio.ogg',
      'assets/audio/titleSceneAudio.mp3'
    ]);
  }

  create() {
    this.add.nineslice(gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2, "molduraMenu",0, gameOptions.gameSize.width - 10, gameOptions.gameSize.height -10 , 16, 16, 16, 16)
    console.log('titleScene carregada');

    this.add
      .image(0, 0, 'titleSceneBackground')
      .setOrigin(0, 0)
      .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);

    titleScene.titleSceneAudio = this.sound.add('titleSceneAudio', { loop: true, volume: 0.15 });

    if (this.sound.locked) {
      this.sound.once('unlocked', () => {
        titleScene.titleSceneAudio.play();
      });
    } else {
      titleScene.titleSceneAudio.play();
    }

    this.events.once('shutdown', () => {
      titleScene.titleSceneAudio.stop();
    });

    const gameName = ['ARRETADO'];
    const instructions = ['Pressione ENTER para começar'];

    this.add.text(960, 550, gameName, this.titleFont).setFontSize(64).setAlign('center').setOrigin(0.5);
    this.add.text(980, 850, instructions, this.titleFont).setFontSize(48).setAlign('center').setOrigin(0.5);

    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    const enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    enterKey.on('down', () => {
      this.scene.start('menuScene');
    });
  }

  shutdown() {
    if (titleScene.titleSceneAudio) {
      titleScene.titleSceneAudio.stop();
    }
  }
}
