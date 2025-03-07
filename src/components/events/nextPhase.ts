private advanceToNextPhase() {
    console.log('Eita caba danado! Sobreviveu! Avançando para a próxima fase');
    this.timeLeft = 45;
    GameOptions.enemyRate -= 500;
    this.scene.restart();
  }