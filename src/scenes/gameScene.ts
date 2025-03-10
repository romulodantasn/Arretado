import Phaser from 'phaser';
import { Player } from '../objects/player/player';
import { gameOptions } from '../config/gameOptions';
import { controls } from '../components/input/controls';

export class gameScene extends Phaser.Scene {
  private player: Player;
  private controlKeys: { [key: string]: Phaser.Input.Keyboard.Key };

  constructor() {
    super({ key: 'gameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {}

  update() {}
}
