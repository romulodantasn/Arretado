import Phaser from 'phaser';
import { inputManager } from '../../components/input/InputManager';
import { playerStats } from '../../config/player/PlayerConfig';
import { HealthComponent } from '../../components/playerHealth/HealthComponent';
import { globalEventEmitter } from '../../components/events/globalEventEmitter';
import { playerEvents } from '../../components/events/playerEvent';

export class Player extends Phaser.Physics.Arcade.Sprite {
  direction: number = 0;
  controlKeys: any;
  #healthComponent: HealthComponent;

  #isCurrentlyBoosting: boolean = false;
  readonly #boostCooldownDuration: number = 5000;
  #nextBoostActivationTime: number = 0; 

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body = this.body as Phaser.Physics.Arcade.Body;
    this.setCollideWorldBounds(true);
    this.setDepth(30);
    this.setScale(2);
    this.setOffset(14,18);

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
    let isMovingByKeyPress = false;

    if (this.controlKeys.right.isDown) {
      movementDirection.x++;
      this.flipX = false;
      isMovingByKeyPress = true;
    }
    if (this.controlKeys.left.isDown) {
      movementDirection.x--;
      this.flipX = true;
      isMovingByKeyPress = true;
    }
    if (this.controlKeys.up.isDown) {
      movementDirection.y--;
      isMovingByKeyPress = true;
    }
    if (this.controlKeys.down.isDown) {
      movementDirection.y++;
      isMovingByKeyPress = true;
    }

    if (this.controlKeys.space.isDown) {
      if (this.#isCurrentlyBoosting) {
      } else {
        if (this.scene.time.now >= this.#nextBoostActivationTime) {
          this.#isCurrentlyBoosting = true;
          this.#nextBoostActivationTime = this.scene.time.now + this.#boostCooldownDuration;
          console.log(
            `Boost ativado! Tempo atual: ${this.scene.time.now}, Boost termina em: ${
              this.#nextBoostActivationTime
            }`
          );
          globalEventEmitter.emit(playerEvents.boostActivated, this.#nextBoostActivationTime);
        }
      }
    } else {
      this.#isCurrentlyBoosting = false; 
    }

    let effectiveSpeed = playerStats.MoveSpeed;
    if (this.#isCurrentlyBoosting) {
      const SPEED_BOOST_FACTOR = 1.5;
      effectiveSpeed *= SPEED_BOOST_FACTOR;
    }

    this.setVelocity(0, 0);
    if (movementDirection.x !== 0 || movementDirection.y !== 0) {
      if (movementDirection.x === 0 || movementDirection.y === 0) { 
        this.setVelocity(
          movementDirection.x * effectiveSpeed,
          movementDirection.y * effectiveSpeed
        );
      } else { 
        const diagonalFactor = Math.sqrt(2);
        this.setVelocity(
          (movementDirection.x * effectiveSpeed) / diagonalFactor,
          (movementDirection.y * effectiveSpeed) / diagonalFactor
        );
      }
    }
    return isMovingByKeyPress;
  }

  public playerAnimation() {
    if (this.playerMovement()) {
      if (this.anims.currentAnim?.key !== 'lampiaoRun') {
        this.play('lampiaoRun', true);
      }
    } else {
      if (this.anims.currentAnim?.key !== 'lampiaoIdle') {
        this.play('lampiaoIdle', true);
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
