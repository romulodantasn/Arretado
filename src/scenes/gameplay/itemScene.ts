import Phaser from 'phaser';
import { itemsDisplayUi } from '../ui/itemsDisplayUi';
import { SoundManager } from '../../config/SoundManager';
import { getNextWaveKey, WaveManager } from '../../config/waves/waveManager';
import { waveIndicator } from '../../config/GameOptionsConfig';

export class itemScene extends Phaser.Scene {
  #itemsDisplayUi: itemsDisplayUi;

  constructor() {
    super({
      key: 'itemScene',
    });
  }

  init(data: { currentWave?: number, currentAct?: number }) {
    console.log(`itemScene init: data.currentWave = ${data.currentWave}, data.currentAct = ${data.currentAct}`);
    if (data.currentWave && data.currentAct) {
      waveIndicator.currentWave = data.currentWave;
      waveIndicator.currentAct = data.currentAct;
    }
    console.log(`itemScene init: waveIndicator.currentWave = ${waveIndicator.currentWave}, waveIndicator.currentAct = ${waveIndicator.currentAct}`);
  }

  private transitionToScene(targetScene: string, data?: any) {
    console.log(`itemScene transitionToScene: targetScene = ${targetScene}, current waveIndicator = ${waveIndicator.currentWave}, ${waveIndicator.currentAct}`);
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
    if (targetScene === 'gameScene') {
      const nextWaveKey = WaveManager.getWaveKey(waveIndicator.currentWave, waveIndicator.currentAct);
      console.log(`itemScene transitionToScene: Starting gameScene with waveKey = ${nextWaveKey}`);
      this.scene.start(targetScene, { waveKey: nextWaveKey });
    } else {
      this.scene.start(targetScene, data);
    }
  }

  create() {
    console.log(`itemScene create: waveIndicator.currentWave = ${waveIndicator.currentWave}, waveIndicator.currentAct = ${waveIndicator.currentAct}`);
    SoundManager.stopCurrentWaveMusic();

    this.cameras.main.setBackgroundColor(0xbfb399);

    this.#itemsDisplayUi = new itemsDisplayUi(this, 0, 0);
    this.add.existing(this.#itemsDisplayUi);
    this.#itemsDisplayUi.create();

    this.scene.stop('gameHud');
    this.scene.launch('gameHud', {
      elementsToShow: ['coins', 'wave', 'act'],
    });
    this.scene.bringToTop('gameHud');
  }

  shutdown() {
    console.log(`itemScene shutdown: waveIndicator.currentWave = ${waveIndicator.currentWave}, waveIndicator.currentAct = ${waveIndicator.currentAct}`);
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


