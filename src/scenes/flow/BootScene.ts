/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  private loadingSprite: Phaser.GameObjects.Sprite;
  private loadingText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.spritesheet('loading', 'assets/images/loading.png', {
      frameWidth: 40,
      frameHeight: 63   
    });
    this.load.json('animations_json', 'assets/data/animations.json');
  }

  create() {
    console.log('BootScene carregado');

    this.anims.create({
      key: 'loading_anim',
      frames: this.anims.generateFrameNumbers('loading', { start: 0, end: 4  }),
      frameRate: 12,
      repeat: -1
    });

    this.loadingSprite = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 50,
      'loading'
    );
this.loadingSprite.setTint(0xffffff);
this.loadingSprite.play('loading_anim');

    this.loadingSprite.play('loading_anim');

    this.loadingText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 100,
      'Carregando...',
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);

    this.scene.launch('preloadAssets');
  }
}
