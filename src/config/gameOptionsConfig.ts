export const gameOptions = {
  gameSize: {
    width: 1920,
    height: 1080,
  },
  gameBackground: 'gameBackgroundLimbo',
  type: Phaser.AUTO,
  timerLeft: 20,
  invulnerabilityDuration: 500,
  currentWave: 1,
  currentAct: 1,
};

export const playerStats = {
  playerMoveSpeed: 600, // velocidade do jogador em pixels por segundo
  playerHealth: 10, // vida do player
  playerDamage: 10, // dano do player
  playerLucky: 0, // chance de crítico do player
  playerFireRate: 1000, // rate do player, tiros por milisegundos
  playerCoinGame: 0, // moedas do player
}
export const enemyStats ={
  enemyHealth: 20,
  enemySpeed: 50, // velocidade do inimigo, em pixels por segundo
  enemyRate: 1000, // rate do inimigo, inimigos por milisegundos, menor numero = maior quantidade de inimigos
  enemyDamage: 2, // dano do inimigo

}

export function onWaveComplete() {
  gameOptions.currentWave++;
  enemyStats.enemyRate -= 50;
  enemyStats.enemySpeed += 10;
  gameOptions.timerLeft += 5;
}

export const gun = {
  gunDamage: 10,
  bulletSpeed: 600, // velocidade da bala, em pixels por segundo
}
