import { HealthComponent } from "../../components/playerHealth/HealthComponent";
import { currentEnemyStats } from "../../config/enemies/EnemiesContainer";
import { Player } from "../player/Player";
import { SoundManager } from "../../config/SoundManager";

export class BossEnemy extends Phaser.Physics.Arcade.Sprite {
  #player: Player;
  public bulletGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
    super(scene, x, y, 'boss');
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
    const bossHealth = new HealthComponent(currentEnemyStats.BossEnemy.Health, currentEnemyStats.BossEnemy.Health, bossId);
    this.setData('healthComponent', bossHealth);
  }
  
  private setupContinuousShooting(scene: Phaser.Scene) {
    scene.time.addEvent({
      delay: currentEnemyStats.BossEnemy.FireRate,
      loop: true,
      callback: () => {
        if (this.active && this instanceof Phaser.Physics.Arcade.Sprite) {
          const bullet = this.scene.physics.add.sprite(this.x, this.y, 'bossBullet');
          bullet.setOffset(0.5, 0.5);
          
          const bulletBody = bullet.body as Phaser.Physics.Arcade.Body;
          bulletBody.setBounce(0, 0);
          bulletBody.setAllowGravity(false);
          
          this.bulletGroup.add(bullet);
          scene.physics.moveToObject(bullet, this.#player, currentEnemyStats.BossEnemy.BulletSpeed);
          
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
    this.scene.physics.moveToObject(this, this.#player, currentEnemyStats.BossEnemy.Speed);
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
    console.log('Juazeiro Derrotado!');
    SoundManager.playBossDeathSFX();
    
    this.bulletGroup.clear(true, true);
    
    const currentScene = this.scene;
    
    this.setActive(false);
    this.setVisible(false);
    
    if (currentScene) {
      currentScene.scene.stop('gameHud');
      currentScene.scene.stop('PlayerHealthBar');
      currentScene.scene.stop('BossHealthBar');
      currentScene.scene.stop('PlayerBoostCooldownUI');
      currentScene.scene.stop('gameScene');
      
      currentScene.scene.start('cutscene4');
    }
    
    this.destroy();
  }
}
