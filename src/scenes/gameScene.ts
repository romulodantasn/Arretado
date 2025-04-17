import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptionsConfig';
import { inputManager } from '../components/input/inputManagerComponent';
import { player } from '../objects/player/playerObject';
import { enemyGroup } from '../objects/enemies/enemyObject';
import { collider } from '../components/collider/colliderComponent';
import { shootingController } from '../objects/bullet/bulletComponent';
import { HealthComponent } from '../components/playerHealth/HealthComponent';
import { globalEventEmitter } from '../components/events/globalEventEmitter';

export class gameScene extends Phaser.Scene {
  #keys: any;
  #player: player;
  #enemy: enemyGroup;
  #bullet: shootingController;
  #reticle: Phaser.GameObjects.Sprite;
  #collisionHandler: collider;
  #health: HealthComponent;

  constructor() {
    super({ key: 'gameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    console.log('gameScene carregado');

    this.#health = new HealthComponent();

    this.scene.launch('gameHud');

    this.add
      .image(0, 0, 'gameBackgroundLimbo')
      .setOrigin(0, 0)
      .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);

    inputManager.setupControls(this);
    this.#keys = inputManager.getKeys();

    this.#player = new player(this, gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2);

    this.#enemy = new enemyGroup(this, this.#player);

    this.#bullet = new shootingController(this, this.#player, this.#enemy, this.#reticle);
    this.#bullet.create();

    this.#collisionHandler = new collider(this, this.#player, this.#enemy, this.#health);
    this.#collisionHandler.create();

    this.time.delayedCall(100, () => {
      if (!this.scene.isActive('healthUi')) {
        this.scene.launch('healthUi', { emitter: globalEventEmitter, health: this.#health });
      }
    });
    console.log('healthUi carregada');
  }

  update() {
    this.#bullet.containReticle();
    this.handlePause();
    this.#player.update();
    this.#enemy.updateEnemyMovement(this);
  }

  public handlePause() {
    if (!Phaser.Input.Keyboard.JustDown(this.#keys.pause)) return;
    const gameScene = 'gameScene';
    const gameHud = 'gameHud';
    const PauseScene = 'PauseScene';

    const isGamePaused = this.scene.isPaused(gameScene);
    const isHudPaused = this.scene.isPaused(gameHud);
    const isHudActive = this.scene.isActive(gameHud);

    if (isGamePaused) {
      console.log('Jogo retomado');
      this.scene.resume(gameScene);

      if (isHudPaused) this.scene.resume(gameHud);
      this.scene.stop(PauseScene);
    } else {
      console.log('Jogo Pausado');
      this.scene.pause(gameScene);
      this.scene.scene.input.setDefaultCursor('default');
      if (isHudActive) this.scene.pause(gameHud);
      this.scene.launch(PauseScene);
    }
  }
}
