export const gameOptions = {
  gameSize: {
    width: 1920,
    height: 1080,
  },
  gameBackground: 'gameBackgroundLimbo',
  type: Phaser.AUTO,
  playerMoveSpeed: 600, // velocidade do jogador em pixels por segundo
  playerHealth: 10, // vida do player
  playerDamage: 10, // dano do player
  playerLucky: 0, // chance de crítico do player
  playerFireRate: 1000, // rate do player, tiros por milisegundos
  playerCoinGame: 600, // moedas do player

  enemySpeed: 50, // velocidade do inimigo, em pixels por segundo
  enemyRate: 800, // rate do inimigo, inimigos por milisegundos
  enemyDamage: 2, // dano do inimigo

  bulletSpeed: 600, // velocidade da bala, em pixels por segundo
  //bulletRate: 10000, // rate da bala, balas por milisegundos

  invulnerabilityDuration: 500,
};
