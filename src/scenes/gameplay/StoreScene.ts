import Phaser from "phaser";
import { playerStats } from "../../config/player/PlayerConfig";
import { storeSpecificItems } from "../../config/StoreItems";
import { gameOptions } from "../../config/GameOptionsConfig";

export class StoreScene extends Phaser.Scene {
   private apCoinText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "StoreScene" });
  }

  textStyle = {
    fontFamily: "Cordelina",
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4,
  };

  create() {
    this.add.nineslice(gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2, "molduraLojaAp",0, 1916, 1076, 16, 16, 16, 16)
    this.cameras.main.setBackgroundColor("#222222");
    this.input.setDefaultCursor("default");

    this.add
      .text(this.cameras.main.width / 2, 100, "Arretado Points", this.textStyle)
      .setFontSize(72)
      .setAlign("center")
      .setOrigin(0.5);

    this.displayStoreItems();
    this.createBackButton(200, 987);
    this.apCoinHud();
    this.skinsButton(1650, 987);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off("buyUpdatedCoin", this.updateApCoinHud, this);
    });
    
  }

  private displayStoreItems() {
    const itemsToDisplay = storeSpecificItems;
    const startX = gameOptions.gameSize.width / 2 - ((itemsToDisplay.length - 1) * 380) / 2;
    const yPos = 500;

    itemsToDisplay.forEach((item, index) => {
      this.createStoreItemContainer(startX + index * 380, yPos, item);
    });
  }

  private createStoreItemContainer(x: number, y: number, item: (typeof storeSpecificItems)[number]) {
    const itemBg = this.add
      .nineslice(0, 0, 'molduraLojaAp',0, 350, 500, 4 ,4, 4, 4)
      .setInteractive({ useHandCursor: true });

    const container = this.add.container(x, y, [itemBg]);

    const image = this.add
      .image(0, 25, item.imageKey)
      .setDisplaySize(250, 250);

    const itemValueText = this.add
      .text(0, -200, item.itemValue, {
        ...this.textStyle,
        align: "center",
        fontSize: "36px",
      })
      .setOrigin(0.5);

    const costText = this.add
      .text(0, 290, `${item.cost}`, {
        ...this.textStyle,
        align: "center",
        fontSize: "48px",
      })
      .setOrigin(0.5);

    container.add([image, itemValueText, costText]);

    itemBg.on("pointerover", () => itemBg.setTint(0x555555));
    itemBg.on("pointerout", () => itemBg.setTint());

    itemBg.on("pointerdown", () => {

      const confirmBg = this.add.rectangle(x, y, 350, 300, 0x000000, 0.85).setOrigin(0.5);
      const confirmText = this.add
        .text(x, y - 60, "Deseja comprar este item?", {
          ...this.textStyle,
          fontSize: "28px",
          color: "#ffffff",
        })
        .setOrigin(0.5);
    
      const yesButton = this.add
        .text(x - 80, y + 40, "Sim", {
          ...this.textStyle,
          fontSize: "30px",
          backgroundColor: "#00aa00",
          padding: { x: 20, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          item.effect();
          this.game.events.emit("buyUpdatedCoin", gameOptions.apCoin);
          
          const confirmation = this.add
            .text(x, y + 260, `Comprado!`, {
              ...this.textStyle,
              color: "#00ff00",
              fontSize: "26px",
            })
            .setOrigin(0.5);
          this.time.delayedCall(2000, () => confirmation.destroy());
    
          destroyConfirmation();
        });
    
      const noButton = this.add
        .text(x + 80, y + 40, "Não", {
          ...this.textStyle,
          fontSize: "30px",
          backgroundColor: "#aa0000",
          padding: { x: 20, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          destroyConfirmation();
        });
    
      function destroyConfirmation() {
        confirmBg.destroy();
        confirmText.destroy();
        yesButton.destroy();
        noButton.destroy();
      }
    });
    
  }

  private apCoinHud() {
    this.apCoinText = this.add
      .text(1805, 100, `${gameOptions.apCoin}`, this.textStyle)
      .setFontSize(64)
      .setOrigin(0.5);
    this.add.image(1685, 100, 'apCoinIcon').setDisplaySize(75, 75);

    this.game.events.on("buyUpdatedCoin", this.updateApCoinHud, this);
  }

  private updateApCoinHud() {
    this.apCoinText.setText(`${gameOptions.apCoin}`);
    console.log(`Arretado Points: ${gameOptions.apCoin}`)
    }
    

  private createBackButton(x: number, y: number) {
    const backButton = this.add
      .rectangle(x, y, 300, 80, 0x333333)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true });
    const buttonText = this.add
      .text(x, y, "Voltar", this.textStyle)
      .setFontSize(38)
      .setAlign("center")
      .setOrigin(0.5);

      backButton.on("pointerover", () => backButton.setFillStyle(0x555555));
      backButton.on("pointerout", () => backButton.setFillStyle(0x333333));
      backButton.on("pointerdown", () => this.scene.start("menuScene"));
  }

  private skinsButton(x: number, y: number) {
    const skinsButton = this.add
      .rectangle(x, y, 300, 80, 0x333333)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true });
    const buttonSkinText = this.add
      .text(x, y, "SKINS", this.textStyle)
      .setFontSize(38)
      .setAlign("center")
      .setOrigin(0.5);

      skinsButton.on("pointerover", () => skinsButton.setFillStyle(0x555555));
      skinsButton.on("pointerout", () => skinsButton.setFillStyle(0x333333));
      skinsButton.on("pointerdown", () => this.scene.start("SkinScene"));
  }
}
