import Phaser from "phaser";
import { GameOptions } from "../config/gameOptions";

export class PreloadAssets extends Phaser.Scene {
  
  

  constructor() {
    super({
      key: "PreloadAssets",
    });
  }

  preload() {
    this.load.spritesheet("player", "assets/sprites/playerBrotatoRun.png", {
      frameWidth: 40,
      frameHeight: 40,
    });
    this.load.image(
      "gameBackgroundLimbo",
      "assets/backgrounds/background-limbo.png"
    );
    this.load.spritesheet("enemy", "assets/sprites/enemyBrotato.png", {
      frameWidth: 40,
      frameHeight: 40,
    });
    this.load.image("bullet", "assets/sprites/bullet.png");
  }

  create() {
        this.scene.start("PlayGame");
  }
}
