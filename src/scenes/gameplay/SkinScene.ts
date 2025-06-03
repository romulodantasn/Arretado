import Phaser from "phaser";
import { gameOptions } from "../../config/GameOptionsConfig";
import { storeSkinItems } from "../../config/SkinItems";
import { SoundManager } from "../../config/SoundManager";

export class SkinScene extends Phaser.Scene {
  private currentPageIndex = 0;
  private readonly itemsPerPage = 3;
  private readonly orderedSkinZones = [
    ["Paraíba", "Pernambuco", "Bahia"],
    ["Maranhão", "Ceará", "Rio Grande Do Norte"], 
    ["Sergipe", "Piaui", "Alagoas"],             
  ];
  private effectiveSkinPages: string[][] = [];
  private apCoinText!: Phaser.GameObjects.Text;
  private skinItemGroup!: Phaser.GameObjects.Group;
  private ownedSkinIds: Set<string> = new Set(); 
  private confirmationDialogGroup?: Phaser.GameObjects.Group;

  private readonly textStyle = {
    fontFamily: "Cordelina",
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4,
  };

  constructor() {
    super({ key: "SkinScene" });
  }

  init(data: { pageIndex?: number }) {
    this.currentPageIndex = data.pageIndex || 0;
    this.setupPagination();
  }

