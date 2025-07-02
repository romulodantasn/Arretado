import { HealthComponent } from "../../components/playerHealth/HealthComponent";
import { currentEnemyStats } from "../../config/enemies/EnemiesContainer";
import { Player } from "../player/Player";
import { SoundManager } from "../../config/SoundManager";
import { CUTSCENES } from "../../config/CutscenesContainer";
import { coinOnKillEvent } from "../../components/events/coinOnKillEvent";
import { globalEventEmitter } from "../../components/events/globalEventEmitter";
export class BossEnemy extends Phaser.Physics.Arcade.Sprite {
  #player: Player;
  public bulletGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
    const spriteKey = 'boss';
    super(scene, x, y, spriteKey);
    this.#player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setBounce(0, 0);
    body.setImmovable(true);

    this.setScale(6);
    this.setSize(48, 48);
    this.setOffset(6, 6);
    this.setDepth(20);
    this.setCollideWorldBounds(true);
    
    this.bulletGroup = this.scene.physics.add.group({
      bounceX: 0,
      bounceY: 0,
      collideWorldBounds: false
    });
    
    this.setupContinuousShooting(scene);

    const bossId = `boss_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const bossHealth = new HealthComponent(currentEnemyStats['BossEnemy'].Health, currentEnemyStats['BossEnemy'].Health, bossId);
    this.setData('healthComponent', bossHealth);
    
    this.play(spriteKey, true);
  }
  
  private setupContinuousShooting(scene: Phaser.Scene) {
    scene.time.addEvent({
      delay: currentEnemyStats['BossEnemy'].FireRate,
      loop: true,
      callback: () => {
        if (this.active && this instanceof Phaser.Physics.Arcade.Sprite) {
          const bullet = this.scene.physics.add.sprite(this.x, this.y, 'bossBullet');
          bullet.setOffset(0.5, 0.5);
          
          const bulletBody = bullet.body as Phaser.Physics.Arcade.Body;
          bulletBody.setBounce(0, 0);
          bulletBody.setAllowGravity(false);
          
          this.bulletGroup.add(bullet);
          scene.physics.moveToObject(bullet, this.#player, currentEnemyStats['BossEnemy'].BulletSpeed);
          
          scene.time.delayedCall(3000, () => {
            if (bullet.active) {
              bullet.destroy();
            }
          });
        }
      }
    });
  }

  public updateEnemyBossMovement(scene: Phaser.Scene) {
    if (!this.active || !this.scene) return;
    this.scene.physics.moveToObject(this, this.#player, currentEnemyStats['BossEnemy'].Speed);
    if (this.x < this.#player.x) {
      this.setFlipX(false);
    } else {
      this.setFlipX(true);
    }
  }

  public takeDamage(amount: number): void {
    if (!this.active) return;

    const healthComp = this.getData('healthComponent') as HealthComponent;
    if (!healthComp) return;

    healthComp.loseHealth(amount);

    this.scene?.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 2
    });

    if (healthComp.isDead()) {
      this.#die();
    }
  }

  #die(): void {
    console.log('Chefe derrotado! Transicionando para a próxima fase...');
    SoundManager.playBossDeathSFX();
    this.bulletGroup.clear(true, true);
    this.setActive(false);
    this.setVisible(false);
    coinOnKillEvent(this.scene);
    globalEventEmitter.emit('bossKilled'); // Emit the event
    this.destroy();
  }
}


