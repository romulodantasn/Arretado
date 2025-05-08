import { playerStats } from "../../config/playerConfig";
import Phaser from "phaser"

export function coinOnKillEvent(scene: Phaser.Scene) {
  playerStats.CoinGame += 1000,
    scene.game.events.emit("enemyKilled", playerStats.CoinGame);
  }
