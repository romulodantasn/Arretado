import { playerStats } from "../../config/player/PlayerConfig";
import Phaser from "phaser"

export function coinOnKillEvent(scene: Phaser.Scene) {
  playerStats.CoinGame += 5;
  if (scene && scene.game && scene.game.events) {
    scene.game.events.emit("enemyKilled", playerStats.CoinGame);
  }
}
