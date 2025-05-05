import { HealthComponent } from "../../components/playerHealth/HealthComponent";
import { bossEnemyStats } from "../../config/gameOptionsConfig";
import { Player } from "../player/playerObject";

export class BossEnemy extends Phaser.Physics.Arcade.Sprite {
  #player: Player;
  #currentAnim: string = '';

  constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
    super(scene, x, y, 'boss');
    this.#player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(2);
    this.setSize(48, 48);
    // this.setOffset(2, 2);
    this.setDepth(20);
    this.setCollideWorldBounds(true);

    const bossId = `boss_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const bossHealth = new HealthComponent(bossEnemyStats.bossHealth, bossEnemyStats.bossHealth, bossId);
    this.setData('healthComponent', bossHealth);

    this.#playDirectionalAnim();
  }


  public takeDamage(amount: number): void {
    if (!this.active) return;

    const healthComp = this.getData('healthComponent') as HealthComponent;
    if(!healthComp) return;
    healthComp.loseHealth(amount);

    this.scene?.tweens.add({
        targets: this,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 2
    });

    if (healthComp.isDead()) {
        this.die();
    }
  }

  update(time: number, delta: number) {
    if (!this.active) return;
    console.log("BossEnemy update running!")
  

  console.log("Boss Speed:", bossEnemyStats.bossSpeed);
  console.log("Player valid?", this.#player && this.#player.active);

  this.scene.physics.moveToObject(this, this.#player, bossEnemyStats.bossSpeed);

  this.#playDirectionalAnim();
  }

  private die(): void {
    console.log('Juazeiro Derrotado!');
    this.setActive(false);
    this.setVisible(false);
    this.destroy();
  }


  #playDirectionalAnim() {
    const playerDirectionX = this.#player.x - this.x;
    const playerDirectionY = this.#player.y - this.y;

    const absDx = Math.abs(playerDirectionX);
    const absDy = Math.abs(playerDirectionY);

    let direction = 'front';

    if (absDx > absDy) {
      direction = playerDirectionX > 0 ? 'right' : 'left';
    } else {
      direction = playerDirectionY > 0 ? 'front' : 'back';
    }

    const animKey = `boss_${direction}`;

    if (this.anims.animationManager.exists(animKey) && this.#currentAnim !== animKey) {
      this.play(animKey, true);
      this.#currentAnim = animKey;
    }
  }
}
