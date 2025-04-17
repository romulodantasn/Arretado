import { inputManager } from '../../components/input/inputManagerComponent';
import { gameOptions, enemyStats, gun } from '../../config/gameOptionsConfig';
import { player } from '../player/playerObject';
import { enemyGroup } from '../enemies/enemyObject';
import { coinOnKillEvent } from '../../components/events/coinOnKillEvent';
import { healthEvents } from '../../components/events/healthEvent';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';

export class shootingController {
  #scene: Phaser.Scene;
  #player: player;
  #enemy: enemyGroup;
  #health: HealthComponent;
  #bulletGroup: Phaser.Physics.Arcade.Group;
  #reticle: Phaser.GameObjects.Sprite;
  #keys: any;

  constructor(scene: Phaser.Scene, player: player, enemyGroup: enemyGroup, reticle: Phaser.GameObjects.Sprite) {
    this.#scene = scene;
    this.#player = player;
    this.#reticle = reticle;

    this.#enemy = enemyGroup;
    this.#bulletGroup = this.#scene.physics.add.group();
    this.#keys = inputManager.getKeys();
  }

  create() {
    this.reticleMovement();
    this.setupShooting();
    this.createBullet(this.#player, this.#reticle);
    console.log('BulletComponent criado');
  }

  public reticleMovement() {
    this.#reticle = this.#scene.add.sprite(this.#player.x, this.#player.y - 50, 'reticle');
    this.#reticle.setOrigin(0.5, 0.5).setDisplaySize(40, 40);
    this.#reticle.setActive(true).setVisible(true);
    this.#scene.input.setDefaultCursor('none');

    this.#scene.input.on('pointermove', (reticle: Phaser.Input.Pointer) => {
      this.#reticle.x = reticle.worldX;
      this.#reticle.y = reticle.worldY;
    });
  }

  public containReticle() {
    if (this.#reticle) {
      this.#reticle.x = Phaser.Math.Clamp(this.#reticle.x, 0, this.#scene.scale.width);
      this.#reticle.y = Phaser.Math.Clamp(this.#reticle.y, 0, this.#scene.scale.height);
    }
  }

  public setupShooting() {
    inputManager.setupClicks(this.#scene, {
      onFire: () => {
        console.log('Atirando!');
        this.createBullet(this.#player, this.#reticle);
      },
    });
  }

  public createBullet(shooter: player, target: Phaser.GameObjects.Sprite) {
    const bullet = this.#scene.physics.add.sprite(shooter.x, shooter.y, 'bullet');
    const angle = Phaser.Math.Angle.Between(shooter.x, shooter.y, target.x, target.y);
    const speed = gun.bulletSpeed;

    this.#bulletGroup.add(bullet);
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    bullet.setActive(true).setVisible(true);
    this.#scene.physics.add.collider(this.#bulletGroup, this.#enemy, this.bulletCollision, undefined, this);
  }

  private bulletCollision(bullet: any, target: any) {

    // this.#health.loseHealth(enemyStats.enemyDamage);
    // this.#scene.events.emit(
    //   healthEvents.loseHealth,
    //   this.#health.currentHealth,
    //   this.#health.currentHealth + enemyStats.enemyDamage
    // );
    this.#bulletGroup.killAndHide(bullet);
    bullet.body.checkCollision.none = true;
    this.#enemy.killAndHide(target);
    target.body.checkCollision.none = true;
    coinOnKillEvent(this.#scene)
  }

 
}
