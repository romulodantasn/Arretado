import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';

export class Player extends Phaser.Physics.Arcade.Sprite {
  controlKeys: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(10);
  }

  public setControls(controlKeys: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  }) {
    this.controlKeys = controlKeys;
  }

  public update() {
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
      this.setVelocity(movementDirection.x * gameOptions.playerSpeed, movementDirection.y * gameOptions.playerSpeed);
    } else {
      this.setVelocity(
        (movementDirection.x * gameOptions.playerSpeed) / Math.sqrt(2),
        (movementDirection.y * gameOptions.playerSpeed) / Math.sqrt(2)
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
