import { gameOptions } from "../../config/gameOptionsConfig"
import Phaser from "phaser"

export function coinOnKillEvent(scene: Phaser.Scene) {
  gameOptions.playerCoinGame += 1000,
    scene.game.events.emit("enemyKilled", gameOptions.playerCoinGame),
    console.log(`Inimigo morto, ganhou +1000 moedas. Total: ${gameOptions.playerCoinGame}`);
  }
