import Phaser from "phaser";
import { gameOptions } from "../../config/GameOptionsConfig";
import { gun } from "../../config/GameOptionsConfig";

export class inputManager {
  static controlKeys: any;

  static setupControls(scene: Phaser.Scene) {
    const keyboard = scene.input
      .keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    inputManager.controlKeys = keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      moveUp: Phaser.Input.Keyboard.KeyCodes.UP,
      moveDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
      moveLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
      moveRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
  }

  static getKeys() {
    if (!inputManager.controlKeys) {
      throw new Error("Control keys não foram inicializadas.");
    }
    return inputManager.controlKeys;
  }

  static setupClicks(
    scene: Phaser.Scene,
    callbacks: { onFire?: (pointer: Phaser.Input.Pointer) => void }
  ) {
    let fireInterval: Phaser.Time.TimerEvent | null = null;
    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        if (callbacks.onFire) {
          callbacks.onFire(pointer);

          fireInterval = scene.time.addEvent({
            delay: gun.fireRate,
            loop: true,
            callback: () => callbacks.onFire?.(pointer),
          });
        }
      }
    });

    scene.input.on("pointerup", () => {
      if (fireInterval) {
        fireInterval.remove();
        fireInterval = null;
      }
    });

    scene.input.on("pointerout", () => {
      if (fireInterval) {
        fireInterval.remove();
        fireInterval = null;
      }
    });
  }
}
