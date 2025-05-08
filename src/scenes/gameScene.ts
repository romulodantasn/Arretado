import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptionsConfig';
import { playerStats } from '../config/playerConfig';
import { inputManager } from '../components/input/inputManagerComponent';
import { Player } from '../objects/player/playerObject';
import { BasicEnemyGroup } from '../objects/enemies/BasicEnemyGroup';
import { collider } from '../components/collider/colliderComponent';
import { shootingController } from '../objects/bullet/ShootingController';
import { HealthComponent } from '../components/playerHealth/HealthComponent';
import { globalEventEmitter } from '../components/events/globalEventEmitter';
import { BossEnemy } from '../objects/enemies/BossEnemy';
import { currentEnemyStats } from '../config/enemiesContainer';
import { waveIndicator } from '../config/gameOptionsConfig';
import { WaveManager } from '../config/waveManager';
import { WaveNumbers, Waves } from '../config/wavesContainer';
export class gameScene extends Phaser.Scene {
  #keys: any;
  #player: Player;
  #basicEnemy: BasicEnemyGroup;
  #boss: BossEnemy
  #shootingController: shootingController;
  #reticle: Phaser.GameObjects.Sprite;
  #collider: collider;
  #health: HealthComponent;
  #currentWaveKey: WaveNumbers;
  #waveData: any;

  constructor() {
    super({ key: 'gameScene' });
  }
  
  init(data: { waveKey?: WaveNumbers }) {
    this.#waveData = WaveManager.getWaveData(data.waveKey);
  }

  create() {
    console.log('gameScene carregado');

    this.#health = new HealthComponent(playerStats.Health, playerStats.Health, 'player');

    this.scene.launch('gameHud');
    const waveKey = `Wave_${this.#waveData.waveNumber}` as WaveNumbers;
    const backgroundKey = Waves[waveKey].background;
    this.add
      .image(0, 0, backgroundKey)
      .setOrigin(0, 0)
      .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);
      console.log(`Background atual: ${backgroundKey}`)

    inputManager.setupControls(this);

    this.#player = new Player(this, gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2);

    this.#basicEnemy = new BasicEnemyGroup(this, this.#player);
    console.log(`[Wave ${waveIndicator.currentWave}] BasicEnemy Stats:`, currentEnemyStats.BasicEnemy);

    this.#boss = new BossEnemy(this,300, 300, this.#player)

    this.#shootingController = new shootingController(this, this.#player, this.#basicEnemy, this.#boss, this.#reticle);
    this.#shootingController.create();

    this.#collider = new collider(this, this.#player, this.#basicEnemy, this.#boss, this.#health);
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
      this.#basicEnemy.updateEnemyMovement(this);
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
