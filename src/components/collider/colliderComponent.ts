import { GameScene } from "../../scenes/gameplay/GameScene";
import { Player } from "../../objects/player/Player";
import { BasicEnemyGroup } from "../../objects/enemies/BasicEnemyGroup";
import { DashEnemyGroup } from "../../objects/enemies/DashEnemyGroup";
import { gameOptions, waveIndicator } from "../../config/GameOptionsConfig";
import { gameHud } from "../../scenes/ui/gameHudUi";
import { HealthComponent } from "../playerHealth/HealthComponent";
import { healthEvents } from "../events/healthEvent";
import { BossEnemy } from "../../objects/enemies/BossEnemy";
import { currentEnemyStats } from "../../config/enemies/EnemiesContainer";
import { TankEnemyGroup } from "../../objects/enemies/TankEnemyGroup";
import { RangedEnemyGroup } from "../../objects/enemies/RangedEnemyGroup";
import { completeGameReset } from "../events/gameResetEvent";

export class Collider { 
  #scene: GameScene;
  #player: Player;
  #basicEnemyGroup: BasicEnemyGroup; 
  #rangedEnemyGroup?: RangedEnemyGroup;
  #dashEnemyGroup?: DashEnemyGroup;
  #tankEnemyGroup?: TankEnemyGroup;
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

  constructor(
    scene: GameScene,
    player: Player,
    basicEnemyGroup: BasicEnemyGroup, 
    rangedEnemyGroup?: RangedEnemyGroup,
    dashEnemyGroup?: DashEnemyGroup,
    tankEnemyGroup?: TankEnemyGroup,
    boss?: BossEnemy,
    playerHealth?: HealthComponent
  ) {
    this.#scene = scene;
    this.#player = player;
    this.#basicEnemyGroup = basicEnemyGroup;
    this.#rangedEnemyGroup = rangedEnemyGroup;
    this.#dashEnemyGroup = dashEnemyGroup;
    this.#tankEnemyGroup = tankEnemyGroup;
    this.#boss = boss;
    this.#playerHealth = playerHealth!;
  }
  create() {
    this.createColliders();
    this.#createTilemapColliders();
  }