  create() {
    this.add.nineslice(gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2, "molduraSkin2",0, 1916, 1076, 16, 16, 16, 16)
    this.cameras.main.setBackgroundColor(0xc9bda1);
    this.input.setDefaultCursor("default");

    SoundManager.init(this);

    this.skinItemGroup = this.add.group();

    this.add.text(this.cameras.main.width / 2, 70, "Skins", this.textStyle)
      .setFontSize(72)
      .setOrigin(0.5);

    this.displaySkinItems();
    this.createNavigationButtons();
    this.apCoinHud();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off("buyUpdatedCoin", this.updateApCoinHud, this);
      if (this.confirmationDialogGroup) {
        this.confirmationDialogGroup.destroy(true);
      }
    });
  }

  private setupPagination() {
    const remainingSkins = [...storeSkinItems];
    this.effectiveSkinPages = [];

    for (const zones of this.orderedSkinZones) {
      const pageSkins: string[] = [];

      zones.forEach(zone => {
        const index = remainingSkins.findIndex(s => s.skinZone === zone);
        if (index !== -1) {
          pageSkins.push(zone);
          remainingSkins.splice(index, 1);
        }
      });

      if (pageSkins.length) this.effectiveSkinPages.push(pageSkins);
    }

    while (remainingSkins.length) {
      this.effectiveSkinPages.push(
        remainingSkins.splice(0, this.itemsPerPage).map(s => s.skinZone)
      );
    }
  }

  private displaySkinItems() {
    this.skinItemGroup.clear(true, true);

    const page = this.effectiveSkinPages[this.currentPageIndex] || [];
    const items = page
  .map(zone => storeSkinItems.find(s => s.skinZone === zone))
  .filter((item): item is typeof storeSkinItems[number] => !!item);


    if (!items.length) return;

    const width = this.cameras.main.width;
    const itemWidth = 450;
    const itemHeight = 550;
    const spacing = 200;
    const offsetY = 50;

    const totalWidth = items.length * itemWidth + (items.length - 1) * spacing;
    const startX = (width - totalWidth) / 2 + itemWidth / 2;

    const contentTop = 136;
    const contentBottom = 947;
    const centerY = (contentBottom + contentTop) / 2 - offsetY;

    items.forEach((item, i) => {
      const x = startX + i * (itemWidth + spacing);
      this.createSkinItemContainer(x, centerY, item, itemWidth, itemHeight);
    });
  }

  private createSkinItemContainer(
    x: number,
    y: number,
    item: (typeof storeSkinItems)[number],
    width: number,
    height: number
  ) {
    const scale = 1.3;
    const cornerSize = 16;

    const container = this.add.container(x, y);

    this.skinItemGroup.add(container);

    const image = this.add.image(0, 0, item.imageKey)
      .setDisplaySize(338 * scale, 418 * scale)
      .setDepth(1);

    const frame = this.add.nineslice(0, 0, "molduraSkin", undefined, width, height,
      cornerSize, cornerSize, cornerSize, cornerSize)
      .setDepth(2);

    const flagSprite = this.add.sprite(150, 200, item.flagZoneKey)
    const flagDisplayScale = 0.8 * scale;
    flagSprite.setScale(flagDisplayScale).setOrigin(0.5, 0.5).setDepth(3);
     flagSprite.play(item.flagZoneKey);
    

    const nameText = this.add.text(0, 245 * scale, item.skinName, {
      ...this.textStyle,
      fontSize: `${Math.max(16, Math.floor(36 * scale))}px`,
      align: "center",
    }).setOrigin(0.5).setDepth(3);
    
    const zoneText = this.add.text(0, -235 * scale, item.skinZone, {
      ...this.textStyle,
      fontSize: `${Math.max(14, Math.floor(28 * scale))}px`,
      align: "center",
    }).setOrigin(0.5).setDepth(3);
    
    const iconSize = 30 * scale;
    const priceTextY = 300 * scale;

    const priceText = this.add.text(nameText.x, priceTextY, "", { 
      ...this.textStyle,
      fontSize: "32px",
    }).setOrigin(0.5).setDepth(3);

    const priceIcon = this.add.image(priceText.x - 60 , priceTextY, "apCoinIcon")
      .setDisplaySize(iconSize, iconSize)
      .setOrigin(0.5).setDepth(3);

    if (this.ownedSkinIds.has(item.id)) {
      priceText.setText("Adquirido").setX(0);
      priceIcon.setVisible(false);
    } else {
      priceText.setText(item.skinPrice);
      priceIcon.setVisible(true);
      frame.setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.showPurchaseConfirmation(item);
        });
    }

    container.add([image, frame, flagSprite, nameText, zoneText, priceIcon, priceText]);
  }

  private showPurchaseConfirmation(item: typeof storeSkinItems[number]) {
    if (this.confirmationDialogGroup && this.confirmationDialogGroup.active) {
      this.confirmationDialogGroup.destroy(true);
    }

    this.confirmationDialogGroup = this.add.group();

    const dialogWidth = 600;
    const dialogHeight = 350;
    const dialogX = this.cameras.main.width / 2;
    const dialogY = this.cameras.main.height / 2;

    const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7)
      .setOrigin(0,0)
      .setInteractive() 
      .setDepth(10); 

    const dialogBg = this.add.nineslice(dialogX, dialogY, "molduraSkin2", undefined, dialogWidth, dialogHeight, 16, 16, 16, 16)
      .setDepth(11);

    const titleText = this.add.text(dialogX, dialogY - 100, `Comprar ${item.skinName}?`, {
      ...this.textStyle, fontSize: "40px", align: "center",
      wordWrap: { width: dialogWidth - 40 }
    }).setOrigin(0.5).setDepth(12);

    const priceText = this.add.text(dialogX, dialogY - 30, `Preço: ${item.skinPrice}`, {
      ...this.textStyle, fontSize: "32px",
    }).setOrigin(0.5).setDepth(12);

    const priceIcon = this.add.image(dialogX - priceText.width / 2 - 30, dialogY - 30, "apCoinIcon").setScale(0.1).setDepth(12);

    const confirmButton = this.add.rectangle(dialogX - 100, dialogY + 80, 180, 60, 0xc9bda1)
      .setStrokeStyle(2, 0x000000)
      .setInteractive({ useHandCursor: true })
      .setDepth(12);
    const confirmText = this.add.text(confirmButton.x, confirmButton.y, "Confirmar", { ...this.textStyle, fontSize: "28px" }).setOrigin(0.5).setDepth(12);

    const cancelButton = this.add.rectangle(dialogX + 100, dialogY + 80, 180, 60, 0xc9bda1)
      .setStrokeStyle(2, 0x000000)
      .setInteractive({ useHandCursor: true })
      .setDepth(12);
    const cancelText = this.add.text(cancelButton.x, cancelButton.y, "Cancelar", { ...this.textStyle, fontSize: "28px" }).setOrigin(0.5).setDepth(12);

    confirmButton.on("pointerover", () => confirmButton.setFillStyle(0xe1d3b1));
    confirmButton.on("pointerout", () => confirmButton.setFillStyle(0xc9bda1));

    cancelButton.on("pointerover", () => cancelButton.setFillStyle(0xe1d3b1));
    cancelButton.on("pointerout", () => cancelButton.setFillStyle(0xc9bda1));

    this.confirmationDialogGroup.addMultiple([
      overlay, dialogBg, titleText, priceText, priceIcon, confirmButton, confirmText, cancelButton, cancelText
    ]);

    confirmButton.on("pointerdown", () => this.handlePurchase(item));
    cancelButton.on("pointerdown", () => {
      if (this.confirmationDialogGroup) this.confirmationDialogGroup.destroy(true);
    });
  }

  private handlePurchase(item: typeof storeSkinItems[number]) {
    const price = parseInt(item.skinPrice);
    if (isNaN(price)) {
      console.error("Preço da skin inválido:", item.skinPrice);
      if (this.confirmationDialogGroup) this.confirmationDialogGroup.destroy(true);
      return;
    }

    if (gameOptions.apCoin >= price) {
      gameOptions.apCoin -= price;
      this.ownedSkinIds.add(item.id);

      if (item.id === "bahia") {
        SoundManager.playBahiaBuySFX();
      } else {
        SoundManager.playBuyItemAPSFX();
      }

      this.game.events.emit("buyUpdatedCoin"); 
      if (this.confirmationDialogGroup) this.confirmationDialogGroup.destroy(true);
      this.displaySkinItems(); 
    } else {
      const insufficientFundsText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 140, "AP Coins insuficientes!", {
        ...this.textStyle, fontSize: "28px", color: "#ff0000"
      }).setOrigin(0.5).setDepth(13);
      if (this.confirmationDialogGroup) this.confirmationDialogGroup.add(insufficientFundsText);
      this.time.delayedCall(2000, () => { 
        insufficientFundsText.destroy();
      });
    }
  }

  private createNavigationButtons() {
    const { width } = gameOptions.gameSize;
    this.createStoreReturnButton(150, 987);
    this.createPreviousButton(width - 450, 987);
    this.createNextButton(width - 150, 987);
  }

  private apCoinHud() {
    this.apCoinText = this.add
      .text(1805, 100, `${gameOptions.apCoin}`, this.textStyle)
      .setFontSize(64)
      .setOrigin(0.5);
    this.add.image(1685, 100, "apCoinIcon").setDisplaySize(75, 75);

    this.game.events.on("buyUpdatedCoin", this.updateApCoinHud, this);
  }

  private updateApCoinHud() {
    this.apCoinText.setText(`${gameOptions.apCoin}`);
  }

  private createStoreReturnButton(x: number, y: number) {
    const backButton = this.add
      .rectangle(x, y, 200, 60, 0xc9bda1)
      .setStrokeStyle(2, 0x000000)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(x, y, "Loja", this.textStyle) 
      .setFontSize(38)
      .setAlign("center")
      .setOrigin(0.5);

    backButton.on("pointerover", () => backButton.setFillStyle(0xe1d3b1));
    backButton.on("pointerout", () => backButton.setFillStyle(0xc9bda1));
    backButton.on("pointerdown", () => {   
      SoundManager.playUIChangeMenuSelectSFX();
      this.scene.start("StoreScene");
    });
  }

  private createPreviousButton(x: number, y: number) {
    if (this.currentPageIndex > 0 && this.effectiveSkinPages.length > 1) {
      const prevButton = this.add
        .rectangle(x, y, 200, 60, 0xc9bda1)
        .setStrokeStyle(2, 0x000000)
        .setInteractive({ useHandCursor: true });
      this.add
        .text(x, y, "Anterior", this.textStyle)
        .setFontSize(38)
        .setAlign("center")
        .setOrigin(0.5);

      prevButton.on("pointerover", () => prevButton.setFillStyle(0xe1d3b1));
      prevButton.on("pointerout", () => prevButton.setFillStyle(0xc9bda1));
      prevButton.on("pointerdown", () => {
        if (this.confirmationDialogGroup) this.confirmationDialogGroup.destroy(true);
        this.scene.start("SkinScene", { pageIndex: this.currentPageIndex - 1 });
        SoundManager.playUIChangeMenuSelectSFX();
      });
    }
  }

  private createNextButton(x: number, y: number) {
    const totalPages = this.effectiveSkinPages.length;

    if (this.currentPageIndex < totalPages - 1 && totalPages > 1) {
      const nextButton = this.add
        .rectangle(x, y, 200, 60, 0xc9bda1)
        .setStrokeStyle(2, 0x000000)
        .setInteractive({ useHandCursor: true });
      this.add
        .text(x, y, "Seguinte", this.textStyle)
        .setFontSize(38)
        .setAlign("center")
        .setOrigin(0.5);

      nextButton.on("pointerover", () => nextButton.setFillStyle(0xe1d3b1));
      nextButton.on("pointerout", () => nextButton.setFillStyle(0xc9bda1));
      nextButton.on("pointerdown", () => {
        if (this.confirmationDialogGroup) this.confirmationDialogGroup.destroy(true);
        this.scene.start("SkinScene", { pageIndex: this.currentPageIndex + 1 });
        SoundManager.playUIChangeMenuSelectSFX();
      });
    }
  }

  shutdown() {
    if (this.confirmationDialogGroup) {
      this.confirmationDialogGroup.destroy(true);
    }
    this.skinItemGroup.clear(true, true);
    this.events.removeAllListeners();
    this.game.events.off("buyUpdatedCoin", this.updateApCoinHud, this);
  }
}
