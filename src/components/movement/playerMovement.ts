private handlePlayerMovement() {
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

    this.player.setVelocity(0, 0);

    if (movementDirection.x === 0 || movementDirection.y === 0) {
      this.player.setVelocity(
        movementDirection.x * GameOptions.playerSpeed,
        movementDirection.y * GameOptions.playerSpeed
      );
    } else {
      this.player.setVelocity(
        (movementDirection.x * GameOptions.playerSpeed) / Math.sqrt(2),
        (movementDirection.y * GameOptions.playerSpeed) / Math.sqrt(2)
      );
    }
    return isMoving;
  }