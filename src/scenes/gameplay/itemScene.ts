import Phaser from 'phaser';
import { itemsDisplayUi } from '../ui/itemsDisplayUi';
import { SoundManager } from '../../config/SoundManager';

export class itemScene extends Phaser.Scene {
  #itemsDisplayUi: itemsDisplayUi;

  constructor() {
    super({
      key: 'itemScene',
    });
  }

  private transitionToScene(targetScene: string, data?: any) {
    this.scene.manager.scenes.forEach(scene => {
      if (scene.scene.key !== this.scene.key && scene.scene.isActive()) {
        this.scene.stop(scene.scene.key);
      }
    });

    SoundManager.stopCurrentWaveMusic();

    if (this.#itemsDisplayUi) {
      this.#itemsDisplayUi.destroy();
    }
    this.events.removeAllListeners();

    this.scene.stop();
    this.scene.start(targetScene, data);
  }

  create() {
    SoundManager.stopCurrentWaveMusic();

    this.cameras.main.setBackgroundColor(0xbfb399);

    this.#itemsDisplayUi = new itemsDisplayUi(this, 0, 0);
    this.add.existing(this.#itemsDisplayUi);
    this.#itemsDisplayUi.create();

    this.scene.stop('gameHud');
    this.scene.launch('gameHud', { 
      elementsToShow: ['coins', 'wave', 'act']
    });
    this.scene.bringToTop('gameHud');
  }

  shutdown() {
    SoundManager.stopCurrentWaveMusic();

    if (this.scene.isActive('gameHud')) {
      this.scene.stop('gameHud');
    }

    if (this.#itemsDisplayUi) {
      this.#itemsDisplayUi.destroy();
    }
    
    this.events.removeAllListeners();
  }
}
