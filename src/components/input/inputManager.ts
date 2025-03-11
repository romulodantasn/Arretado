import Phaser from 'phaser';

export class inputManager {
  static controlKeys: any;

  static setupControls(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    inputManager.controlKeys = keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
  }

  static getKeys() {
    if (!inputManager.controlKeys) {
      throw new Error('Control keys not initialized. Please call setupControls first.');
    }
    return inputManager.controlKeys;
  }
}
