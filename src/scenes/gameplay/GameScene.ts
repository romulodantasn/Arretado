import Phaser from 'phaser';
import { gameOptions } from '../../config/GameOptionsConfig';
import { playerStats } from '../../config/player/PlayerConfig';
import { inputManager } from '../../components/input/InputManager';
import { Player } from '../../objects/player/Player';
import { BasicEnemyGroup } from '../../objects/enemies/BasicEnemyGroup';
import { Collider } from '../../components/collider/colliderComponent';
import { shootingController } from '../../objects/bullet/ShootingController';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';
import { globalEventEmitter } from '../../components/events/globalEventEmitter';
import { BossEnemy } from '../../objects/enemies/BossEnemy';
import { WaveManager } from '../../config/waves/waveManager';
import { WaveNumbers, Waves } from '../../config/waves/wavesContainer';
import { DashEnemyGroup } from '../../objects/enemies/DashEnemyGroup';
import { TankEnemyGroup } from '../../objects/enemies/TankEnemyGroup';
import { RangedEnemyGroup } from '../../objects/enemies/RangedEnemyGroup';
import { setupTilemap } from '../../config/GameOptionsConfig';


export class GameScene extends Phaser.Scene {
  #keys: any;
  #player: Player;
  #basicEnemy: BasicEnemyGroup;
  #rangedEnemy?: RangedEnemyGroup;
  #dashEnemy?: DashEnemyGroup;
  #tankEnemy?: TankEnemyGroup;
  #boss?: BossEnemy;
  #shootingController!: shootingController;
  #reticle: Phaser.GameObjects.Sprite;
  #collider: Collider;
  #health: HealthComponent;
  #currentWaveKey: WaveNumbers;
  #waveData: any;

  constructor() {
    super({ key: 'gameScene' });
  }
  
  init(data: { waveKey?: WaveNumbers }) {
    this.#waveData = WaveManager.getWaveData(data.waveKey);
    this.#currentWaveKey = `Wave_${this.#waveData.waveNumber}` as WaveNumbers;
  }

  create() {
    console.log('gameScene carregado');

    this.#health = new HealthComponent(playerStats.Health, playerStats.Health, 'player');

    this.scene.launch('gameHud');
    this.scene.launch('PlayerBoostCooldownUI');
    const currentWaveConfig = Waves[this.#currentWaveKey];
    gameOptions.waveDuration = currentWaveConfig.duration;
    if (currentWaveConfig.background) {
      const backgroundImg = this.add
        .image(0, 0, currentWaveConfig.background)
        .setOrigin(0, 0)
        .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);
      backgroundImg.setDepth(-10); 
      console.log(`Background atual: ${currentWaveConfig.background}`);
    }

    if (currentWaveConfig.tilemapKey && currentWaveConfig.tileset) {
      setupTilemap(this, currentWaveConfig.tilemapKey, currentWaveConfig.tileset, currentWaveConfig.layers ?? [], currentWaveConfig.collisionLayers ?? []);
      

      if (!gameOptions.tilemap) {
        return; 
      }
    }

    inputManager.setupControls(this);

    this.#player = new Player(this, gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2);    
    this.#basicEnemy = new BasicEnemyGroup(this, this.#player);

    if(Waves[this.#currentWaveKey].enemies.includes('RangedEnemy')) {
      this.#rangedEnemy = new RangedEnemyGroup(this, this.#player);
    }
 
    if(Waves[this.#currentWaveKey].enemies.includes('DashEnemy')) {
      this.#dashEnemy = new DashEnemyGroup(this, this.#player);
    }
   

    if(Waves[this.#currentWaveKey].enemies.includes('TankEnemy')) {
      this.#tankEnemy = new TankEnemyGroup(this, this.#player);
    }
    
    if(Waves[this.#currentWaveKey].enemies.includes('BossEnemy')) {
      this.#boss = new BossEnemy(this,300, 300, this.#player) 
    }
    

    this.#shootingController = new shootingController(this, this.#player, this.#basicEnemy,this.#rangedEnemy, this.#dashEnemy, this.#tankEnemy, this.#boss, this.#reticle);
    this.#shootingController.create();

    this.#collider = new Collider(this, this.#player, this.#basicEnemy,this.#rangedEnemy, this.#dashEnemy, this.#tankEnemy, this.#boss, this.#health);
    this.#collider.create();
    this.#keys = inputManager.getKeys();

    this.time.delayedCall(100, () => {
      if (!this.scene.isActive('PlayerHealthBar')) {
        this.scene.launch('PlayerHealthBar', { emitter: globalEventEmitter, health: this.#health });
        this.scene.bringToTop('PlayerHealthBar');
        this.scene.bringToTop('PlayerBoostCooldownUI'); 
      }
    });

    this.physics.world.setBounds(0,0, gameOptions.gameSize.width, gameOptions.gameSize.height)
    this.cameras.main.setBounds(0, 0, gameOptions.gameSize.width, gameOptions.gameSize.height);
    this.cameras.main.startFollow(this.#player)
  }

  update() {
      this.#shootingController.containReticle();
      this.handlePause();
      this.#player.update();
      this.#basicEnemy.updateEnemyMovement(this);
      this.#rangedEnemy?.updateEnemyMovement(this);
      this.#dashEnemy?.updateEnemyMovement(this);
      this.#tankEnemy?.updateEnemyMovement(this);
      this.#boss?.updateEnemyBossMovement(this);
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

  shutdown() {
    console.log('GameScene shutdown');

    this.time.removeAllEvents();
    
    ['gameHud', 'PlayerHealthBar', 'PlayerBoostCooldownUI'].forEach(sceneName => {
      if (this.scene.isActive(sceneName)) {
        this.scene.stop(sceneName);
      }
    });

    if (this.#shootingController) {
      this.#shootingController.destroy();
    }

    if (this.#basicEnemy) {
      this.#basicEnemy.clear(true, true);
      this.#basicEnemy.destroy(true);
    }
    if (this.#rangedEnemy) {
      this.#rangedEnemy.clear(true, true);
      this.#rangedEnemy.destroy(true);
    }
    if (this.#dashEnemy) {
      this.#dashEnemy.clear(true, true);
      this.#dashEnemy.destroy(true);
    }
    if (this.#tankEnemy) {
      this.#tankEnemy.clear(true, true);
      this.#tankEnemy.destroy(true);
    }
    if (this.#boss) {
      this.#boss.destroy();
    }

    if (this.#player) {
      this.#player.destroy();
    }

    if (this.#collider) {
      this.#collider.destroy();
    }

    if (this.physics && this.physics.world) {
      this.physics.world.colliders.destroy();
      this.physics.world.bodies.clear();
      this.physics.world.staticBodies.clear();
    }

    this.#player = undefined!;
    this.#basicEnemy = undefined!;
    this.#rangedEnemy = undefined;
    this.#dashEnemy = undefined;
    this.#tankEnemy = undefined;
    this.#boss = undefined;
    this.#shootingController = undefined!;
    this.#collider = undefined!;
    this.#health = undefined!;
    this.#keys = undefined;
    this.#waveData = undefined;

    this.scene.stop();
    this.scene.remove();
  }
}
