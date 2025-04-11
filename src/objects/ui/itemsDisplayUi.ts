import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptionsConfig';
import { damageItems, lifeItems, moveSpeedItems, luckyItems, itemsContainer } from '../upgrades/itemsContainer';

export class itemsDisplayUi extends Phaser.GameObjects.Container {
  textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };

  #damageItems: itemsContainer[] = damageItems;
  #lifeItems: itemsContainer[] = lifeItems;
  #moveSpeedItems: itemsContainer[] = moveSpeedItems;
  #luckyItems: itemsContainer[] = luckyItems;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
  }

  create() {
    console.log('itemsDisplay Carregada');
    this.scene.input.setDefaultCursor('default');

    const titleText = ['Eai, Caba. O que vai ser?'];
    const statsTitleText = ['Atributos'];
    this.scene.add.text(860, 200, titleText, this.textStyle).setFontSize(48).setAlign('center').setOrigin(0.5);
    this.scene.add.text(1775, 350, statsTitleText, this.textStyle).setFontSize(40).setAlign('center').setOrigin(0.5);
    this.scene.scene.launch('gameHud', { elementsToShow: ['coins', 'wave'] });

    this.playerStatsContainer(1800, 600);
    this.containerItems();
    this.buttonNextPhase();
  }

  // função pra achar a imagem pelo imageKey
  public findUpgradeOptionByImageKey(items: itemsContainer[], imageKey: string): itemsContainer | undefined {
    return items.find((item) => item.imageKey === imageKey);
  }

  private containerItems() {
    this.createItemContainer(200, 600, 0x333333, this.#damageItems, 'damage');
    this.createItemContainer(600, 600, 0x333333, this.#lifeItems, 'life');
    this.createItemContainer(1000, 600, 0x333333, this.#moveSpeedItems, 'moveSpeed');
    this.createItemContainer(1400, 600, 0x333333, this.#luckyItems, 'lucky');
  }

  public createItemContainer(
    x: number,
    y: number,
    color: number,
    items: itemsContainer[],
    type: string
  ): Phaser.GameObjects.Container {
    const itemBg = this.scene.add
      .rectangle(0, 0, 350, 580, color)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true });
    const containerItem = this.scene.add.container(x, y, [itemBg]);

    containerItem.setInteractive(new Phaser.Geom.Rectangle(-175, -290, 350, 580), Phaser.Geom.Rectangle.Contains);

    itemBg.on('pointerover', () => {
      itemBg.setFillStyle(0x555555);
    });
    itemBg.on('pointerout', () => {
      itemBg.setFillStyle(color);
    });

    if (items.length > 0) {
      const item = items[0];
      const image = this.scene.add.image(0, -200, item.imageKey).setScale(0.5).setDisplaySize(134, 134);
      const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
      const nameText = this.scene.add
        .text(0, -80, item.name, { ...textStyle, align: 'center', wordWrap: { width: 300 } })
        .setOrigin(0.5)
        .setFontSize(36);
      const typeText = this.scene.add
        .text(0, -30, item.type, { ...textStyle, align: 'center', wordWrap: { width: 200 } })
        .setOrigin(0.5)
        .setFontSize(32);
      const descriptionText = this.scene.add
        .text(0, 40, item.description, { ...textStyle, align: 'center', wordWrap: { width: 330 } })
        .setOrigin(0.5)
        .setFontSize(26);
      const sentenceText = this.scene.add
        .text(0, 150, item.sentence, { ...textStyle, align: 'center', wordWrap: { width: 330 } })
        .setOrigin(0.5)
        .setFontSize(24);
      const costText = this.scene.add
        .text(0, 220, `Cost: ${item.cost}`, { ...textStyle, align: 'center' })
        .setOrigin(0.5)
        .setFontSize(32);

      containerItem.add([image, nameText, typeText, descriptionText, sentenceText, costText]);

      itemBg.on('pointerdown', () => {
        if (gameOptions.playerCoinGame >= item.cost) {
          item.effect();
          gameOptions.playerCoinGame -= item.cost;
          this.scene.game.events.emit('coinsUpdated', gameOptions.playerCoinGame);
          console.log(`Evento de compra emitido ${gameOptions.playerCoinGame} moedas`);
          const buyText = this.scene.add
            .text(x, y + 320, `Item ${item.name} comprado!`, { ...textStyle, color: '#008000' })
            .setOrigin(0.5)
            .setFontSize(28);
          console.log(`Item ${item.name} comprado`);

          this.scene.time.delayedCall(3500, () => buyText.destroy());
        } else {
          console.log('Not enough money to buy item');
          const noMoneyText = this.scene.add
            .text(x, y + 320, 'Ta liso, caba! Num tem moeda suficiente.', { ...textStyle, color: '#ff0000' })
            .setOrigin(0.5)
            .setFontSize(28);
          this.scene.time.delayedCall(3500, () => noMoneyText.destroy());
        }
      });
    } else {
      console.warn('Nenhum item encontrado para o tipo:', type);
    }
    return containerItem;
  }

  private buttonNextPhase() {
    const button = this.scene.add
      .rectangle(1700, 975, 400, 100, 0x333333)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true });
    const buttonText = this.scene.add
      .text(1700, 975, 'Próxima Onda', this.textStyle)
      .setFontSize(48)
      .setAlign('center')
      .setOrigin(0.5);

    button.on('pointerover', () => {
      button.setFillStyle(0x555555);
    });
    button.on('pointerout', () => {
      button.setFillStyle(0x333333);
    });

    button.on('pointerdown', () => {
      buttonText.setColor('green');
      this.scene.time.delayedCall(1000, () => {
        buttonText.setColor('#ffffff');
      });
      this.scene.scene.start('gameScene');
      this.scene.scene.start('gameHud', { elementsToShow: ['coins', 'wave', 'act', 'timer', 'gun'] });
      gameOptions.currentWave++;
      gameOptions.enemyRate -= 100;
      gameOptions.enemySpeed += 10;
      console.log('enemySpeedUpdated: ' + gameOptions.enemySpeed);
      console.log('enemyRateUpdated: ' + gameOptions.enemyRate);
    });
  }

  private playerStatsContainer(x: number, y: number) {
    const health = gameOptions.playerHealthPoints;
    const damage = gameOptions.playerDamage;
    const moveSpeed = gameOptions.playerMoveSpeed;
    const lucky = gameOptions.playerLucky;

    const statsBg = this.scene.add.rectangle(-25, 0, -250, 400).setStrokeStyle(2, 0xffffff).setFillStyle(0x333333);
    const container = this.scene.add.container(x, y, [statsBg]);
    container.setInteractive(new Phaser.Geom.Rectangle(-175, -290, 200, 400), Phaser.Geom.Rectangle.Contains);

    const healthText = this.scene.add.text(-30, -150, `Vida: ${health}`, this.textStyle).setOrigin(0.5).setFontSize(36);
    const damageText = this.scene.add.text(-30, -75, `Dano: ${damage}`, this.textStyle).setOrigin(0.5).setFontSize(36);
    const moveSpeedText = this.scene.add
      .text(-30, 0, `Velocidade: ${moveSpeed}`, this.textStyle)
      .setOrigin(0.5)
      .setFontSize(28);

    const luckyText = this.scene.add.text(-30, 75, `Sorte: ${lucky}`, this.textStyle).setOrigin(0.5).setFontSize(36);

    container.add([healthText, damageText, moveSpeedText, luckyText]);
  }

  /*private highlightSelectedUpgrade() {
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
