import Phaser from 'phaser';

export class controls extends Phaser.Scene {
  controlKeys: { [key: string]: Phaser.Input.Keyboard.Key };
  constructor() {
    super({
      key: 'controls',
    });
  }

  create() {
    this.keyboardControl();
  }

  public keyboardControl() {
    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    this.controlKeys = keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    }) as { [key: string]: Phaser.Input.Keyboard.Key };
  }
}
