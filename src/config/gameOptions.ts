// Opções de configuração
import { PreloadAssets } from "../scenes/preloadAssets";

export const GameOptions = {
  gameSize: {
    width: 1920,
    height: 1080,
  },
    gameBackground: 'gameBackgroundLimbo',
    type: Phaser.AUTO,
    playerSpeed: 100, // velocidade do jogador em pixels por segundo
    enemySpeed: 50, // velocidade do inimigo, em pixels por segundo
    bulletSpeed: 200, // velocidade da bala, em pixels por segundo
    bulletRate: 250, // rate da bala, balas por milisegundos
    enemyRate: 800, // rate do inimigo, inimigos por milisegundos
};
