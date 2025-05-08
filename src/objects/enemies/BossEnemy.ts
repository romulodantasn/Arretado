import { HealthComponent } from "../../components/playerHealth/HealthComponent";
import { currentEnemyStats } from "../../config/enemiesContainer";
import { Player } from "../player/playerObject";

export class BossEnemy extends Phaser.Physics.Arcade.Sprite {
  #player: Player;
  #lastStableDirection: string = 'down'; // Guarda a última direção estável para evitar flickering

  constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
    super(scene, x, y, 'boss');
    this.#player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(4);
    this.setSize(48, 48);
    this.setDepth(20);
    this.setCollideWorldBounds(true);

    const bossId = `boss_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const bossHealth = new HealthComponent(currentEnemyStats.BossEnemy.Health, currentEnemyStats.BossEnemy.Health, bossId);
    this.setData('healthComponent', bossHealth);

  }

  update(time: number, delta: number) {
    if (!this.active) return;
  
    this.scene.physics.moveToObject(this, this.#player, currentEnemyStats.BossEnemy.Speed);
    // this.play('boss_left',true)
    // this.#playDirectionalAnim();
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

  #playDirectionalAnim() {
    const dx = this.#player.x - this.x;
    const dy = this.#player.y - this.y;
  
    let direction = this.#lastStableDirection;
  
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'right' : 'left';
    } else {
      direction = dy > 0 ? 'down' : 'up';
    }
  
    const animKey = `boss_${direction}`;
    const currentAnim = this.anims.currentAnim?.key;
  
    if (currentAnim !== animKey && this.scene.anims.exists(animKey)) {
      console.log(`Tocando animação: ${animKey}`);
      this.stop(); // Parar a animação anterior
      this.play(animKey, true); // Reproduzir a nova animação
      this.#lastStableDirection = direction;
    } else if (currentAnim === animKey) {
      console.log(`Já tocando a animação: ${currentAnim}`);
    }
  }
  
  
  
  
}
