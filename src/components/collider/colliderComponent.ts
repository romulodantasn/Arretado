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

  }

  public createColliders() {
    this.#playerBasicEnemyCollider = this.#scene.physics.add.collider(this.#player, this.#BasicEnemyGroup, () => {
      if (!this.#isInvulnerable) {
        this.#handlePlayerHit(currentEnemyStats.BasicEnemy.Damage, 'BasicEnemy', this.#playerBasicEnemyCollider); 
      }
    });

    if (this.#RangedEnemyGroup && this.#RangedEnemyGroup?.bulletGroup) {
      this.#playerRangedBulletCollider = this.#scene.physics.add.collider(this.#player, this.#RangedEnemyGroup!['bulletGroup'],
        (player, bullet) => {          
          if (bullet instanceof Phaser.Physics.Arcade.Sprite && bullet.active) {
            if (!this.#isInvulnerable) {
              bullet.destroy(); 
              this.#handlePlayerHit(currentEnemyStats.RangedEnemy.Damage, 'RangedEnemyBullet', this.#playerRangedBulletCollider!);
            }
          }
        }
      );
    }

    if (this.#DashEnemyGroup) {
      this.#playerDashEnemyCollider = this.#scene.physics.add.collider(this.#player, this.#DashEnemyGroup, () => {
        if (!this.#isInvulnerable) {
          this.#handlePlayerHit(currentEnemyStats.DashEnemy.Damage, 'DashEnemy', this.#playerDashEnemyCollider!); 
        }
      });
    }
   
    if (this.#TankEnemyGroup) {
      this.#playerTankEnemyCollider = this.#scene.physics.add.collider(this.#player, this.#TankEnemyGroup, () => {
        if (!this.#isInvulnerable) {
          this.#handlePlayerHit(currentEnemyStats.TankEnemy.Damage, 'TankEnemy', this.#playerTankEnemyCollider!); 
        }
      });
    }

    if (this.#boss && this.#boss.active) {
        this.#playerBossCollider = this.#scene.physics.add.collider(this.#player, this.#boss, () => {
            if (!this.#isInvulnerable) {
                this.#handlePlayerHit(currentEnemyStats.BossEnemy.Damage, 'BossEnemy', this.#playerBossCollider!);
            }
        });
    }

    if (this.#boss && this.#boss.bulletGroup) {
      this.#playerBossBulletCollider = this.#scene.physics.add.collider(this.#player, this.#boss.bulletGroup, (player, bullet) => {
        if (bullet instanceof Phaser.Physics.Arcade.Sprite && bullet.active && !this.#isInvulnerable) {
          bullet.destroy(); 
          const bossBulletDamage = currentEnemyStats.BossEnemy.BulletDamage!;
          this.#handlePlayerHit(bossBulletDamage, 'BossBullet', this.#playerBossBulletCollider!);
        }
      });
    }
}


  #handlePlayerHit(damage: number, sourceType: string, colliderToDeactivate: Phaser.Physics.Arcade.Collider) {
    this.#scene.cameras.main.shake(200, 0.0030);
    this.#player.setTint(0xff0000);
    this.#scene.time.delayedCall(200, () => {
      this.#player.clearTint();
    });
    console.log(`[ColliderComponent] Colisão com ${sourceType} detectada! Jogador perde ${damage} de vida. Dano: ${damage}`);

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
      this.#playerTilemapColliders.forEach(collider => {
        collider.active = true;
      });
    });
  }

  #createTilemapColliders() {
    const tilemap = gameOptions.tilemap;
    if (!tilemap){
      console.warn('[ColliderComponent] Tilemap não está definido em gameOptions. Nenhum colisor de tilemap será criado.');
      return;
    }
      
    tilemap.layers.forEach((layerData: Phaser.Tilemaps.LayerData) => {
      const actualTilemapLayer = layerData.tilemapLayer;
      if (actualTilemapLayer) {
        const colliderInstance = this.#scene.physics.add.collider(this.#player, actualTilemapLayer,(player, tile) => {
          this.#handleTileCollision(tile as Phaser.Tilemaps.Tile, colliderInstance);
      });
        this.#playerTilemapColliders.push(colliderInstance);
      }
    });
  }

  #handleTileCollision(tile: Phaser.Tilemaps.Tile, colliderInstance: Phaser.Physics.Arcade.Collider) {
    if (tile && tile.properties) {
      const damage = tile.properties.damage;
      if(damage !== undefined && damage > 0 && !this.#isInvulnerable){
        console.log(`[ColliderComponent] Colisao com tile danoso( ID: ${tile.index}, Dano: ${damage})`);
        this.#handlePlayerHit(damage, `Tilemap (${tile.layer.name})`, colliderInstance);
      } else if (tile.properties.collides === true) {
        console.log(`[ColliderComponent] colisao com tile colidivel (ID: ${tile.index}) na camada ${tile.layer.name}.`);
      }
  }
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
