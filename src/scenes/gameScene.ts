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
import { WaveManager } from '../config/waveManager';
import { WaveNumbers, Waves } from '../config/wavesContainer';
import { DashEnemyGroup } from '../objects/enemies/DashEnemyGroup';
import { TankEnemyGroup } from '../objects/enemies/TankEnemyGroup';
import { RangedEnemyGroup } from '../objects/enemies/RangedEnemyGroup';
import { setupTilemap } from '../config/gameOptionsConfig';


export class gameScene extends Phaser.Scene {
  #keys: any;
  #player: Player;
  #basicEnemy: BasicEnemyGroup;
  #rangedEnemy?: RangedEnemyGroup;
  #dashEnemy?: DashEnemyGroup;
  #tankEnemy?: TankEnemyGroup;
  #boss?: BossEnemy;
  #shootingController!: shootingController;
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
    this.#currentWaveKey = `Wave_${this.#waveData.waveNumber}` as WaveNumbers;
  }

  create() {
    console.log('gameScene carregado');

    this.#health = new HealthComponent(playerStats.Health, playerStats.Health, 'player');

    this.scene.launch('gameHud');
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
      setupTilemap(this, currentWaveConfig.tilemapKey, currentWaveConfig.tileset, currentWaveConfig.layers ?? []);
      

      if (!gameOptions.tilemap) {
        return; 
      }
    }

    inputManager.setupControls(this);

    this.#player = new Player(this, gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2);
    
    if(Waves[this.#currentWaveKey].enemies.includes('BasicEnemy')) {
      this.#basicEnemy = new BasicEnemyGroup(this, this.#player);
    }

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

    this.#collider = new collider(this, this.#player, this.#basicEnemy,this.#rangedEnemy, this.#dashEnemy, this.#tankEnemy, this.#boss, this.#health);
    this.#collider.create();
    this.#keys = inputManager.getKeys();

    this.time.delayedCall(100, () => {
      if (!this.scene.isActive('PlayerHealthBar')) {
        this.scene.launch('PlayerHealthBar', { emitter: globalEventEmitter, health: this.#health });
        this.scene.bringToTop('PlayerHealthBar');
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
}
