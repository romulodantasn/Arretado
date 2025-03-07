private coinCount() {
    this.coinGame = 10;
    this.waveText = this.add
      .text(1820, 110, `${this.coinGame}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
  }