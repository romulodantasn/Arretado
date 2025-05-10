import Phaser from 'phaser';
import { itemsDisplayUi } from '../objects/ui/itemsDisplayUi';

export class itemScene extends Phaser.Scene {
  #itemsDisplayUi: itemsDisplayUi;

  constructor() {
    super({
      key: 'itemScene',
    });
  }

  create() {
    this.#itemsDisplayUi = new itemsDisplayUi(this, 0, 0);
    this.add.existing(this.#itemsDisplayUi);
    this.#itemsDisplayUi.create();
  }
}
