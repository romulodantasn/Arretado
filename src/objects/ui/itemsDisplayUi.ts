import Phaser from "phaser";
import { gameOptions, enemyStats, onWaveComplete, playerStats } from "../../config/gameOptionsConfig";
import {
  damageItems,
  lifeItems,
  moveSpeedItems,
  luckyItems,
  itemsContainer,
} from "../upgrades/itemsContainer";

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
  #luckyItems: itemsContainer[] = [...luckyItems];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
  }

  create() {
    console.log("itemsDisplay Carregada");
    this.scene.input.setDefaultCursor("default");

    const titleText = ["Eai, Caba. O que vai ser?"];
    const statsTitleText = ["Atributos"];
    this.scene.add
      .text(860, 200, titleText, this.textStyle)
      .setFontSize(48)
      .setAlign("center")
      .setOrigin(0.5);
    this.scene.add
      .text(1775, 350, statsTitleText, this.textStyle)
      .setFontSize(40)
      .setAlign("center")
      .setOrigin(0.5);
    this.scene.scene.stop("gameHud");
    this.scene.scene.launch("gameHud", { elementsToShow: ["coins", "wave", "act"] });

    this.playerStatsContainer(1800, 600);
    this.containerItems();
    this.buttonNextPhase();
  }

  private containerItems() {
    shuffleItems(this.#damageItems);
    shuffleItems(this.#lifeItems);
    shuffleItems(this.#moveSpeedItems);
    shuffleItems(this.#luckyItems);

    if (this.#damageItems.length > 0) {
      this.createItemContainer(200, 600, 0x333333, this.#damageItems, "damage");
    } else {
      console.warn("Não há itens de dano para exibir.");
      
    }

    if (this.#lifeItems.length > 0) {
      this.createItemContainer(600, 600, 0x333333, this.#lifeItems, "life");
    } else {
      console.warn("Não há itens de vida para exibir.");
    }

    if (this.#moveSpeedItems.length > 0) {
      this.createItemContainer(
        1000,
        600,
        0x333333,
        this.#moveSpeedItems,
        "moveSpeed"
      );
    } else {
      console.warn("Não há itens de velocidade para exibir.");
    }

    if (this.#luckyItems.length > 0) {
      this.createItemContainer(1400, 600, 0x333333, this.#luckyItems, "lucky");
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
    const itemBg = this.scene.add
      .rectangle(0, 0, 350, 580, color)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true });
    const containerItem = this.scene.add.container(x, y, [itemBg]);

    containerItem.setInteractive(
      new Phaser.Geom.Rectangle(-175, -290, 350, 580),
      Phaser.Geom.Rectangle.Contains
    );

    itemBg.on("pointerover", () => {
      itemBg.setFillStyle(0x555555);
    });
    itemBg.on("pointerout", () => {
      itemBg.setFillStyle(color);
    });

    const item = items[0];
    const image = this.scene.add
      .image(0, -200, item.imageKey)
      .setScale(0.5)
      .setDisplaySize(134, 134);
    const textStyle = {
      fontFamily: "Cordelina",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    };
    const nameText = this.scene.add
      .text(0, -80, item.name, {
        ...textStyle,
        align: "center",
        wordWrap: { width: 300 },
      })
      .setOrigin(0.5)
      .setFontSize(36);
    const typeText = this.scene.add
      .text(0, -30, item.type, {
        ...textStyle,
        align: "center",
        wordWrap: { width: 200 },
      })
      .setOrigin(0.5)
      .setFontSize(32);
    const descriptionText = this.scene.add
      .text(0, 40, item.description, {
        ...textStyle,
        align: "center",
        wordWrap: { width: 330 },
      })
      .setOrigin(0.5)
      .setFontSize(26);
    const sentenceText = this.scene.add
      .text(0, 150, item.sentence, {
        ...textStyle,
        align: "center",
        wordWrap: { width: 330 },
      })
      .setOrigin(0.5)
      .setFontSize(24);
    const costText = this.scene.add
      .text(0, 220, `Preco: ${item.cost}`, { ...textStyle, align: "center" })
      .setOrigin(0.5)
      .setFontSize(32);

    containerItem.add([
      image,
      nameText,
      typeText,
      descriptionText,
      sentenceText,
      costText,
    ]);

    itemBg.on("pointerdown", () => {
      if (playerStats.playerCoinGame >= item.cost) {
        item.effect();
        playerStats.playerCoinGame -= item.cost;
        this.scene.game.events.emit("buyUpdatedCoin", playerStats.playerCoinGame);
        
        console.log(
          `Evento de compra emitido ${playerStats.playerCoinGame} moedas`
        );
        const buyText = this.scene.add
          .text(x, y + 320, `Item ${item.name} comprado!`, {
            ...textStyle,
            color: "#008000",
          })
          .setOrigin(0.5)
          .setFontSize(28);
        console.log(`Item ${item.name} comprado`);
        itemBg.disableInteractive();
        itemBg.setFillStyle(0x1a1a1a);
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
      .rectangle(1700, 975, 400, 100, 0x333333)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true });
    const buttonText = this.scene.add
      .text(1700, 975, "Próxima Onda", this.textStyle)
      .setFontSize(48)
      .setAlign("center")
      .setOrigin(0.5);

    button.on("pointerover", () => {
      button.setFillStyle(0x555555);
    });
    button.on("pointerout", () => {
      button.setFillStyle(0x333333);
    });

    button.on("pointerdown", () => {
      buttonText.setColor("green");
      this.scene.time.delayedCall(1000, () => {
        buttonText.setColor("#ffffff");
      });
      this.scene.scene.start("gameScene");
      this.scene.scene.start("gameHud", {
        elementsToShow: ["coins", "wave", "act", "timer", "gun"],
      });
     onWaveComplete();
      console.log("enemySpeedUpdated: " + enemyStats.enemySpeed);
      console.log("enemyRateUpdated: " + enemyStats.enemyRate);
    });
  }

  private playerStatsContainer(x: number, y: number) {
    const health = playerStats.playerHealth;
    const damage = playerStats.playerDamage;
    const moveSpeed = playerStats.playerMoveSpeed;
    const lucky = playerStats.playerLucky;

    const statsBg = this.scene.add
      .rectangle(-25, 0, -250, 400)
      .setStrokeStyle(2, 0xffffff)
      .setFillStyle(0x333333);
    const container = this.scene.add.container(x, y, [statsBg]);
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
