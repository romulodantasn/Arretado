import { inputManager } from "../components/input/inputManagerComponent";

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
    this.titleText();
    this.newGameButton();
    this.storeButton();
    this.configButton();
    this.exitButton();
    this.cameras.main.setBackgroundColor('#444444');

    inputManager.setupControls(this);
    // const keys = inputManager.getKeys();
    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    const upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
   this.#selectorIcon = this.add.image(70, this.#menuItems[0].y, "triangle")
  .setScale(0.15)           
  .setRotation(Phaser.Math.DegToRad(90))
  .setOrigin(0.5);


   upKey.on("down", () => {
  this.#selectedItemIndex = (this.#selectedItemIndex - 1 + this.#menuItems.length) % this.#menuItems.length;
  this.updateSelectorPosition();
});

downKey.on("down", () => {
  this.#selectedItemIndex = (this.#selectedItemIndex + 1) % this.#menuItems.length;
  this.updateSelectorPosition();
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

  handleSelection() {
    switch (this.#selectedItemIndex) {
      case 0:
        this.scene.start("gameScene");
        break;
      case 1:
        this.scene.start("storeScene");
        break;
      case 2:
        this.scene.start("storeScene"); 
        break;
      case 3:
        this.scene.start("titleScene");
        break;
    }
  }

  public titleText() {
    this.add
      .text(860, 200, "Arretado", this.textStyle)
      .setFontSize(64)
      .setAlign("center")
      .setOrigin(0.5);
  }

  public newGameButton() {
    const button = this.createMenuButton(202, 760, "Novo Jogo");
    button.on("pointerup", () => this.scene.start("gameScene"));
  }

  public storeButton() {
    const button = this.createMenuButton(202, 820, "Loja");
    button.on("pointerup", () => this.scene.start("storeScene"));
  }

  public configButton() {
    const button = this.createMenuButton(202, 880, "Configurações", 230);
    button.on("pointerup", () => this.scene.start("configScene")); 
  }

  public exitButton() {
    const button = this.createMenuButton(202, 940, "Sair");
    button.on("pointerup", () => this.scene.start("titleScene"));
  }

  private createMenuButton(x: number, y: number, label: string, width: number = 200) {
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
