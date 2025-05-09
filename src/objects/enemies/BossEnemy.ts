import { HealthComponent } from "../../components/playerHealth/HealthComponent";
import { currentEnemyStats } from "../../config/enemiesContainer";
import { Player } from "../player/playerObject";

export class BossEnemy extends Phaser.Physics.Arcade.Sprite {
  #player: Player;
  public bulletGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
    super(scene, x, y, 'boss');
    this.#player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(6);
    this.setSize(48, 48);
    this.setDepth(20);
    this.setCollideWorldBounds(true);
    this.bulletGroup = this.scene.physics.add.group();
    this.setupContinuousShooting(scene);
  

    const bossId = `boss_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const bossHealth = new HealthComponent(currentEnemyStats.BossEnemy.Health, currentEnemyStats.BossEnemy.Health, bossId);
    this.setData('healthComponent', bossHealth);

  }
  
  private setupContinuousShooting(scene: Phaser.Scene) {
    scene.time.addEvent({
      delay: currentEnemyStats.BossEnemy.FireRate,
      loop:true,
      callback: () => {
        if (this.active && this instanceof Phaser.Physics.Arcade.Sprite) {
          const bullet = this.scene.physics.add.sprite(this.x, this.y, 'bossBullet');
          bullet.setOffset(0.5,0.5)
          this.bulletGroup.add(bullet);
          scene.physics.moveToObject(bullet, this.#player, currentEnemyStats.BossEnemy.BulletSpeed);
        }
      }
    })
  }

public updateEnemyBossMovement(scene:Phaser.Scene) {
  this.scene.physics.moveToObject(this, this.#player, currentEnemyStats.BossEnemy.Speed);
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
    this.setActive(false);
    this.setVisible(false);
    this.destroy();
  }

}
