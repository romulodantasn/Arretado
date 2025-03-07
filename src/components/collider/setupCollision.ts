private setupCollisions() {
    this.physics.add.collider(this.player, this.enemyGroup, () => {
      console.log('Eita macho tu perdesse. Reiniciando.');
      this.resetGameSettings();
      this.scene.restart();
    });
  }