private phaseCount() {
    this.waveCount = 1;
    this.waveText = this.add
      .text(1740, 48, `Onda:${this.waveCount}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
    this.actCount = 1;
    this.actText = this.add
      .text(1744, 8, `Ato:${this.actCount}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
  }