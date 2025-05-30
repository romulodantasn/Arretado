import { inputManager } from "../../components/input/InputManager";
import { gameOptions } from "../../config/GameOptionsConfig";
import { SoundManager } from "../../config/SoundManager";

export class menuScene extends Phaser.Scene {
  #menuItems: Phaser.GameObjects.Rectangle[] = [];
  #selectedItemIndex: number = 0;
  #selectorIcon!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "menuScene" });
  }

  textStyle = {
    fontFamily: "Cordelina",
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4,
  };

  create() {
    this.add.nineslice(
      gameOptions.gameSize.width / 2,
      gameOptions.gameSize.height / 2,
      "molduraMenu",
      0,
      1916,
      1076,
      16,
      16,
      16,
      16
    );
    this.titleText();
    this.newGameButton();
    this.storeButton();
    this.configButton();
    this.exitButton();
    this.cameras.main.setBackgroundColor("#222222");
    
    SoundManager.init(this);
    SoundManager.playMenuBackgroundSFX();

    inputManager.setupControls(this);
    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    const upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.#selectorIcon = this.add
      .image(70, this.#menuItems[0].y, "triangle")
      .setScale(0.15)
      .setRotation(Phaser.Math.DegToRad(90))
      .setOrigin(0.5);

    upKey.on("down", () => {
      this.#selectedItemIndex =
        (this.#selectedItemIndex - 1 + this.#menuItems.length) %
        this.#menuItems.length;
      this.updateSelectorPosition();
      SoundManager.playUIChangeMenuSelectSFX();
    });

    downKey.on("down", () => {
      this.#selectedItemIndex =
        (this.#selectedItemIndex + 1) % this.#menuItems.length;
      this.updateSelectorPosition();
      SoundManager.playUIChangeMenuSelectSFX();
    });

    enterKey.on("down", () => {
      this.handleSelection();
    });

    this.updateSelectorPosition();
  }

  updateSelectorPosition() {
    const selected = this.#menuItems[this.#selectedItemIndex];
    this.#selectorIcon.setY(selected.y);
  }

  private transitionToScene(targetScene: string, data?: any) {
    // Para a música do menu
    SoundManager.menuBackgroundSFX?.stop();

    // Para todas as cenas ativas exceto a atual
    this.scene.manager.scenes.forEach(scene => {
      if (scene.scene.key !== this.scene.key && scene.scene.isActive()) {
        this.scene.stop(scene.scene.key);
      }
    });

    // Para a cena atual e inicia a nova
    this.scene.stop();
    this.scene.start(targetScene, data);
  }

  handleSelection() {
    SoundManager.playUIChangeMenuSelectSFX();

    switch (this.#selectedItemIndex) {
      case 0:
        this.transitionToScene("CharacterSelectScene");
        break;
      case 1:
        this.transitionToScene("StoreScene");
        break;
      case 2:
        this.transitionToScene("CreditsScene");
        break;
      case 3:
        this.transitionToScene("titleScene");
        break;
    }
  }

  public titleText() {
    this.add
      .text(gameOptions.gameSize.width / 2, 200, "Arretado", this.textStyle)
      .setFontSize(86)
      .setAlign("center")
      .setOrigin(0.5);
  }

  public newGameButton() {
    const button = this.createMenuButton(202, 760, "Novo Jogo");
    button.on("pointerup", () => {
      this.transitionToScene("CharacterSelectScene");
    });
  }

  public storeButton() {
    const button = this.createMenuButton(155, 820, "Loja");
    button.on("pointerup", () => {
      this.transitionToScene("StoreScene");
    });
  }

  public configButton() {
    const button = this.createMenuButton(240, 880, "Configurações", 230);
    button.on("pointerup", () => {
      this.transitionToScene("configScene");
    });
  }

  public exitButton() {
    const button = this.createMenuButton(155, 940, "Sair");
    button.on("pointerup", () => {
      this.transitionToScene("titleScene");
    });
  }

  private createMenuButton(
    x: number,
    y: number,
    label: string,
    width: number = 200
  ) {
    const button = this.add
      .rectangle(x, y, width, 50)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(x, y, label, this.textStyle)
      .setFontSize(40)
      .setAlign("center")
      .setOrigin(0.5);
    this.#menuItems.push(button);
    return button;
  }
}
