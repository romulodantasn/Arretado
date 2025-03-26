import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptionsConfig';
import { inputManager } from '../components/input/inputManagerComponent';
import { player } from '../objects/player/playerObject';
import { enemyGroup } from '../objects/enemies/enemyObject';
import { collider } from '../components/collider/colliderComponent';
import { bulletComponent } from '../objects/bullet/bulletComponent';

export class gameScene extends Phaser.Scene {
  private keys: any;
  private click: Phaser.Input.Mouse.MouseManager;
  private player: player;
  private enemy: enemyGroup;
  private bullet: bulletComponent;
  private collisionHandler: collider;
  private reticle: Phaser.GameObjects.Sprite;
  private pointer: Phaser.Input.Pointer;

  constructor() {
    super({ key: 'gameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    console.log('gameScene carregado');
    this.scene.launch('gameHud');
    console.log('gameHud carregada');

    this.add
      .image(0, 0, 'gameBackgroundLimbo')
      .setOrigin(0, 0)
      .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);

    inputManager.setupControls(this);
    this.keys = inputManager.getKeys();
    this.player = new player(this, gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2);
    this.enemy = new enemyGroup(this, this.player);

    this.bullet = new bulletComponent(this, this.player, this.enemy, this.reticle, this.input.activePointer);
    this.collisionHandler = new collider(this, this.player, this.enemy);
    this.collisionHandler.create();
    this.bullet = new bulletComponent(this, this.player, this.enemy, this.reticle, this.input.activePointer);
    this.bullet.reticleMovement();
    this.bullet.setupShooting();
    this.events.on('nextPhase', this.triggerNextPhase, this);
  }

  update() {
    this.bullet.containReticle();
    this.handlePause();
    this.player.update();
    this.enemy.updateEnemyMovement(this);
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
