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

export class Collider { // Class names are typically PascalCase
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
    console.log("basicEnemy", this.#basicEnemyGroup);
    console.log("group children:", this.#basicEnemyGroup.getChildren());
  }

 public createColliders() {
  // BasicEnemy
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

  // RangedEnemy - Bullets
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

  // DashEnemy
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

  // TankEnemy
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

  // BossEnemy
  if (this.#boss?.active) {
    // Boss collision with player
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

    // Boss collision with player bullets
    const playerBullets = this.#scene.physics.add.group();
    this.#scene.physics.add.overlap(
      this.#boss,
      playerBullets,
      (boss, bullet) => {
        if (bullet instanceof Phaser.Physics.Arcade.Sprite) {
          bullet.destroy(); // Destroy the bullet on impact
        }
      },
      undefined,
      this
    );
  }

  // Boss Bullets
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
    console.log(
      `[ColliderComponent] Colisão com ${sourceType} detectada! Jogador perde ${damage} de vida. Dano: ${damage}`
    );

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
      console.warn(
        "[ColliderComponent] Tilemap não está definido em gameOptions. Nenhum colisor de tilemap será criado."
      );
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
        console.log(
          `[ColliderComponent] Colisao com tile danoso( ID: ${tile.index}, Dano: ${damage})`
        );
        this.#handlePlayerHit(
          damage,
          `Tilemap (${tile.layer.name})`,
          colliderInstance
        );
      } else if (tile.properties.collides === true) {
        console.log(
          `[ColliderComponent] colisao com tile colidivel (ID: ${tile.index}) na camada ${tile.layer.name}.`
        );
      }
    }
  }

  // Método auxiliar para lidar com a morte do jogador
  #handlePlayerDeath() {
    this.#scene.scene.stop("healthUi");
    this.#scene.scene.stop("PlayerHealthBar");
    this.#scene.scene.stop("gameHud");
    this.#scene.scene.stop("gameScene");
    this.#scene.scene.stop("PauseScene");
    this.#scene.scene.start("GameOverScene");
  }

  public destroy(): void {
    console.log('[ColliderComponent] Destroying colliders...');

    // Destruir e limpar referências dos colliders individuais
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