 public createColliders() {
  this.#playerBasicEnemyCollider = this.#scene.physics.add.collider(
    this.#player,
    this.#basicEnemyGroup,
    (player, enemy) => {
      if (!this.#isInvulnerable) {
        this.#handlePlayerHit(
          currentEnemyStats.BasicEnemy.Damage,
          "BasicEnemy",
          this.#playerBasicEnemyCollider
        );
      }
    }
  );

  const rangedBullets = this.#rangedEnemyGroup?.bulletGroup;
  if (rangedBullets) {
    this.#playerRangedBulletCollider = this.#scene.physics.add.collider(
      this.#player,
      rangedBullets,
      (player, bullet) => {
        if (bullet instanceof Phaser.Physics.Arcade.Sprite && bullet.active) {
          if (!this.#isInvulnerable) {
            bullet.destroy();
            this.#handlePlayerHit(
              currentEnemyStats.RangedEnemy.Damage,
              "RangedEnemyBullet",
              this.#playerRangedBulletCollider!
            );
          }
        }
      }
    );
  }

  if (this.#dashEnemyGroup) {
    this.#playerDashEnemyCollider = this.#scene.physics.add.collider(
      this.#player,
      this.#dashEnemyGroup,
      () => {
        if (!this.#isInvulnerable) {
          this.#handlePlayerHit(
            currentEnemyStats.DashEnemy.Damage,
            "DashEnemy",
            this.#playerDashEnemyCollider!
          );
        }
      }
    );
  }

  if (this.#tankEnemyGroup) {
    this.#playerTankEnemyCollider = this.#scene.physics.add.collider(
      this.#player,
      this.#tankEnemyGroup,
      () => {
        if (!this.#isInvulnerable) {
          this.#handlePlayerHit(
            currentEnemyStats.TankEnemy.Damage,
            "TankEnemy",
            this.#playerTankEnemyCollider!
          )
        }
      }
    );
  }

  if (this.#boss?.active) {
    this.#playerBossCollider = this.#scene.physics.add.collider(
      this.#player,
      this.#boss,
      () => {
        if (!this.#isInvulnerable) {
          this.#handlePlayerHit(
            currentEnemyStats.BossEnemy.Damage,
            "BossEnemy",
            this.#playerBossCollider!
          );
        }
      }
    );

    const playerBullets = this.#scene.physics.add.group();
    this.#scene.physics.add.overlap(
      this.#boss,
      playerBullets,
      (boss, bullet) => {
        if (bullet instanceof Phaser.Physics.Arcade.Sprite) {
          bullet.destroy(); 
        }
      },
      undefined,
      this
    );
  }

  const bossBullets = this.#boss?.bulletGroup;
  if (bossBullets) {
    this.#playerBossBulletCollider = this.#scene.physics.add.collider(
      this.#player,
      bossBullets,
      (player, bullet) => {
        if (
          bullet instanceof Phaser.Physics.Arcade.Sprite &&
          bullet.active &&
          !this.#isInvulnerable
        ) {
          bullet.destroy();
          this.#handlePlayerHit(
            currentEnemyStats.BossEnemy.BulletDamage!,
            "BossBullet",
            this.#playerBossBulletCollider!
          );
        }
      }
    );
  }
 }

  #handlePlayerHit(
    damage: number,
    sourceType: string,
    colliderToDeactivate?: Phaser.Physics.Arcade.Collider 
  ) {
    this.#scene.cameras.main.shake(200, 0.003);
    this.#player.setTint(0xff0000);
    this.#scene.time.delayedCall(200, () => {
      this.#player.clearTint();
    });
   

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
    if (colliderToDeactivate) { 
      colliderToDeactivate.active = false;
    }

    this.#scene.time.delayedCall(gameOptions.invulnerabilityDuration, () => {
      this.#isInvulnerable = false;
      if (this.#playerBasicEnemyCollider)
        this.#playerBasicEnemyCollider.active = true;
      if (this.#playerRangedBulletCollider)
        this.#playerRangedBulletCollider.active = true;
      if (this.#playerDashEnemyCollider)
        this.#playerDashEnemyCollider.active = true;
      if (this.#playerTankEnemyCollider)
        this.#playerTankEnemyCollider.active = true;
      if (this.#playerBossCollider) this.#playerBossCollider.active = true;
      if (this.#playerBossBulletCollider)
        this.#playerBossBulletCollider.active = true; 
      this.#playerTilemapColliders.forEach((collider) => { 
        if (collider) collider.active = true;
      });
    });
  }

  #createTilemapColliders() {
    const tilemap = gameOptions.tilemap;
    if (!tilemap) {
      return;
    }

    tilemap.layers.forEach((layerData: Phaser.Tilemaps.LayerData) => {
      const actualTilemapLayer = layerData.tilemapLayer;
      if (actualTilemapLayer) {
        const colliderInstance = this.#scene.physics.add.collider(
          this.#player,
          actualTilemapLayer,
          (player, tile) => {
            this.#handleTileCollision(
              tile as Phaser.Tilemaps.Tile,
              colliderInstance
            );
          }
        );
        this.#playerTilemapColliders.push(colliderInstance);
      }
    });
  }

  #handleTileCollision(
    tile: Phaser.Tilemaps.Tile,
    colliderInstance: Phaser.Physics.Arcade.Collider
  ) {
    if (tile && tile.properties) {
      const damage = tile.properties.damage;
      if (damage !== undefined && damage > 0 && !this.#isInvulnerable) {
        
        this.#handlePlayerHit(
          damage,
          `Tilemap (${tile.layer.name})`,
          colliderInstance
        );
      } else if (tile.properties.collides === true) {
      }
    }
  }

  #handlePlayerDeath() {
    // Ensure proper cleanup of physics groups
    if (this.#scene.physics && this.#scene.physics.world) {
      this.#scene.physics.world.colliders.destroy();
      this.#scene.physics.world.bodies.clear();
      this.#scene.physics.world.staticBodies.clear();
    }

    // Destroy all active colliders
    if (this.#playerBasicEnemyCollider) {
      this.#playerBasicEnemyCollider.destroy();
      this.#playerBasicEnemyCollider = undefined!;
    }
    if (this.#playerRangedBulletCollider) {
      this.#playerRangedBulletCollider.destroy();
      this.#playerRangedBulletCollider = undefined;
    }
    if (this.#playerDashEnemyCollider) {
      this.#playerDashEnemyCollider.destroy();
      this.#playerDashEnemyCollider = undefined;
    }
    if (this.#playerTankEnemyCollider) {
      this.#playerTankEnemyCollider.destroy();
      this.#playerTankEnemyCollider = undefined;
    }
    if (this.#playerBossCollider) {
      this.#playerBossCollider.destroy();
      this.#playerBossCollider = undefined;
    }
    if (this.#playerBossBulletCollider) {
      this.#playerBossBulletCollider.destroy();
      this.#playerBossBulletCollider = undefined;
    }

    // Stop all active scenes in the correct order
    ['gameHud', 'PlayerHealthBar', 'PlayerBoostCooldownUI'].forEach(sceneName => {
      if (this.#scene.scene.isActive(sceneName)) {
        this.#scene.scene.stop(sceneName);
      }
    });

    // Start GameOverScene
    this.#scene.scene.start('GameOverScene');
  }

  public destroy(): void {

    if (this.#playerBasicEnemyCollider) {
      this.#playerBasicEnemyCollider.destroy();
      this.#playerBasicEnemyCollider = undefined!;
    }
    if (this.#playerRangedBulletCollider) {
      this.#playerRangedBulletCollider.destroy();
      this.#playerRangedBulletCollider = undefined;
    }
    if (this.#playerDashEnemyCollider) {
      this.#playerDashEnemyCollider.destroy();
      this.#playerDashEnemyCollider = undefined;
    }
    if (this.#playerTankEnemyCollider) {
      this.#playerTankEnemyCollider.destroy();
      this.#playerTankEnemyCollider = undefined;
    }
    if (this.#playerBossCollider) {
      this.#playerBossCollider.destroy();
      this.#playerBossCollider = undefined;
    }
    if (this.#playerBossBulletCollider) {
      this.#playerBossBulletCollider.destroy();
      this.#playerBossBulletCollider = undefined;
    }

    this.#playerTilemapColliders.forEach(collider => {
      if (collider) {
        collider.destroy();
      }
    });
    this.#playerTilemapColliders = [];

    this.#scene = undefined!;
    this.#player = undefined!;
    this.#basicEnemyGroup = undefined!;
    this.#rangedEnemyGroup = undefined;
    this.#dashEnemyGroup = undefined;
    this.#tankEnemyGroup = undefined;
    this.#boss = undefined;
    this.#playerHealth = undefined!;
  }
}
