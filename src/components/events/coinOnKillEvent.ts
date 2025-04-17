import { playerStats } from "../../config/gameOptionsConfig"
import Phaser from "phaser"

export function coinOnKillEvent(scene: Phaser.Scene) {
  playerStats.playerCoinGame += 1000,
    scene.game.events.emit("enemyKilled", playerStats.playerCoinGame);
  }
