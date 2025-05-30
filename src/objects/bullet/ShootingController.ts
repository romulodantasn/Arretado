import { inputManager } from '../../components/input/InputManager';
import { gameOptions, gun } from '../../config/GameOptionsConfig';
import { Player } from '../player/Player';
import { BasicEnemyGroup } from '../enemies/BasicEnemyGroup';
import { DashEnemyGroup } from '../enemies/DashEnemyGroup'; 
import { coinOnKillEvent } from '../../components/events/coinOnKillEvent';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';
import { BossEnemy } from '../enemies/BossEnemy';
import { TankEnemyGroup } from '../enemies/TankEnemyGroup';
import { RangedEnemyGroup } from '../enemies/RangedEnemyGroup';
import { SoundManager } from '../../config/SoundManager';

export class shootingController {
  #scene: Phaser.Scene;
  #player: Player;
  #BasicEnemyGroup: BasicEnemyGroup;
  #RangedEnemyGroup?: RangedEnemyGroup
  #DashEnemyGroup?: DashEnemyGroup;
  #TankEnemyGroup?: TankEnemyGroup;
  #boss?: BossEnemy;
  #bulletGroup!: Phaser.Physics.Arcade.Group;
  #reticle: Phaser.GameObjects.Sprite;
  #keys: any;
  #canShoot: boolean = true;
  #cooldownTimer?: Phaser.Time.TimerEvent;

  readonly textStyle = {
    fontFamily: "Cordelina",
    fontSize: "28px",
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4,
  };

  constructor(scene: Phaser.Scene, player: Player, BasicEnemyGroup: BasicEnemyGroup, RangedEnemyGroup?: RangedEnemyGroup, dashEnemyGroup?: DashEnemyGroup, tankEnemyGroup?: TankEnemyGroup, boss?: BossEnemy, reticle?: Phaser.GameObjects.Sprite) {
    this.#scene = scene;
    this.#player = player;
    this.#BasicEnemyGroup = BasicEnemyGroup;
    this.#RangedEnemyGroup = RangedEnemyGroup;
    this.#DashEnemyGroup = dashEnemyGroup; 
    this.#TankEnemyGroup = tankEnemyGroup;
    this.#boss = boss;
    this.#reticle = reticle!;

    this.#bulletGroup = this.#scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, runChildUpdate: true });
    this.#keys = inputManager.getKeys();

    this.#setupColliders();
  }

