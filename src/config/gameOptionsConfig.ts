export const gameOptions = {
  gameSize: {
    width: 1920,
    height: 1080,
  },
  gameBackground: 'gameBackgroundLimbo',
  type: Phaser.AUTO,
  playerSpeed: 600, // velocidade do jogador em pixels por segundo
  playerHealth: 10, // vida do player
  playerDamage: 10, // dano do player
  enemySpeed: 50, // velocidade do inimigo, em pixels por segundo
  enemyRate: 800, // rate do inimigo, inimigos por milisegundos
  enemyDamage: 2, // dano do inimigo
  bulletSpeed: 600, // velocidade da bala, em pixels por segundo
  bulletRate: 4500, // rate da bala, balas por milisegundos
  invulnerabilityDuration: 500,
};
