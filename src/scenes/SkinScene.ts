import Phaser from "phaser";
import { gameOptions } from "../config/gameOptionsConfig";
import { storeSkinItems } from "../config/skinItems"; 

export class SkinScene extends Phaser.Scene {
    private apCoinText: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "SkinScene" });
    }

    textStyle = {
        fontFamily: "Cordelina",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
    };

    create() {
        this.cameras.main.setBackgroundColor("#444444");
        this.input.setDefaultCursor("default");

        this.add
            .text(this.cameras.main.width / 2, 100, "Skins", this.textStyle)
            .setFontSize(72)
            .setAlign("center")
            .setOrigin(0.5);

        this.displaySkinItems();
        this.createBackButton(200, 987);
        this.apCoinHud();

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.game.events.off("buyUpdatedCoin", this.updateApCoinHud, this);
        });
    }

    private displaySkinItems() {
        const itemsToDisplay = storeSkinItems; 
        const itemsPerRow = 3; 
        const numRows = Math.ceil(itemsToDisplay.length / itemsPerRow);

        // Define as dimensões visuais desejadas para cada item para que caibam na tela
        // Proporção original do itemBg era ~350x500. Nova altura 240px.
        const targetItemVisualHeight = 240;
        const targetItemVisualWidth = Math.floor(targetItemVisualHeight * (350 / 500)); // ~168px

        const verticalSpacingBetweenItems = 25;
        const horizontalSpacingBetweenItems = 35;

        // Calcula a altura total do bloco de itens
        const totalBlockHeight = numRows * targetItemVisualHeight + (numRows > 1 ? (numRows - 1) * verticalSpacingBetweenItems : 0);
        // Calcula a largura total do bloco de itens
        const totalBlockWidth = itemsPerRow * targetItemVisualWidth + (itemsPerRow > 1 ? (itemsPerRow - 1) * horizontalSpacingBetweenItems : 0);

        // Define a área vertical usável (abaixo do título, acima do botão de voltar)
        const usableTopY = 100 + 72 / 2 + 30; // Y do título + meia altura + margem
        const usableBottomY = 987 - 80 / 2 - 30; // Y do botão voltar - meia altura - margem
        const usableScreenHeight = usableBottomY - usableTopY;

        // Calcula startY para o centro do primeiro item da primeira linha, centralizando o bloco verticalmente
        const startY = usableTopY + (usableScreenHeight - totalBlockHeight) / 2 + targetItemVisualHeight / 2;

        // Calcula startX para o centro do primeiro item da primeira linha, centralizando o bloco horizontalmente
        const startX = (this.cameras.main.width - totalBlockWidth) / 2 + targetItemVisualWidth / 2;

        itemsToDisplay.forEach((item, index) => {
            const rowIndex = Math.floor(index / itemsPerRow);
            const colIndex = index % itemsPerRow;

            const xPos = startX + colIndex * (targetItemVisualWidth + horizontalSpacingBetweenItems);
            const yPos = startY + rowIndex * (targetItemVisualHeight + verticalSpacingBetweenItems);

            this.createSkinItemContainer(xPos, yPos, 0x333333, item, targetItemVisualWidth, targetItemVisualHeight);
        });
    }

    private createSkinItemContainer(x: number, y: number, color: number, item: (typeof storeSkinItems)[number], itemRenderWidth: number, itemRenderHeight: number) {
        // Fator de escala baseado na redução da altura original (500) para a nova (itemRenderHeight)
        const scaleFactor = itemRenderHeight / 500;

        const itemBg = this.add
            .rectangle(0, 0, itemRenderWidth, itemRenderHeight, color)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });

        const container = this.add.container(x, y, [itemBg]);

        const image = this.add
            .image(0, -75, item.imageKey) // Ajusta a posição da imagem
            .setDisplaySize(200 * scaleFactor, 200 * scaleFactor) 
            .setPosition(0, -75 * scaleFactor);

        const skinNameText = this.add
            .text(0, 75, item.skinName, { // Nome da skin
                ...this.textStyle,
                align: "center",
                fontSize: `${Math.max(16, Math.floor(36 * scaleFactor))}px`,
            })
            .setOrigin(0.5)
            .setPosition(0, 75 * scaleFactor);

        const skinZoneText = this.add
            .text(0, 125, item.skinZone, { // Zona/Região da skin
                ...this.textStyle,
                align: "center",
                fontSize: `${Math.max(14, Math.floor(28 * scaleFactor))}px`,
            })
            .setOrigin(0.5)
            .setPosition(0, 125 * scaleFactor);

        const costText = this.add
            .text(0, 200, `${item.skinPrice}`, { // Preço da skin
                ...this.textStyle,
                align: "center",
                fontSize: `${Math.max(18, Math.floor(48 * scaleFactor))}px`,
            })
            .setOrigin(0.5)
            .setPosition(0, 185 * scaleFactor); // Ajustado um pouco para cima devido ao tamanho

        container.add([image, skinNameText, skinZoneText, costText]);

        itemBg.on("pointerover", () => itemBg.setFillStyle(0x555555));
        itemBg.on("pointerout", () => itemBg.setFillStyle(color));

        itemBg.on("pointerdown", () => {
            const skinPrice = parseInt(item.skinPrice, 10);
            if (gameOptions.apCoin < skinPrice) return;

            const confirmBg = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 450, 200, 0x000000, 0.85).setOrigin(0.5).setDepth(1);
            const confirmText = this.add
                .text(this.cameras.main.centerX, this.cameras.main.centerY - 40, `Comprar ${item.skinName}?`, {
                    ...this.textStyle,
                    fontSize: "28px",
                    color: "#ffffff",
                })
                .setOrigin(0.5).setDepth(1);

            const yesButton = this.add
                .text(this.cameras.main.centerX - 100, this.cameras.main.centerY + 40, "Sim", {
                    ...this.textStyle,
                    fontSize: "30px",
                    backgroundColor: "#00aa00",
                    padding: { x: 20, y: 10 },
                })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true }).setDepth(1)
                .on("pointerdown", () => {
                    gameOptions.apCoin -= skinPrice;
                    console.log(`Skin ${item.skinName} comprada! AP restantes: ${gameOptions.apCoin}`);
                    this.game.events.emit("buyUpdatedCoin", gameOptions.apCoin);

                    const confirmation = this.add
                        .text(0, itemRenderHeight / 2 + 20 * scaleFactor, `Comprado!`, { // Posição da mensagem de comprado abaixo do item
                            ...this.textStyle,
                            color: "#00ff00",
                            fontSize: `${Math.max(14, Math.floor(26 * scaleFactor))}px`,
                        })
                        .setOrigin(0.5);
                    container.add(confirmation); // Adiciona ao container para posicionamento relativo
                    this.time.delayedCall(1500, () => confirmation.destroy());
                    destroyConfirmation();
                });

            const noButton = this.add
                .text(this.cameras.main.centerX + 100, this.cameras.main.centerY + 40, "Não", {
                    ...this.textStyle,
                    fontSize: "30px",
                    backgroundColor: "#aa0000",
                    padding: { x: 20, y: 10 },
                })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true }).setDepth(1)
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
    }

    private createBackButton(x: number, y: number) {
        const backButton = this.add
            .rectangle(x, y, 300, 80, 0x333333)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        this.add
            .text(x, y, "Voltar", this.textStyle)
            .setFontSize(38)
            .setAlign("center")
            .setOrigin(0.5);

        backButton.on("pointerover", () => backButton.setFillStyle(0x555555));
        backButton.on("pointerout", () => backButton.setFillStyle(0x333333));
        backButton.on("pointerdown", () => this.scene.start("StoreScene")); // Volta para a StoreScene ou MenuScene
    }
}