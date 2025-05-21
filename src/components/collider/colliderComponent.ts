import { gameScene } from '../../scenes/gameScene';
import { Player } from '../../objects/player/playerObject';
import { BasicEnemyGroup } from '../../objects/enemies/BasicEnemyGroup';
import { DashEnemyGroup } from '../../objects/enemies/DashEnemyGroup'; 
import {  gameOptions, waveIndicator } from '../../config/gameOptionsConfig';
import { gameHud } from '../../objects/ui/gameHudUi';
import { HealthComponent } from '../playerHealth/HealthComponent';
import { healthEvents } from '../events/healthEvent';
import { BossEnemy } from '../../objects/enemies/BossEnemy';
import { currentEnemyStats } from '../../config/enemiesContainer';
import { TankEnemyGroup } from '../../objects/enemies/TankEnemyGroup';
import { RangedEnemyGroup } from '../../objects/enemies/RangedEnemyGroup';

export class collider {
  #scene: gameScene;
  #player: Player;
  #BasicEnemyGroup: BasicEnemyGroup;
  #RangedEnemyGroup?: RangedEnemyGroup
  #DashEnemyGroup?: DashEnemyGroup;
  #TankEnemyGroup?: TankEnemyGroup
  #boss?: BossEnemy;
  #playerHealth: HealthComponent; 
  #isInvulnerable: boolean = false;

  #playerBasicEnemyCollider: Phaser.Physics.Arcade.Collider;
  #playerRangedBulletCollider?: Phaser.Physics.Arcade.Collider;
  #playerDashEnemyCollider?: Phaser.Physics.Arcade.Collider; 
  #playerTankEnemyCollider?: Phaser.Physics.Arcade.Collider; 
  #playerBossCollider?: Phaser.Physics.Arcade.Collider;
  #playerBossBulletCollider?: Phaser.Physics.Arcade.Collider;
  #playerTilemapColliders: Phaser.Physics.Arcade.Collider[] = [];


  constructor(scene: gameScene, player: Player, BasicEnemyGroup: BasicEnemyGroup, RangedEnemyGroup?: RangedEnemyGroup, DashEnemyGroup?: DashEnemyGroup, TankEnemyGroup?: TankEnemyGroup, boss?: BossEnemy, playerHealth?: HealthComponent) {
    this.#scene = scene;
    this.#player = player;
    this.#BasicEnemyGroup = BasicEnemyGroup;
    this.#RangedEnemyGroup = RangedEnemyGroup;
    this.#DashEnemyGroup = DashEnemyGroup;
    this.#TankEnemyGroup = TankEnemyGroup;
    this.#boss = boss;
    this.#playerHealth = playerHealth!;
  }
  create() {
    this.createColliders();
    this.#createTilemapColliders();
        console.log('[ColliderComponent] Colliders criados.');

  }

