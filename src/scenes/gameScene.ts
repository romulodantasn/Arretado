import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptions';
import { inputManager } from '../components/input/inputManager';
import { gameHud } from '../objects/ui/gameHud';
import { pauseScene } from './pauseScene';

export class gameScene extends Phaser.Scene {
  public keys: any;

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
    this.add.image(80, 40, 'health-bar').setDisplaySize(120, 120);
    this.scene.launch('gameHud');
    inputManager.setupControls(this);
    this.keys = inputManager.getKeys();
  }

  update() {
    this.handlePause();
  }

  private handlePause() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
      if (this.scene.isPaused('gameScene')) {
        console.log('Jogo retomado');
        this.scene.resume('gameScene');
        if (this.scene.isPaused('gameHud')) {
          this.scene.resume('gameHud');
        }
        this.scene.stop('pauseScene');
      } else {
        console.log('Jogo Pausado');
        this.scene.pause('gameScene');
        if (this.scene.isActive('gameHud')) {
          this.scene.pause('gameHud');
        }
        this.scene.launch('pauseScene');
      }
    }
  }
}
