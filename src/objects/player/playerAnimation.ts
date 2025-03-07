private animationPlayerControl() {
    if (this.handlePlayerMovement()) {
      if (this.player.anims.currentAnim?.key !== 'playerRun') {
        this.player.play('playerRun', true);
      }
    } else {
      if (this.player.anims.currentAnim?.key !== 'playerWalk') {
        this.player.play('playerWalk', true);
      }
    }
  }