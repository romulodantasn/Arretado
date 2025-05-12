import Phaser from 'phaser';
export class preloadAssets extends Phaser.Scene {
  constructor() {
    super({
      key: 'preloadAssets',
    });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
    this.load.font('Cordelina', 'assets/font/cordelina.otf');
  }

  create() {
    console.log('preloadAssets carregado');
    this.#createAnimations();
    // this.scene.start('titleScene');
    this.scene.start('SkinScene');
  }

  //Metodo privado para criar e carregar as animações
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
