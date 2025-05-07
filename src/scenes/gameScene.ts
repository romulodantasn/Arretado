import Phaser from 'phaser';
import { gameOptions, playerStats } from '../config/gameOptionsConfig';
import { inputManager } from '../components/input/inputManagerComponent';
import { Player } from '../objects/player/playerObject';
import { BasicEnemyGroup } from '../objects/enemies/BasicEnemyGroup';
import { collider } from '../components/collider/colliderComponent';
import { shootingController } from '../objects/bullet/ShootingController';
import { HealthComponent } from '../components/playerHealth/HealthComponent';
import { globalEventEmitter } from '../components/events/globalEventEmitter';
import { BossEnemy } from '../objects/enemies/BossEnemy';

export class gameScene extends Phaser.Scene {
  #keys: any;
  #player: Player;
  #enemy: BasicEnemyGroup;
  #boss: BossEnemy
  #shootingController: shootingController;
  #reticle: Phaser.GameObjects.Sprite;
  #collider: collider;
  #health: HealthComponent;

  constructor() {
    super({ key: 'gameScene' });
  }

  create() {
    console.log('gameScene carregado');

    this.#health = new HealthComponent(playerStats.playerHealth, playerStats.playerHealth, 'player');

    this.scene.launch('gameHud');

    this.add
      .image(0, 0, 'gameBackgroundLimbo')
      .setOrigin(0, 0)
      .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);

    inputManager.setupControls(this);

    this.#player = new Player(this, gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2);

    this.#enemy = new BasicEnemyGroup(this, this.#player);

    this.#boss = new BossEnemy(this,300, 300, this.#player)

    this.#shootingController = new shootingController(this, this.#player, this.#enemy, this.#boss, this.#reticle);
    this.#shootingController.create();

    this.#collider = new collider(this, this.#player, this.#enemy, this.#boss, this.#health);
    this.#collider.create();
    this.#keys = inputManager.getKeys();

    this.time.delayedCall(100, () => {
      if (!this.scene.isActive('PlayerHealthBar')) {
        this.scene.launch('PlayerHealthBar', { emitter: globalEventEmitter, health: this.#health });
        this.scene.bringToTop('PlayerHealthBar');
      }
    });
    console.log('PlayerHealthBar carregada');
  }

  update() {
      this.#shootingController.containReticle();
      this.handlePause();
      this.#player.update();
      this.#enemy.updateEnemyMovement(this);
      this.#boss.update(this.time.now, this.game.loop.delta);
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
