import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptionsConfig';
import { damageItems, lifeItems, moveSpeedItems, luckyItems, UpgradeOption } from '../objects/upgrades/upgrades';

export class upgradeScene extends Phaser.Scene {
  static controlKeys: any;
  #upgradeOptions: UpgradeOption[] = [...damageItems, ...lifeItems, ...moveSpeedItems, ...luckyItems];
  #selectedUpgradeIndex: number;
  #upgradeTexts: Phaser.GameObjects.Text[];

  constructor() {
    super({
      key: 'upgradeScene',
    });
    this.#selectedUpgradeIndex = 0;
    this.#upgradeTexts = [];
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    console.log('upgradeScene Carregada');
    this.displayUpgradeOptions();
    this.setupInput();
  }

  private displayUpgradeOptions() {
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
    const titleText = ['Escolha seu upgrade!'];
    this.add.text(960, 200, titleText, textStyle).setFontSize(48).setAlign('center').setOrigin(0.5);

    const upgradeBackground = this.add.rectangle(0, 0, 180, 250, 0x333333).setStrokeStyle(2, 0xffffff);

    // Display each upgrade option
    this.#upgradeOptions.forEach((UpgradeOption: UpgradeOption, index: number) => {
      const yPosition = 300 * 100;
      const upgradeText = this.add
        .text(
          960,
          yPosition,
          `${UpgradeOption.name} - ${UpgradeOption.type} - ${UpgradeOption.description} - ${UpgradeOption.sentence} - (Preço: ${UpgradeOption.cost})`,
          textStyle
        )
        .setFontSize(32)
        .setAlign('center')
        .setOrigin(0.5);
      this.#upgradeTexts.push(upgradeText);
      upgradeText.setInteractive();
      upgradeText.on('pointerdown', () => {
        this.selectUpgrade(index);
      });
    });
    this.highlightSelectedUpgrade();
    const container = this.add.container(960, 300, [upgradeBackground]);
  }

  private setupInput() {
    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    const upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    upKey.on('down', () => {
      this.#selectedUpgradeIndex = Math.max(0, this.#selectedUpgradeIndex - 1);
      this.highlightSelectedUpgrade();
    });

    downKey.on('down', () => {
      this.#selectedUpgradeIndex = Math.min(this.#upgradeOptions.length - 1, this.#selectedUpgradeIndex + 1);
      this.highlightSelectedUpgrade();
    });

    enterKey.on('down', () => {
      this.applyUpgrade();
    });
  }

  private highlightSelectedUpgrade() {
    this.#upgradeTexts.forEach((text, index) => {
      if (index === this.#selectedUpgradeIndex) {
        text.setColor('#ffff00'); // Highlight color
      } else {
        text.setColor('#ffffff'); // Default color
      }
    });
  }

  private selectUpgrade(index: number) {
    this.#selectedUpgradeIndex = index;
    this.highlightSelectedUpgrade();
  }

  private applyUpgrade() {
    const selectedUpgrade = this.#upgradeOptions[this.#selectedUpgradeIndex];
    // Check if the player has enough resources to buy the upgrade
    if (gameOptions.playerCoinGame >= selectedUpgrade.cost) {
      selectedUpgrade.effect();
      gameOptions.playerCoinGame -= selectedUpgrade.cost;
      console.log(`Upgrade ${selectedUpgrade.name} applied!`);
      this.scene.start('gameScene');
    } else {
      console.log('Not enough resources!');
      // Optionally, display a message to the player
    }
  }
}
