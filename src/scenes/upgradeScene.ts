import Phaser from 'phaser';
import { gameOptions } from '../config/gameOptionsConfig';
import { damageItems, lifeItems, moveSpeedItems, luckyItems, UpgradeOption } from '../objects/upgrades/upgrades';
import type { damageItems as DamageItemsType } from '../objects/upgrades/upgrades';

export class upgradeScene extends Phaser.Scene {
  #upgradeOptions: UpgradeOption[] = [...damageItems, ...lifeItems, ...moveSpeedItems, ...luckyItems];
  #damageItems: UpgradeOption[] = damageItems;
  #lifeItems: UpgradeOption[] = lifeItems;
  #moveSpeedItems: UpgradeOption[] = moveSpeedItems;
  #luckyItems: UpgradeOption[] = luckyItems;
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
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    console.log('upgradeScene Carregada');
    this.itemsContainer();
    this.setupInput();
  }

  private findUpgradeByImageKey(items: UpgradeOption[], imageKey: string): UpgradeOption | undefined {
    return items.find((item) => item.imageKey === imageKey);
  }

  private itemsContainer() {
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
    const titleText = ['Eai, Caba. O que vai ser?'];

    const upgradeBgDamage = this.add
      .createUpgradeContainer(200, 600, 350, 580, 0x333333, this.#damageItems, 'damage')
      .setStrokeStyle(2, 0xffffff);
    const upgradeBgLife = this.add
      .createUpgradeContainer(600, 600, 350, 580, 0x333333, this.#lifeItems, 'life')
      .setStrokeStyle(2, 0xffffff);
    const upgradeBgMoveSpeed = this.add
      .createUpgradeContainer(1000, 600, 350, 580, 0x333333, this.#moveSpeedItems, 'moveSpeed')
      .setStrokeStyle(2, 0xffffff);
    const upgradeBgLucky = this.add
      .createUpgradeContainer(1400, 600, 350, 580, 0x333333, this.#luckyItems, 'lucky')
      .setStrokeStyle(2, 0xffffff);
  }

  
  private createUpgradeContainer(
    x: number,
    y: number,
    color: number,
    items: UpgradeOption[],
    type: string
  ): Phaser.GameObjects.Container {
    const upgradeBg = this.add.rectangle(0, 0, 350, 580, color).setStrokeStyle(2, 0xffffff);
    const container = this.add.container(x, y, [upgradeBg]);
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
      const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 6 };
      const image = this.add.image( 0, -100, item.imageKey).setScale(0.5)
      const nameText = this.add.text(0, 0, item.name,textStyle).setOrigin(0.5).setFontSize(32);
      const descriptionText = this.add.text(0, 50, item.description, textStyle).setOrigin(0.5).setFontSize(24);
      const sentenceText = this.add.text(0, 100, item.sentence, textStyle).setOrigin(0.5).setFontSize(24);
      container.add([image, nameText, descriptionText, sentenceText]);

      container.on('pointerdown', () => {
        if( gameOptions.playerCoinGame >= item.cost){
          item.effect();
          gameOptions.playerCoinGame -= item.cost;
          this.add.text(0, 200, 'Você comprou: ' + item.name, textStyle).setOrigin(0.5).setFontSize(32);
          console.log(`${item.name} Comprado!`);
          this.scene.start('gameScene');
        } else {
          this.add.text(0, 200, 'Ta liso!', textStyle).setOrigin(0.5).setFontSize(32);
          console.log('Ta liso!');
      }
  });
}
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
