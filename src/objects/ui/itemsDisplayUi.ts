import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptionsConfig';
import {
  damageItems,
  lifeItems,
  moveSpeedItems,
  luckyItems,
  itemsContainer,
} from '../../objects/upgrades/itemsContainer';

export class itemsDisplayUi extends Phaser.GameObjects.Container {
  #damageItems: itemsContainer[] = damageItems;
  #lifeItems: itemsContainer[] = lifeItems;
  #moveSpeedItems: itemsContainer[] = moveSpeedItems;
  #luckyItems: itemsContainer[] = luckyItems;
  #upgradeContainers: Phaser.GameObjects.Container[];
  #upgradeOptions: itemsContainer[] = [
    ...this.#damageItems,
    ...this.#lifeItems,
    ...this.#moveSpeedItems,
    ...this.#luckyItems,
  ];

  create() {
    console.log('itemsDisplay Carregada');
    this.displayUpgradeOptions();
  }

  // função pra achar a imagem pelo imageKey
  private findUpgradeOptionByImageKey(items: itemsContainer[], imageKey: string): itemsContainer | undefined {
    return items.find((item) => item.imageKey === imageKey);
  }

  private displayUpgradeOptions() {
    // Create the background containers
    const upgradeBgDamage = this.createUpgradeContainer(200, 600, 0x333333, this.#damageItems, 'damage');
    const upgradeBgLife = this.createUpgradeContainer(600, 600, 0x333333, this.#lifeItems, 'life');
    const upgradeBgMoveSpeed = this.createUpgradeContainer(1000, 600, 0x333333, this.#moveSpeedItems, 'moveSpeed');
    const upgradeBgLucky = this.createUpgradeContainer(1400, 600, 0x333333, this.#luckyItems, 'lucky');
  }

  private createUpgradeContainer(
    x: number,
    y: number,
    color: number,
    items: itemsContainer[],
    type: string
  ): Phaser.GameObjects.Container {
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
    const titleText = ['Eai, Caba. O que vai ser?'];
    this.scene.add.text(960, 200, titleText, textStyle).setFontSize(48).setAlign('center').setOrigin(0.5);
    const upgradeBg = this.scene.add.rectangle(0, 0, 350, 580, color).setStrokeStyle(2, 0xffffff);
    const container = this.scene.add.container(x, y, [upgradeBg]);
    this.#upgradeContainers.push(container);
    container.setSize(350, 580);
    container.setInteractive(new Phaser.Geom.Rectangle(-175, -290, 350, 580), Phaser.Geom.Rectangle.Contains);

    container.on('pointerover', () => {
      upgradeBg.setFillStyle(0x555555);
    });
    container.on('pointerout', () => {
      upgradeBg.setFillStyle(color);
    });

    items.forEach((item, index) => {
      const image = this.scene.add.image(0, -100, item.imageKey).setScale(0.5);
      const nameText = this.scene.add
        .text(0, 0, item.name, { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 })
        .setOrigin(0.5)
        .setFontSize(32);
      const descriptionText = this.scene.add
        .text(0, 50, item.description, {
          fontFamily: 'Cordelina',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setFontSize(24);
      const costText = this.scene.add
        .text(0, 100, `Cost: ${item.cost}`, {
          fontFamily: 'Cordelina',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setFontSize(24);
      container.add([image, nameText, descriptionText, costText]);

      container.on('pointerdown', () => {
        if (gameOptions.playerCoinGame >= item.cost) {
          item.effect();
          gameOptions.playerCoinGame -= item.cost;
          console.log(`Upgrade ${item.name} applied!`);
          this.scene.scene.start('gameScene');
        } else {
          console.log('Not enough resources!');
        }
      });
    });
    return container;
  }

  /*private setupInput() {
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
  }*/
}
