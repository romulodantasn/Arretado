import Phaser from "phaser";
import { onWaveComplete } from "../../config/waves/waveManager";
import { currentEnemyStats } from "../../config/enemies/EnemiesContainer";
import { playerStats } from "../../config/player/PlayerConfig";
import { WaveManager } from "../../config/waves/waveManager";
import { WaveNumbers, Waves } from "../../config/waves/wavesContainer";
import { gameOptions } from "../../config/GameOptionsConfig";

import {
  damageItems,
  lifeItems,
  moveSpeedItems,
  firerateItems,
  itemsContainer,
} from "../../objects/upgrades/ItemsContainer";

function shuffleItems(items: itemsContainer[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export class itemsDisplayUi extends Phaser.GameObjects.Container {
  textStyle = {
    fontFamily: "Cordelina",
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4,
  };

  #damageItems: itemsContainer[] = [...damageItems];
  #lifeItems: itemsContainer[] = [...lifeItems];
  #moveSpeedItems: itemsContainer[] = [...moveSpeedItems];
  #firerateItems: itemsContainer[] = [...firerateItems];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
  }

  create() {
    this.scene.input.setDefaultCursor("default");

    const sceneWidth = this.scene.cameras.main.width;
    const sceneHeight = this.scene.cameras.main.height;
    
    this.scene.add.rectangle(
      sceneWidth / 2,
      sceneHeight / 2,
      sceneWidth,
      sceneHeight,
      0xe9dabb
    );

    const frameMargin = 32;
  

    const titleText = ["Eai, Caba. O que vai ser?"];
    const statsTitleText = ["Atributos"];
    this.scene.add
      .text(860, 200, titleText, this.textStyle)
      .setFontSize(48)
      .setAlign("center")
      .setOrigin(0.5);
    this.scene.add
      .text(1775, 220, statsTitleText, this.textStyle)
      .setFontSize(40)
      .setAlign("center")
      .setOrigin(0.5);

    this.playerStatsContainer(1800, 600);
    this.containerItems();
    this.buttonNextPhase();
  }

  private containerItems() {
    shuffleItems(this.#damageItems);
    shuffleItems(this.#lifeItems);
    shuffleItems(this.#moveSpeedItems);
    shuffleItems(this.#firerateItems);

    if (this.#damageItems.length > 0) {
      this.createItemContainer(200, 600, 0xe9dabb, this.#damageItems, "damage");
    } else {
      console.warn("Não há itens de dano para exibir.");
      
    }

    if (this.#lifeItems.length > 0) {
      this.createItemContainer(600, 600, 0xe9dabb, this.#lifeItems, "life");
    } else {
      console.warn("Não há itens de vida para exibir.");
    }

    if (this.#moveSpeedItems.length > 0) {
      this.createItemContainer(
        1000,
        600,
        0xc9bda1,
        this.#moveSpeedItems,
        "moveSpeed"
      );
    } else {
      console.warn("Não há itens de velocidade para exibir.");
    }

    if (this.#firerateItems.length > 0) {
      this.createItemContainer(1400, 600, 0xe9dabb, this.#firerateItems, "lucky");
    } else {
      console.warn("Não há itens de sorte para exibir.");
    }
  }

  public createItemContainer(
    x: number,
    y: number,
    color: number,
    items: itemsContainer[],
    type: string
  ): Phaser.GameObjects.Container | undefined {
    const containerWidth = 350;
    const containerHeight = 580;
    const imageDisplayWidth = 134;
    const imageDisplayHeight = 134;
    const imageFramePadding = 10;

    const itemBg = this.scene.add
      .rectangle(0, 0, containerWidth, containerHeight, 0xe9dabb)
      .setInteractive({ useHandCursor: true });

    const containerFrame = this.scene.add.nineslice(
      0, 0,
      "molduraMenu",
      0,
      containerWidth,
      containerHeight,
      16, 16, 16, 16
    );

    const containerItem = this.scene.add.container(x, y, [itemBg, containerFrame]);

    containerItem.setInteractive(
      new Phaser.Geom.Rectangle(-containerWidth / 2, -containerHeight / 2, containerWidth, containerHeight),
      Phaser.Geom.Rectangle.Contains
    );

    itemBg.on("pointerover", () => {
      itemBg.setFillStyle(0xc6bb93);
    });
    itemBg.on("pointerout", () => {
      itemBg.setFillStyle(0xb6ab93);
    });

    const item = items[0];
    const imageX = 0;
    const imageY = -200;

    const image = this.scene.add
      .image(imageX, imageY, item.imageKey)
      .setDisplaySize(imageDisplayWidth, imageDisplayHeight);
    const textStyle = {
      fontFamily: "Cordelina",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
      align: "center",
      wordWrap: { width: 300 },
    };
    const nameText = this.scene.add
      .text(0, -90, item.name, textStyle)
      .setOrigin(0.5)
      .setFontSize(36);
    const typeText = this.scene.add
      .text(0, -30, item.type, textStyle)
      .setOrigin(0.5)
      .setFontSize(26);
    const effectText = this.scene.add
      .text(0, 50, item.description, textStyle)
      .setOrigin(0.5)
      .setFontSize(28);
    const sentenceText = this.scene.add
      .text(0, 150, item.sentence, textStyle)
      .setOrigin(0.5)
      .setFontSize(24);
    const costText = this.scene.add
      .text(0, 230, `Preço: ${item.cost}`, textStyle)
      .setOrigin(0.5)
      .setFontSize(36);

    containerItem.add([
      image,
      nameText,
      typeText,
      effectText,
      sentenceText,
      costText,
    ]);

    itemBg.on("pointerdown", () => {
      if (playerStats.CoinGame >= item.cost) {
        item.effect();
        playerStats.CoinGame -= item.cost;
        this.scene.game.events.emit("buyUpdatedCoin", playerStats.CoinGame);
        
        console.log(
          `Evento de compra emitido ${playerStats.CoinGame} moedas`
        );
        const buyText = this.scene.add
          .text(x, y + 320, `Item ${item.name} comprado!`, {
            ...textStyle,
            color: "#00ff00",
          })
          .setOrigin(0.5)
          .setFontSize(28);
        console.log(`Item ${item.name} comprado`);
        itemBg.disableInteractive();
        itemBg.setFillStyle(0xafa393);
        this.scene.time.delayedCall(2500, () => buyText.destroy());
      } else {
        console.log("Moeda insuficiente");
        const noMoneyText = this.scene.add
          .text(x, y + 320, "Ta liso, caba! Num tem moeda suficiente.", {
            ...textStyle,
            color: "#ff0000",
          })
          .setOrigin(0.5)
          .setFontSize(28);
        this.scene.time.delayedCall(2500, () => noMoneyText.destroy());
      }
    });
    return containerItem;
  }

  private buttonNextPhase() {
    const button = this.scene.add
      .rectangle(1700, 975, 400, 100, 0xe9dabb)
      .setStrokeStyle(2, 0x000000)
      .setInteractive({ useHandCursor: true });
    const buttonText = this.scene.add
      .text(1700, 975, "Próxima Onda", this.textStyle)
      .setFontSize(48)
      .setAlign("center")
      .setOrigin(0.5);

    button.on("pointerover", () => {
      button.setFillStyle(0xe9dabb);
    });
    button.on("pointerout", () => {
      button.setFillStyle(0xe9dabb);
    });

    button.on("pointerdown", () => {
      buttonText.setColor("#ffffff");
      this.scene.time.delayedCall(1000, () => {
        buttonText.setColor("#ffffff");
      });
      
      if (this.scene.scene.isActive('gameHud')) {
        this.scene.scene.stop('gameHud');
      }
      
      this.scene.scene.start("gameScene", {waveKey: `Wave_${WaveManager.getCurrentWave() + 1}` as WaveNumbers});
      this.scene.scene.start("gameHud", {
        elementsToShow: ["coins", "wave", "act", "timer", "gun"],
      });
      onWaveComplete();
    });
  }

  private playerStatsContainer(x: number, y: number) {
    const health = playerStats.Health;
    const damage = playerStats.Damage;
    const moveSpeed = playerStats.MoveSpeed;
    const lucky = playerStats.Lucky;
    
    const statsBg = this.scene.add
      .rectangle(-25, 0, -250, 400)
      .setStrokeStyle(2, 0x000000)
      .setFillStyle(0xe9dabb);

    const statsFrame = this.scene.add.nineslice(
      -25, 0,
      "molduraMenu",
      0,
      250,
      400,
      16, 16, 16, 16
    );

    const playerImg = this.scene.add
      .rectangle(-55, 0, 50, 40)
      .setStrokeStyle(2, 0x000000)
      .setFillStyle(0xe9dabb);

    const playerFrame = this.scene.add.nineslice(
      -55, 0,
      "molduraMenu",
      0,
      50,
      40,
      16, 16, 16, 16
    );

    const playerImgContainer = this.scene.add.container(x, y, [playerImg, playerFrame])
    playerImgContainer.add(this.scene.add
      .image(-25, -280, 'lampiao')
      .setScale(0.5)
      .setDisplaySize(134, 134))
    const container = this.scene.add.container(x, y, [statsBg, statsFrame]);

    container.setInteractive(
      new Phaser.Geom.Rectangle(-175, -290, 200, 400),
      Phaser.Geom.Rectangle.Contains
    );

    const healthText = this.scene.add
      .text(-30, -150, `Vida: ${health}`, this.textStyle)
      .setOrigin(0.5)
      .setFontSize(36);
    const damageText = this.scene.add
      .text(-30, -75, `Dano: ${damage}`, this.textStyle)
      .setOrigin(0.5)
      .setFontSize(36);
    const moveSpeedText = this.scene.add
      .text(-30, 0, `Velocidade: ${moveSpeed}`, this.textStyle)
      .setOrigin(0.5)
      .setFontSize(28);
    const luckyText = this.scene.add
      .text(-30, 75, `Sorte: ${lucky}`, this.textStyle)
      .setOrigin(0.5)
      .setFontSize(36);

    container.add([healthText, damageText, moveSpeedText, luckyText]);
  }
}
