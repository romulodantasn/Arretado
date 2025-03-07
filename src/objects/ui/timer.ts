private initializeTimer() {
    this.timeLeft = 45;
    this.timerText = this.add
      .text(920, 16, `00:${this.timeLeft}`, {
        fontSize: '24px',
        color: '#fff',
      })
      .setDepth(10);

    this.time.addEvent({
      delay: 1000, // milissegundos
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

private updateTimer() {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timerText.setText(`00:${this.timeLeft}`);
      }
  
      if (this.timeLeft <= 0) {
        this.advanceToNextPhase();
      }
    }