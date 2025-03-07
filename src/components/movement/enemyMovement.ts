private updateEnemyMovement() {
    this.enemyGroup.getMatching('visible', true).forEach((enemy: any) => {
      this.physics.moveToObject(enemy, this.player, GameOptions.enemySpeed);
    });
  }