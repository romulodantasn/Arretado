import Phaser from 'phaser';
export class PreloadAssets extends Phaser.Scene {
  constructor() {
    super({
      key: 'PreloadAssets',
    });
  }

  preload() {
    this.load.spritesheet('playerWalk', 'assets/sprites/playerBrotatoWalk.png', {
      frameWidth: 40,
      frameHeight: 40,
    });
    this.load.spritesheet('playerRun', 'assets/sprites/playerBrotatoRun.png', {
      frameWidth: 40,
      frameHeight: 40,
    });
    this.load.image('gameBackgroundLimbo', 'assets/backgrounds/background-limbo.png');
    this.load.spritesheet('enemy', 'assets/sprites/enemyBrotato.png', {
      frameWidth: 40,
      frameHeight: 40,
    });
    this.load.image('bullet', 'assets/sprites/bullet.png');
    this.load.image('coin', 'assets/sprites/coin.png');
    this.load.image('health-bar', 'assets/sprites/health-bar.png');
    this.load.image('gun', 'assets/sprites/gun.png');
  }

  create() {
    this.scene.start('PlayGame');
  }
}
