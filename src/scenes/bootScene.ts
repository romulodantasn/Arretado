/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';

export class bootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'bootScene' });
  }

  preload() {
    this.load.json('animations_json', 'assets/data/animations.json');
  }

  create() {
    console.log('bootScene carregado');
    this.scene.start('preloadAssets');
  }
}