  #setupColliders() {
    this.#scene.physics.add.collider(
      this.#bulletGroup,
      this.#BasicEnemyGroup,
      this.basicEnemyCollision.bind(this)
    );

    if (this.#RangedEnemyGroup) {
      this.#scene.physics.add.collider(
        this.#bulletGroup,
        this.#RangedEnemyGroup,
        this.rangedEnemyCollision.bind(this)
      );
    }

    if (this.#DashEnemyGroup) {
      this.#scene.physics.add.collider(
        this.#bulletGroup,
        this.#DashEnemyGroup,
        this.dashEnemyCollision.bind(this)
      );
    }

    if (this.#TankEnemyGroup) {
      this.#scene.physics.add.collider(
        this.#bulletGroup,
        this.#TankEnemyGroup,
        this.tankEnemyCollision.bind(this)
      );
    }

    if (this.#boss) {
      this.#scene.physics.add.collider(
        this.#bulletGroup,
        this.#boss,
        this.bossCollision.bind(this)
      );
    }
  }

  create() {
    this.setupReticle();
    this.setupShooting();
  }

  setupReticle() {
    this.#reticle = this.#reticle || this.#scene.add.sprite(this.#player.x, this.#player.y - 50, 'reticle');
    this.#reticle.setOrigin(0.5).setDisplaySize(40, 40).setActive(true).setVisible(true).setDepth(35)
    this.#scene.input.setDefaultCursor('none');

    this.#scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.#reticle.setPosition(pointer.worldX, pointer.worldY);
    });

    // Define a cor inicial do reticle
    this.updateReticleColor(true);
  }

  private updateReticleColor(canShoot: boolean) {
    if (this.#reticle) {
      this.#reticle.setTint(canShoot ? 0xffffff : 0xff0000);
    }
  }

  containReticle() {
    if (this.#reticle) {
      this.#reticle.x = Phaser.Math.Clamp(this.#reticle.x, 0, gameOptions.gameSize.width);
      this.#reticle.y = Phaser.Math.Clamp(this.#reticle.y, 0, gameOptions.gameSize.height);
    }
  }

  setupShooting() {
    inputManager.setupClicks(this.#scene, {
      onFire: () => {
        if (this.#canShoot) {
          this.fireBullet(this.#player, this.#reticle);
          this.#scene.cameras.main.shake(200, 0.0005);
          this.startCooldown();
          const fireBulletSFX = this.#scene.sound.add('gun_shoot', {volume: 0.20});
          fireBulletSFX.play();
        }
      },
    });
  }

  fireBullet(shooter: Player, target: Phaser.GameObjects.Sprite) {
    const bullet = this.#bulletGroup.get(shooter.x, shooter.y, 'bullet') as Phaser.Physics.Arcade.Sprite;
    const angle = Phaser.Math.Angle.Between(shooter.x, shooter.y, target.x, target.y);
    const speed = gun.bulletSpeed; 

    this.#bulletGroup.add(bullet);
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    bullet.setActive(true).setVisible(true);
    
  }

  private showDamageText(x: number, y: number, damage: number) {
    const text = this.#scene.add.text(x, y, `${damage}`, this.textStyle);
    this.#scene.tweens.add({
      targets: text,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      ease: 'Power2',
      duration: 150,
      onComplete: () => {
        this.#scene.time.delayedCall(150, () => {
          this.#scene.tweens.add({
            targets: text,
            alpha: 0,
            scale: 0.5,
            ease: 'Power2',
            duration: 1000,
            onComplete: () => text.destroy()
          });
        });
      }
    });
  }

  private basicEnemyCollision(bullet: any, enemy: any) {
    if (!bullet.active || !enemy.active) return;

    const enemyHealth = BasicEnemyGroup.getHealthComponent(enemy);
    if (!enemyHealth) return;

    const damage = gun.gunDamage;
    this.showDamageText(enemy.x, enemy.y - 50, damage);
    enemyHealth.loseHealth(damage);

    if (enemyHealth.isDead()) {
      SoundManager.playBasicEnemyDeathSFX();
      coinOnKillEvent(this.#scene);
      enemy.destroy();
    }

    bullet.destroy();
  }

  private rangedEnemyCollision(bullet: any, enemy: any) {
    if (!bullet.active || !enemy.active) return;

    const enemyHealth = RangedEnemyGroup.getHealthComponent(enemy);
    if (!enemyHealth) return;

    const damage = gun.gunDamage;
    this.showDamageText(enemy.x, enemy.y - 50, damage);
    enemyHealth.loseHealth(damage);

    if (enemyHealth.isDead()) {
      SoundManager.playRangedEnemyDeathSFX();
      coinOnKillEvent(this.#scene);
      enemy.destroy();
    }

    bullet.destroy();
  }

  private dashEnemyCollision(bullet: any, dashEnemy: any) {
    if (!bullet.active || !dashEnemy.active) return;

   const enemyHealth = DashEnemyGroup.getHealthComponent(dashEnemy);

    if (!enemyHealth) return;

    const damage = gun.gunDamage;
    this.showDamageText(dashEnemy.x, dashEnemy.y - 50, damage);
    enemyHealth.loseHealth(damage);

    if (enemyHealth.isDead()) {
      SoundManager.playDashEnemyDeathSFX();
      coinOnKillEvent(this.#scene);
      dashEnemy.destroy();
    }

    bullet.destroy();
  }

  private tankEnemyCollision(bullet: any, tankEnemy: any) {
    if (!bullet.active || !tankEnemy.active) return;

   const enemyHealth = TankEnemyGroup.getHealthComponent(tankEnemy);

    if (!enemyHealth) return;

    const damage = gun.gunDamage;
    this.showDamageText(tankEnemy.x, tankEnemy.y - 50, damage);
    enemyHealth.loseHealth(damage);

    if (enemyHealth.isDead()) {
      SoundManager.playTankEnemyDeathSFX();
      coinOnKillEvent(this.#scene);
      tankEnemy.destroy();
    }

    bullet.destroy();
  }

  private bossCollision(bullet: any, boss: any) {
    if (!bullet.active || !boss.active) return;

    const bossHealth = boss.getData('healthComponent') as HealthComponent;
    if (!bossHealth) return;

    const damage = gun.gunDamage;
    this.showDamageText(boss.x, boss.y - 50, damage);
    bossHealth.loseHealth(damage);

    if (bossHealth.isDead()) {
      SoundManager.playBossDeathSFX();
      coinOnKillEvent(this.#scene);
      boss.destroy();
    }

    bullet.destroy();
  }

  private startCooldown() {
    this.#canShoot = false;
    this.updateReticleColor(false);
    
    // Cancela o timer anterior se existir
    if (this.#cooldownTimer) {
      this.#cooldownTimer.destroy();
    }
    
    this.#cooldownTimer = this.#scene.time.delayedCall(gun.fireRate, () => {
      this.#canShoot = true;
      this.updateReticleColor(true);
    });
  }

  destroy() {
    if (this.#scene && this.#scene.physics) {
      const world = this.#scene.physics.world;
      world.colliders.getActive().forEach((collider) => {
        if (collider.object1 === this.#bulletGroup || collider.object2 === this.#bulletGroup) {
          collider.destroy();
        }
      });
    }

    if (this.#bulletGroup) {
      this.#bulletGroup.getChildren().forEach((bullet) => {
        bullet.destroy();
      });
      this.#bulletGroup.clear(true, true);
      this.#bulletGroup.destroy();
    }
    
    if (this.#reticle) {
      this.#reticle.destroy();
    }
    
    if (this.#scene) {
      this.#scene.input.off('pointermove');
      this.#scene.input.off('pointerdown');
      this.#scene.input.off('pointerup');
      this.#scene.input.off('pointerout');
    }
    
    if (this.#cooldownTimer) {
      this.#cooldownTimer.destroy();
    }
    
    this.#scene = undefined!;
    this.#player = undefined!;
    this.#BasicEnemyGroup = undefined!;
    this.#RangedEnemyGroup = undefined;
    this.#DashEnemyGroup = undefined;
    this.#TankEnemyGroup = undefined;
    this.#boss = undefined;
    this.#bulletGroup = undefined!;
    this.#reticle = undefined!;
    this.#keys = undefined;
  }
}