  public createColliders() {
    this.#playerBasicEnemyCollider = this.#scene.physics.add.collider(this.#player, this.#BasicEnemyGroup, () => {
      if (!this.#isInvulnerable) {
        this.#handlePlayerHit(currentEnemyStats.BasicEnemy.Damage, this.#playerBasicEnemyCollider); 
      }
    });

    if (this.#RangedEnemyGroup && this.#RangedEnemyGroup?.bulletGroup) {
      this.#playerRangedBulletCollider = this.#scene.physics.add.collider(this.#player, this.#RangedEnemyGroup!['bulletGroup'],
        (player, bullet) => {          
          if (bullet instanceof Phaser.Physics.Arcade.Sprite && bullet.active) {
            if (!this.#isInvulnerable) {
              bullet.destroy(); 
              this.#handlePlayerHit(currentEnemyStats.RangedEnemy.Damage, this.#playerRangedBulletCollider!);
            }
          }
        }
      );
    }

    if (this.#DashEnemyGroup) {
      this.#playerDashEnemyCollider = this.#scene.physics.add.collider(this.#player, this.#DashEnemyGroup, () => {
        if (!this.#isInvulnerable) {
          this.#handlePlayerHit(currentEnemyStats.DashEnemy.Damage, this.#playerDashEnemyCollider!); 
        }
      });
    }
   
    if (this.#TankEnemyGroup) {
      this.#playerTankEnemyCollider = this.#scene.physics.add.collider(this.#player, this.#TankEnemyGroup, () => {
        if (!this.#isInvulnerable) {
          this.#handlePlayerHit(currentEnemyStats.TankEnemy.Damage, this.#playerTankEnemyCollider!); 
        }
      });
    }

    if (this.#boss && this.#boss.active) {
        this.#playerBossCollider = this.#scene.physics.add.collider(this.#player, this.#boss, () => {
            if (!this.#isInvulnerable) {
                this.#handlePlayerHit(currentEnemyStats.BossEnemy.Damage, this.#playerBossCollider!);
            }
        });
    }

    if (this.#boss && this.#boss.bulletGroup) {
      this.#playerBossBulletCollider = this.#scene.physics.add.collider(this.#player, this.#boss.bulletGroup, (player, bullet) => {
        if (bullet instanceof Phaser.Physics.Arcade.Sprite && bullet.active && !this.#isInvulnerable) {
          bullet.destroy(); 
          const damage = currentEnemyStats.BossEnemy.BulletDamage!;
          this.#handlePlayerHit(damage, this.#playerBossBulletCollider!);
        }
      });
    }
}


  #handlePlayerHit(damage: number, colliderToDeactivate: Phaser.Physics.Arcade.Collider) {
    this.#scene.cameras.main.shake(200, 0.0025);
    this.#player.setTint(0xff0000);
    this.#scene.time.delayedCall(200, () => {
      this.#player.clearTint();
    });
    console.log(`Colisão detectada! Jogador perde ${damage} de vida.`);

    this.#playerHealth.loseHealth(damage);
    this.#scene.events.emit(
      healthEvents.loseHealth,
      this.#playerHealth.currentHealth,
      this.#playerHealth.currentHealth + damage 
    );

    if (this.#playerHealth.currentHealth <= 0) {
      this.#handlePlayerDeath();
      return;
    }

    this.#isInvulnerable = true;
    colliderToDeactivate.active = false;

    this.#scene.time.delayedCall(gameOptions.invulnerabilityDuration, () => {
      this.#isInvulnerable = false;
      if (this.#playerBasicEnemyCollider) this.#playerBasicEnemyCollider.active = true;
      if (this.#playerRangedBulletCollider) this.#playerRangedBulletCollider.active = true;
      if (this.#playerDashEnemyCollider) this.#playerDashEnemyCollider.active = true;
      if (this.#playerTankEnemyCollider) this.#playerTankEnemyCollider.active = true;
      if (this.#playerBossCollider) this.#playerBossCollider.active = true;
      if (this.#playerBossBulletCollider) this.#playerBossBulletCollider.active = true;
    });
  }

  #createTilemapColliders() {
    const tilemap = gameOptions.tilemap;
    if (!tilemap){
      console.warn('[ColliderComponent] Tilemap não está definido em gameOptions. Nenhum colisor de tilemap será criado.');
      return;
    }
      
    console.log('[ColliderComponent] Iniciando criação de colisores com tilemap...');
    tilemap.layers.forEach((layerData: Phaser.Tilemaps.LayerData) => {
      const actualTilemapLayer = layerData.tilemapLayer;
      console.log(`[ColliderComponent] Processando camada do tilemap: ${layerData.name}`);

      if (actualTilemapLayer) {
        const colliderInstance = this.#scene.physics.add.collider(this.#player, actualTilemapLayer);
        this.#playerTilemapColliders.push(colliderInstance);
        console.log(`[ColliderComponent] Collider adicionado entre jogador e camada do tilemap: ${actualTilemapLayer.layer.name}`);
      }
    });
  }

  // Método auxiliar para lidar com a morte do jogador
  #handlePlayerDeath() {
    this.#scene.scene.stop('healthUi');
    this.#scene.scene.stop('PlayerHealthBar'); 
    this.#scene.scene.stop('gameHud');
    this.#scene.scene.stop('gameScene');
    this.#scene.scene.stop('PauseScene')
    this.#scene.scene.start('GameOverScene')
  }
}
