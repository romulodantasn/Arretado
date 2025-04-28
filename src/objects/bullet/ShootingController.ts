import { inputManager } from '../../components/input/inputManagerComponent';
import { gameOptions, enemyStats, gun } from '../../config/gameOptionsConfig';
import { Player } from '../player/playerObject';
import { enemyGroup } from '../enemies/enemyObject';
import { coinOnKillEvent } from '../../components/events/coinOnKillEvent';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';

export class shootingController {
  #scene: Phaser.Scene;
  #player: Player;
  #enemyGroup: enemyGroup;
  #bulletGroup: Phaser.Physics.Arcade.Group;
  #reticle: Phaser.GameObjects.Sprite;
  #keys: any;

  constructor(scene: Phaser.Scene, player: Player, enemyGroup: enemyGroup, reticle: Phaser.GameObjects.Sprite) {
    this.#scene = scene;
    this.#player = player;
    this.#reticle = reticle;
    this.#enemyGroup = enemyGroup;
    this.#bulletGroup = this.#scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true
    });
    this.#keys = inputManager.getKeys();
    this.#scene.physics.add.collider(this.#bulletGroup, this.#enemyGroup, this.bulletCollision, undefined, this);

  }

  create() {
    this.setupReticle();
    this.setupShooting();
    console.log('BulletComponent criado');
  }

  public setupReticle() {
    this.#reticle = this.#scene.add.sprite(this.#player.x, this.#player.y - 50, 'reticle');
    this.#reticle.setOrigin(0.5, 0.5).setDisplaySize(40, 40);
    this.#reticle.setActive(true).setVisible(true);
    this.#scene.input.setDefaultCursor('none');

    this.#scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.#reticle.x = pointer.worldX;
      this.#reticle.y = pointer.worldY;
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
        this.fireBullet(this.#player, this.#reticle);
      },
    });
  }

  public fireBullet(shooter: Player, target: Phaser.GameObjects.Sprite) {
    const bullet = this.#bulletGroup.get(shooter.x, shooter.y, 'bullet') as Phaser.Physics.Arcade.Sprite;
    const angle = Phaser.Math.Angle.Between(shooter.x, shooter.y, target.x, target.y);
    const speed = gun.bulletSpeed;

    this.#bulletGroup.add(bullet);
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    bullet.setActive(true).setVisible(true);
  }

  private bulletCollision(
    bullet: any,
    enemy: any
  ) {
    
    if (!bullet.active || !enemy.active || !(enemy instanceof Phaser.Physics.Arcade.Sprite)) {
        return; 
    }

    const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;
    const healthComp = enemyGroup.getHealthComponent(enemySprite);

    if (healthComp) {
        const bulletDamage = gun.gunDamage;
        healthComp.loseHealth(bulletDamage);
         console.log(`Enemy hit. Health: ${healthComp.currentHealth}/${healthComp.maxHealth}`); // Debug log

        if (healthComp.isDead()) {
            console.log('Enemy destroyed by bullet');
            
            coinOnKillEvent(this.#scene);
            enemySprite.destroy(); 
        }
    } else {
        console.warn('Collided enemy does not have a HealthComponent:', enemySprite)
    }
        bullet.destroy(); 
  }
}