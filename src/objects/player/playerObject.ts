import Phaser from 'phaser';
import { inputManager } from '../../components/input/inputManagerComponent';
import { gameOptions } from '../../config/gameOptionsConfig';

export class player extends Phaser.Physics.Arcade.Sprite {
  direction: number = 0;
  controlKeys: any;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body = this.body as Phaser.Physics.Arcade.Body;
    this.setCollideWorldBounds(true);
    this.setDepth(10);
    this.setOffset(4, 4);

    this.controlKeys = inputManager.getKeys();
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
        movementDirection.x * gameOptions.playerMoveSpeed,
        movementDirection.y * gameOptions.playerMoveSpeed
      );
    } else {
      this.setVelocity(
        (movementDirection.x * gameOptions.playerMoveSpeed) / Math.sqrt(2),
        (movementDirection.y * gameOptions.playerMoveSpeed) / Math.sqrt(2)
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
}
