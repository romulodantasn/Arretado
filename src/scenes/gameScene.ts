import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptionsConfig';
import { inputManager } from '../components/input/inputManagerComponent';
import { player } from '../objects/player/playerObject';
import { enemyGroup } from '../objects/enemies/enemyObject';
import { collider } from '../components/collider/colliderComponent';
import { bulletComponent } from '../objects/bullet/bulletComponent';
import { healthComponent } from '../components/health/healthComponent';

export class gameScene extends Phaser.Scene {
  #keys: any;
  #player: player;
  #enemy: enemyGroup;
  #bullet: bulletComponent;
  #collisionHandler: collider;
  #health: healthComponent;
  #reticle: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: 'gameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    console.log('gameScene carregado');
    this.scene.launch('gameHud');
    this.time.delayedCall(100, () => {
      this.scene.launch('healthUi', { emitter: this.events, health: this.#health });
    });

    console.log('healthUi carregada');

    this.add
      .image(0, 0, 'gameBackgroundLimbo')
      .setOrigin(0, 0)
      .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);

    inputManager.setupControls(this);
    this.#keys = inputManager.getKeys();

    this.#player = new player(this, gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2);

    this.#enemy = new enemyGroup(this, this.#player);

    this.#bullet = new bulletComponent(this, this.#player, this.#enemy, this.#reticle, this.input.activePointer);
    this.#bullet.reticleMovement();
    this.#bullet.setupShooting();

    const customEventEmitter = new Phaser.Events.EventEmitter();
    this.#health = new healthComponent(customEventEmitter);

    this.#collisionHandler = new collider(this, this.#player, this.#enemy, this.#health);
    this.#collisionHandler.create();

    this.events.on('nextPhase', this.triggerNextPhase, this);
  }

  update() {
    this.#bullet.containReticle();
    this.handlePause();
    this.#player.update();
    this.#enemy.updateEnemyMovement(this);
  }

  private handlePause() {
    if (!Phaser.Input.Keyboard.JustDown(this.#keys.pause)) return;
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
