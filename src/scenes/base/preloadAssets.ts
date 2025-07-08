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
      'Conferindo as balas do rifle...',
      'Passando sebo no chapéu de couro...',
      'Amarrando o bornal na cintura...',
      'Lustrando a fivela do cinturão...',
      'Botando o bode pra pastar...',
      'Acendendo o candeeiro...',
      'Fazendo promessa pra Padim Ciço...',
      'Dando milho às galinhas...',
      'Benzendo o facão antes da batalha...',
      'Coçando o pé rachado antes de sair...'
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

    this.load.on('complete', () => {
      this.scene.stop('BootScene');
      this.scene.start('titleScene')
    });
  }

  create() {
    console.log('preloadAssets carregado');
    this.#createAnimations();
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
