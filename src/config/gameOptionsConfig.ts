export const gameOptions = {
  gameSize: {
    width: 1920,
    height: 1080,
  },
  gameBackground: 'gameBackgroundLimbo',
  type: Phaser.AUTO,
  timerLeft: 20,
  invulnerabilityDuration: 500,
 
};

export const waveIndicator ={
  currentWave: 1,
  currentAct: 1,
}

// export const basicEnemyStats ={
//   Health: 20,
//   Speed: 50, // velocidade do inimigo, em pixels por segundo
//   Rate: 1000, // rate do inimigo, inimigos por milisegundos, menor numero = maior quantidade de inimigos
//   Damage: 1, // dano do inimigo

// }

// export const bossEnemyStats = {
//   Health: 100,
//   Speed: 25,
//   Damage: 3,
//   Rate: 1000,
// }

export function onWaveComplete() {
  waveIndicator.currentWave++;
  basicEnemyStats.Rate -= 50;
  basicEnemyStats.Speed += 10;
  gameOptions.timerLeft += 5;
}

export const gun = {
  gunDamage: 10,
  bulletSpeed: 600, // velocidade da bala, em pixels por segundo
}
