import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptionsConfig';
import { damageItems, lifeItems, moveSpeedItems, luckyItems, itemsContainer } from '../objects/upgrades/itemsContainer';
import { itemsDisplayUi } from '../objects/ui/itemsDisplayUi';
import { preloadAssets } from './preloadAssets';

export class itemsScene extends Phaser.Scene {
  #upgradeOptions: itemsContainer[] = [...damageItems, ...lifeItems, ...moveSpeedItems, ...luckyItems];
  #damageItems: itemsContainer[] = damageItems;
  #lifeItems: itemsContainer[] = lifeItems;
  #moveSpeedItems: itemsContainer[] = moveSpeedItems;
  #luckyItems: itemsContainer[] = luckyItems;
  #upgradeContainers: Phaser.GameObjects.Container[];
  #selectedUpgradeIndex: number;
  #upgradeTexts: Phaser.GameObjects.Text[];

  constructor() {
    super({
      key: 'upgradeScene',
    });
    this.#selectedUpgradeIndex = 0;
    this.#upgradeTexts = [];
    this.#upgradeContainers = [];
  }

  preload() {
    new preloadAssets();
  }

  create() {
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
    const titleText = ['Eai, Caba. O que vai ser?'];
    this.add.text(960, 200, titleText, textStyle).setFontSize(48).setAlign('center').setOrigin(0.5);
    console.log('upgradeScene Carregada');
    this.setupInput();
  }

  private findUpgradeByImageKey(items: itemsContainer[], imageKey: string): itemsContainer | undefined {
    return items.find((item) => item.imageKey === imageKey);
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
      console.log('Ta liso!');
      // Optionally, display a message to the player
    }
  }
}
