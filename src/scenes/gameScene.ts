import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptions';
import { inputManager } from '../components/input/inputManager';

export class gameScene extends Phaser.Scene {
  private keys: any;

  constructor() {
    super({ key: 'gameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    console.log('gameScene carregado');
    this.add
      .image(0, 0, 'gameBackgroundLimbo')
      .setOrigin(0, 0)
      .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);
    this.scene.launch('gameHud');
    inputManager.setupControls(this);
    this.keys = inputManager.getKeys();

    this.events.on('nextPhase', this.triggerNextPhase, this);
  }

  update() {
    this.handlePause();
  }

  private handlePause() {
    if (!Phaser.Input.Keyboard.JustDown(this.keys.pause)) return;
    const gameScene = 'gameScene';
    const gameHud = 'gameHud';
    const pauseScene = 'pauseScene';

    const isGamePaused = this.scene.isPaused(gameScene);
    const isHudPaused = this.scene.isPaused(gameHud);
    const isHudActive = this.scene.isActive(gameHud);

    if (isGamePaused) {
      console.log('Jogo retomado');
      this.scene.resume(gameScene);
      if (isHudPaused) this.scene.resume(gameHud);
      this.scene.stop(pauseScene);
    } else {
      console.log('Jogo Pausado');
      this.scene.pause(gameScene);
      if (isHudActive) this.scene.pause(gameHud);
      this.scene.launch(pauseScene);
    }
  }

  private triggerNextPhase() {
    console.log('Avançando para a próxima fase');
    this.scene.start('nextPhaseScene');
  }
}
