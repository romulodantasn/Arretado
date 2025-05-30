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
    // Para todas as cenas ativas exceto a atual
    this.scene.manager.scenes.forEach(scene => {
      if (scene.scene.key !== this.scene.key && scene.scene.isActive()) {
        this.scene.stop(scene.scene.key);
      }
    });

    // Para a música da onda atual
    SoundManager.stopCurrentWaveMusic();

    // Limpa recursos
    if (this.#itemsDisplayUi) {
      this.#itemsDisplayUi.destroy();
    }
    this.events.removeAllListeners();

    // Para a cena atual e inicia a nova
    this.scene.stop();
    this.scene.start(targetScene, data);
  }

  create() {
    // Para a música da onda atual quando entrar na cena de itens
    SoundManager.stopCurrentWaveMusic();

    this.#itemsDisplayUi = new itemsDisplayUi(this, 0, 0);
    this.add.existing(this.#itemsDisplayUi);
    this.#itemsDisplayUi.create();
  }

  shutdown() {
    // Garante que a música está parada quando a cena for fechada
    SoundManager.stopCurrentWaveMusic();

    // Limpa recursos
    if (this.#itemsDisplayUi) {
      this.#itemsDisplayUi.destroy();
    }
    this.events.removeAllListeners();
  }
}
