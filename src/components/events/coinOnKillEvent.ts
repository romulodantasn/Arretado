import { playerStats } from "../../config/playerConfig";
import Phaser from "phaser"

export function coinOnKillEvent(scene: Phaser.Scene) {
  playerStats.CoinGame += 100,
    scene.game.events.emit("enemyKilled", playerStats.CoinGame);
  }
