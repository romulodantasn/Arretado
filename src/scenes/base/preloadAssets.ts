import Phaser from 'phaser';

export class preloadAssets extends Phaser.Scene {
  private loadingMessages: string[];
  private currentMessageIndex: number;
  private bootScene: Phaser.Scene;

  constructor() {
    super({
      key: 'preloadAssets',
    });

    this.loadingMessages = [
      'Vestindo a roupa de lampião...',
      'Terminando de cozinhar o cuscuz...',
      'Preparando o rifle...',
      'Enchendo o cantil de água...',
      'Ajeitando o chapéu...',
      'Colocando as precata...',
      'Ajeitando a cueca pra não mostrar o rego....',
      'Pedindo o uber pra Maria Bonita....',

    ];
    this.currentMessageIndex = 0;
  }

  preload() {
    this.bootScene = this.scene.get('BootScene');

    this.load.on('progress', (value: number) => {
      const messageIndex = Math.floor(value * this.loadingMessages.length);
      if (messageIndex !== this.currentMessageIndex && messageIndex < this.loadingMessages.length) {
        this.currentMessageIndex = messageIndex;
        const bootScene = this.bootScene as any;
        if (bootScene.loadingText) {
          bootScene.loadingText.setText(this.loadingMessages[this.currentMessageIndex]);
        }
      }
    });

    this.load.pack('asset_pack', 'assets/data/assets.json');
    this.load.pack('audio_pack', 'assets/data/audio_assets.json');
    this.load.font('Cordelina', 'assets/font/cordelina.otf');
  }

  create() {
    console.log('preloadAssets carregado');
    this.#createAnimations();

    this.time.delayedCall(1000, () => {
      this.scene.stop('BootScene');
      this.scene.start('titleScene');
    });
  }

  #createAnimations() {
    const data = this.cache.json.get('animations_json');
    data.forEach((animation: { frames: any; assetKey: string; key: any; frameRate: any; repeat: any }) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, { frames: animation.frames })
        : this.anims.generateFrameNumbers(animation.assetKey);
      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
    });
  }
}
