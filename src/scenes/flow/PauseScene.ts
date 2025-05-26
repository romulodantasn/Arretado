import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'PauseScene',
    });
  }

  create(): void {
    this.add
      .rectangle(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.7, 
      )
      .setOrigin(0.5);

    const textStyle = {
      fontFamily: 'Cordelina',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    };

    const pauseText = ['Pausado'];
    const resumeGameText = ['Pressione Esc para voltar ao jogo'];

    this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, pauseText, textStyle)
      .setFontSize(48) 
      .setAlign('center')
      .setOrigin(0.5);

    this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, resumeGameText, textStyle)
      .setFontSize(28) 
      .setAlign('center')
      .setOrigin(0.5);

    this.createReturnToMenuButton(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, textStyle);

    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    const escKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    escKey.on('down', () => {
      if (!this.scene.get('ConfirmationDialog')) {
        console.log('Jogo Retomado');
        this.scene.stop('PauseScene');
        this.input.setDefaultCursor('none'); 
        this.scene.resume('gameScene');
        if (this.scene.isPaused('gameHud')) this.scene.resume('gameHud');
      }
    });
  }

  private createReturnToMenuButton(x: number, y: number, style: any) {
    const buttonWidth = 300;
    const buttonHeight = 70;

    const buttonBg = this.add
      .rectangle(x, y, buttonWidth, buttonHeight, 0x80000) // Cor vermelha escura
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(x, y, 'Voltar ao Menu', { ...style, fontSize: '32px' })
      .setOrigin(0.5);

    buttonBg.on('pointerover', () => buttonBg.setFillStyle(0x555555));
    buttonBg.on('pointerout', () => buttonBg.setFillStyle(0x80000));
    buttonBg.on('pointerdown', () => {
      this.showConfirmationDialog(style);
    });
  }

  private showConfirmationDialog(style: any) {
    const dialogWidth = 450;
    const dialogHeight = 250;
    const dialogX = this.cameras.main.width / 2;
    const dialogY = this.cameras.main.height / 2;

    const confirmGroup = this.add.group(); 

    const dialogBg = this.add.rectangle(dialogX, dialogY, dialogWidth, dialogHeight, 0x222222, 0.95).setStrokeStyle(2, 0xffffff);
    const confirmText = this.add.text(dialogX, dialogY - 50, 'Deseja realmente voltar ao menu?\nTodo o progresso  será perdido.', { ...style, fontSize: '24px', align: 'center', wordWrap: { width: dialogWidth - 40 } }).setOrigin(0.5);

    const yesButton = this.add.rectangle(dialogX - 100, dialogY + 50, 120, 50, 0x008800).setStrokeStyle(1, 0xffffff).setInteractive({ useHandCursor: true });
    const yesText = this.add.text(dialogX - 100, dialogY + 50, 'Sim', { ...style, fontSize: '28px' }).setOrigin(0.5);

    const noButton = this.add.rectangle(dialogX + 100, dialogY + 50, 120, 50, 0x880000).setStrokeStyle(1, 0xffffff).setInteractive({ useHandCursor: true });
    const noText = this.add.text(dialogX + 100, dialogY + 50, 'Não', { ...style, fontSize: '28px' }).setOrigin(0.5);

    confirmGroup.addMultiple([dialogBg, confirmText, yesButton, yesText, noButton, noText]);
    this.scene.add('ConfirmationDialog', confirmGroup as any, true); 

    yesButton.on('pointerdown', () => {
      this.scene.stop('gameScene');
      if (this.scene.isActive('gameHud')) this.scene.stop('gameHud');
      if (this.scene.isActive('PlayerHealthBar')) this.scene.stop('PlayerHealthBar');
      this.scene.stop('PauseScene');
      confirmGroup.destroy(true);
      this.scene.remove('ConfirmationDialog');
      this.scene.start('menuScene');
    });

    noButton.on('pointerdown', () => {
      confirmGroup.destroy(true);
      this.scene.remove('ConfirmationDialog');
    });
  }
}
