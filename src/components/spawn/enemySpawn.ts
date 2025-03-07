private initializeEnemyGroup() {
    this.enemyGroup = this.physics.add.group();

    const outerRectangle = new Phaser.Geom.Rectangle(
      -100,
      -100,
      GameOptions.gameSize.width + 200,
      GameOptions.gameSize.height + 200
    );

    const innerRectangle = new Phaser.Geom.Rectangle(
      -50,
      -50,
      GameOptions.gameSize.width + 100,
      GameOptions.gameSize.height + 100
    );

    this.time.addEvent({
      delay: GameOptions.enemyRate,
      loop: true,
      callback: () => {
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
        this.enemySprite = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'enemy');
        this.enemySprite.play('enemy', true);
        this.enemyGroup.add(this.enemySprite);
      },
    });
  }