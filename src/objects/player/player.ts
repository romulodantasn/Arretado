 private initializePlayer() {
    console.log('Player inicializado!');
    this.player = this.physics.add
      .sprite(GameOptions.gameSize.width / 2, GameOptions.gameSize.height / 2, 'player')
      .setCollideWorldBounds(true)
      .setVisible(true)
      .setActive(true)
      .setDepth(10);
  }