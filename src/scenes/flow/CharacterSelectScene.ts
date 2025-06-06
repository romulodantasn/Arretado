import Phaser from "phaser";
import { gameOptions } from "../../config/GameOptionsConfig";
import { CUTSCENES } from "../../config/CutscenesContainer";

interface CharacterInfo {
  id: string;
  name: string;
  imageKey: string;
}

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: "CharacterSelectScene" });
  }

  textStyle = {
    fontFamily: "Cordelina",
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 1,
  };

  create() {
    this.add.nineslice(gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2, "molduraMenu",0, 1916, 1076, 16, 16, 16, 16)   
    this.cameras.main.setBackgroundColor("#c9bda1");
    this.input.setDefaultCursor("default");

    this.add
      .text(this.cameras.main.width / 2, 100, "Escolha quem vai para a labuta", this.textStyle)
      .setFontSize(72)
      .setAlign("center")
      .setOrigin(0.5);

    this.displayCharacterOptions();
    
    this.createBackButton(200, 987);
  }

  private displayCharacterOptions() {
    const characters: CharacterInfo[] = [
      { id: "char1", name: "Lampião", imageKey: "lampiao" }, 
      { id: "char2", name: "Maria Bonita", imageKey: "mariaBonita" },
    ];

    const containerWidth = 550;
    const containerHeight = 600;
    const spacing = 250;
    const totalWidth = (characters.length * containerWidth) + ((characters.length - 1) * spacing);
    const startX = (this.cameras.main.width - totalWidth) / 2;
    const yPos = this.cameras.main.height / 2;

    characters.forEach((character, index) => {
      const x = startX + (index * (containerWidth + spacing)) + (containerWidth / 2);
      this.createCharacterContainer(x, yPos, 0x333333, character, containerWidth, containerHeight);
    });
  }

  private transitionToScene(targetScene: string, data?: any) {
    this.scene.manager.scenes.forEach(scene => {
      if (scene.scene.key !== this.scene.key && scene.scene.isActive()) {
        this.scene.stop(scene.scene.key);
      }
    });
    this.scene.stop();
    this.scene.start(targetScene, data);
  }

  private createCharacterContainer(x: number, y: number, color: number, character: CharacterInfo, width: number, height: number) {
    const bgColor = character.id === "char1" ? 0xc9bda1 : 0xb5ab91; 
    const itemBg = this.add
      .rectangle(0, 0, width, height, bgColor)
      .setInteractive({ useHandCursor: true });

    const texture = this.textures.get(character.imageKey);
    const sourceImage = texture.getSourceImage();
    const originalWidth = sourceImage.width;
    const originalHeight = sourceImage.height;
    
    const maxImageHeight = height * 0.6; 
    const maxImageWidth = width * 0.8; 

    const scaleFactor = Math.min(maxImageWidth / originalWidth, maxImageHeight / originalHeight);
    const image = this.add
      .image(0, -height / 10, character.imageKey) 
      .setScale(scaleFactor) 
      .setOrigin(0.5);

    const characterFrame = this.add.nineslice(0, 0, 'molduraPersonagem', 0, width, height, 16, 16, 16, 16);
    const nameText = this.add
      .text(0, height / 3, character.name, { 
        ...this.textStyle,
        align: "center",
        fontSize: "40px",
      })
      .setOrigin(0.5);

    const container = this.add.container(x, y, [itemBg, characterFrame, image, nameText]);

    if (character.id === "char1") {
      itemBg.setInteractive({ useHandCursor: true });
      itemBg.on("pointerover", () => itemBg.setFillStyle(0xe1d3b1));
      itemBg.on("pointerout", () => itemBg.setFillStyle(bgColor)); 
      itemBg.on("pointerdown", () => {
        console.log(`Personagem selecionado: ${character.name} (ID: ${character.id})`);
        this.transitionToScene("CutscenesScene", { 
          ...CUTSCENES.cutscene2,
          selectedCharacterId: character.id,
        });
      });
    } else {
      itemBg.disableInteractive();
      const lockedText = this.add
        .text(0, 0, "Em Breve", {
          ...this.textStyle,
          align: "center",
          fontSize: "50px",
          color: "#000000", 
        })
        .setOrigin(0.5);
      container.add(lockedText);
    }
  }

  private createBackButton(x: number, y: number) {
    const backButton = this.add
      .rectangle(x, y, 300, 80, 0xc9bda1)
      .setStrokeStyle(2, 0x000000)
      .setInteractive({ useHandCursor: true });
    const buttonText = this.add
      .text(x, y, "Voltar", this.textStyle)
      .setFontSize(38)
      .setAlign("center")
      .setOrigin(0.5);

    backButton.on("pointerover", () => backButton.setFillStyle(0xe1d3b1));
    backButton.on("pointerout", () => backButton.setFillStyle(0xc9bda1));
    backButton.on("pointerdown", () => { 
      this.transitionToScene("menuScene");
    });
  }
}