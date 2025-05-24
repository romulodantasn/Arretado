import { inputManager } from '../../components/input/inputManagerComponent';
import { gameOptions, gun } from '../../config/gameOptionsConfig';
import { Player } from '../player/playerObject';
import { BasicEnemyGroup } from '../enemies/BasicEnemyGroup';
import { DashEnemyGroup } from '../enemies/DashEnemyGroup'; 
import { coinOnKillEvent } from '../../components/events/coinOnKillEvent';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';
import { BossEnemy } from '../enemies/BossEnemy';
import { TankEnemyGroup } from '../enemies/TankEnemyGroup';
import { RangedEnemyGroup } from '../enemies/RangedEnemyGroup';

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
    this.#scene.physics.add.collider(this.#bulletGroup, this.#BasicEnemyGroup, this.basicEnemyCollision, undefined, this);

    if (this.#DashEnemyGroup) {
      this.#scene.physics.add.collider(this.#bulletGroup, this.#DashEnemyGroup, this.bulletDashEnemyCollision, undefined, this);
    }

    if (this.#RangedEnemyGroup) {
      this.#scene.physics.add.collider(this.#bulletGroup, this.#RangedEnemyGroup, this.rangedEnemyCollision, undefined, this);
    } 

    if (this.#TankEnemyGroup) {
      this.#scene.physics.add.collider(this.#bulletGroup, this.#TankEnemyGroup, this.bulletTankEnemyCollision, undefined, this);
    } 

    if (this.#boss?.active) {
      this.#scene.physics.add.collider(this.#bulletGroup, this.#boss, this.bulletBossCollision, undefined, this);
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
        this.fireBullet(this.#player, this.#reticle);
            this.#scene.cameras.main.shake(200, 0.0005);
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
      coinOnKillEvent(this.#scene);
      enemy.destroy();
    }

    bullet.destroy();
  }

  private bulletDashEnemyCollision(bullet: any, dashEnemy: any) {
    if (!bullet.active || !dashEnemy.active) return;

   const enemyHealth = DashEnemyGroup.getHealthComponent(dashEnemy);

    if (!enemyHealth) return;

    const damage = gun.gunDamage;
    this.showDamageText(dashEnemy.x, dashEnemy.y - 50, damage);
    enemyHealth.loseHealth(damage);

    if (enemyHealth.isDead()) {
      coinOnKillEvent(this.#scene);
      dashEnemy.destroy();
    }

    bullet.destroy();
  }

  private bulletTankEnemyCollision(bullet: any, tankEnemy: any) {
    if (!bullet.active || !tankEnemy.active) return;

   const enemyHealth = TankEnemyGroup.getHealthComponent(tankEnemy);

    if (!enemyHealth) return;

    const damage = gun.gunDamage;
    this.showDamageText(tankEnemy.x, tankEnemy.y - 50, damage);
    enemyHealth.loseHealth(damage);

    if (enemyHealth.isDead()) {
      coinOnKillEvent(this.#scene);
      tankEnemy.destroy();
    }

    bullet.destroy();
  }



  private bulletBossCollision(obj1: any, obj2: any) {
    const boss = obj1 instanceof BossEnemy ? obj1 : obj2 instanceof BossEnemy ? obj2 : null;
    const bullet = obj1 instanceof Phaser.Physics.Arcade.Sprite && !(obj1 instanceof BossEnemy)
      ? obj1 : obj2 instanceof Phaser.Physics.Arcade.Sprite && !(obj2 instanceof BossEnemy)
      ? obj2 : null;

    if (!boss || !bullet || !boss.active || !bullet.active) return;

    const bossHealth = boss.getData('healthComponent') as HealthComponent | null;
    if (!bossHealth) {
      console.warn("Boss sem HealthComponent.");
      return;
    }

    const damage = gun.gunDamage;
    this.showDamageText(boss.x, boss.y - 50, damage);
    boss.takeDamage(damage);

    if (!boss.active) {
      coinOnKillEvent(this.#scene);
    }

    bullet.destroy();
  }
}
