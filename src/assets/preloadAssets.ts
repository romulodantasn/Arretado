import Phaser from 'phaser';
export class PreloadAssets extends Phaser.Scene {
  constructor() {
    super({
      key: 'PreloadAssets',
    });
  }

  preload() {
    this.load.spritesheet('playerWalk', 'assets/sprites/playerBrotatoWalk.png');
    this.load.spritesheet('playerRun', 'assets/sprites/playerBrotatoRun.png');
    this.load.spritesheet('enemy', 'assets/sprites/enemyBrotato.png');
    this.load.image('gameBackgroundLimbo', 'assets/backgrounds/background-limbo.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
    this.load.image('coin', 'assets/sprites/coin.png');
    this.load.image('health-bar', 'assets/sprites/health-bar.png');
    this.load.image('gun', 'assets/sprites/gun.png');
  }

  create() {
    this.scene.start('PlayGame');

    this.add
      .image(0, 0, 'gameBackgroundLimbo')
      .setOrigin(0, 0)
      .setDisplaySize(GameOptions.gameSize.width, GameOptions.gameSize.height);
    this.add.image(80, 40, 'health-bar').setDisplaySize(120, 120);
    this.add.image(60, 130, 'gun').setDisplaySize(90, 90);
    this.add.image(1770, 130, 'coin').setDisplaySize(60, 60);

    /*this.anims.create({
      key: 'playerWalk',
      frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 3 }),
      frameRate: 16,
      repeat: -1,
    });
    this.player.play('playerWalk', true);

    this.anims.create({
      key: 'playerRun',
      frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 6 }),
      frameRate: 16,
      repeat: -1,
    });
    this.player.play('playerRun', true);

    this.anims.create({
      key: 'enemy',
      frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });*/
  }
}
