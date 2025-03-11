import Phaser from 'phaser';
import { Player } from '../objects/player/player';
import { gameOptions } from '../config/gameOptions';
import { inputManager } from '../components/input/inputManager';
import { timer } from '../components/timer/timer';
export class gameScene extends Phaser.Scene {
  private player: Player;
  private gameTimer: timer;

  constructor() {
    super({ key: 'gameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    console.log('gameScene carregado');
    inputManager.setupControls(this);
    this.add
      .image(0, 0, 'gameBackgroundLimbo')
      .setOrigin(0, 0)
      .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);
    this.add.image(80, 40, 'health-bar').setDisplaySize(120, 120);
    this.add.image(60, 130, 'gun').setDisplaySize(90, 90);
    this.add.image(1770, 130, 'coin').setDisplaySize(60, 60);
    this.scene.launch('gameHud');
    this.setupPauseKey();
    this.gameTimer = new timer(this);
    this.gameTimer.create();
  }

  update() {}

  // Gerenciando Botão de Pausa
  private setupPauseKey() {
    const keys = inputManager.getKeys();
    keys.pause.on('down', () => {
      console.log('Jogo Pausado');
      this.scene.pause('gameScene');
      this.scene.launch('pauseScene');
    });
  }
}
