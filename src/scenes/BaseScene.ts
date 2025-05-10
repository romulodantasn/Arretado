class BaseScene extends Phaser.Scene {
  titleFont = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 6 };

  create() {
    this.add.text(0, 0, 'Base Scene', this.titleFont).setFontSize(64).setAlign('center').setOrigin(0.5);
  }
}

export default BaseScene;
