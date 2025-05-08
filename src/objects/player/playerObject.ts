import Phaser from 'phaser';
import { inputManager } from '../../components/input/inputManagerComponent';
import { playerStats } from '../../config/playerConfig';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';

export class Player extends Phaser.Physics.Arcade.Sprite {
  direction: number = 0;
  controlKeys: any;
  #healthComponent: HealthComponent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body = this.body as Phaser.Physics.Arcade.Body;
    this.setCollideWorldBounds(true);
    this.setDepth(10);
    this.setOffset(4, 4);

    this.controlKeys = inputManager.getKeys();

    this.#healthComponent = new HealthComponent(
      playerStats.Health,
      playerStats.Health,
      'player'
    );
  }

  get healthComponent(): HealthComponent {
    return this.#healthComponent;
  }

  update() {
    this.playerMovement();
    this.playerAnimation();
  }

  public playerMovement() {
    let movementDirection = new Phaser.Math.Vector2(0, 0);
    let isMoving = false;

    if (this.controlKeys.right.isDown) {
      movementDirection.x++;
      isMoving = true;
    }
    if (this.controlKeys.left.isDown) {
      movementDirection.x--;
      isMoving = true;
    }
    if (this.controlKeys.up.isDown) {
      movementDirection.y--;
      isMoving = true;
    }
    if (this.controlKeys.down.isDown) {
      movementDirection.y++;
      isMoving = true;
    }

    this.setVelocity(0, 0);

    if (movementDirection.x === 0 || movementDirection.y === 0) {
      this.setVelocity(
        movementDirection.x * playerStats.MoveSpeed,
        movementDirection.y * playerStats.MoveSpeed
      );
    } else {
      this.setVelocity(
        (movementDirection.x * playerStats.MoveSpeed) / Math.sqrt(2),
        (movementDirection.y * playerStats.MoveSpeed) / Math.sqrt(2)
      );
    }
    return isMoving;
  }

  public playerAnimation() {
    if (this.playerMovement()) {
      if (this.anims.currentAnim?.key !== 'playerRun') {
        this.play('playerRun', true);
      }
    } else {
      if (this.anims.currentAnim?.key !== 'playerWalk') {
        this.play('playerWalk', true);
      }
    }
  }

  public takeDamage(amount: number) {
    this.#healthComponent.loseHealth(amount);
    console.log(`Player tomou ${amount} de dano.`);

    if(this.#healthComponent.isDead()) {
      console.log('Player morreu.');
    }

  }
}
