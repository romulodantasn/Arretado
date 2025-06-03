import Phaser from 'phaser';
import { globalEventEmitter } from '../../components/events/globalEventEmitter';
import { playerEvents } from '../../components/events/playerEvent';

export class PlayerBoostCooldownUI extends Phaser.Scene {
  private cooldownText!: Phaser.GameObjects.Text;
  private cooldownEndTime: number = 0;

  private readonly textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Cordelina',
    fontSize: '48px',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 3,
  };

  constructor() {
    super({ key: 'PlayerBoostCooldownUI' });
  }

  create() {
    const padding = 10;
    this.cooldownText = this.add.text(
      padding,
      this.cameras.main.height - padding,
      '',
      this.textStyle
    )
    .setOrigin(0, 1)
    .setScrollFactor(0)
    .setDepth(100) 
    .setVisible(false); 
    globalEventEmitter.on(playerEvents.boostActivated, this.handleBoostActivated, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      globalEventEmitter.off(playerEvents.boostActivated, this.handleBoostActivated, this);
    });
  }

 

  update() {
    if (this.cooldownEndTime > 0 && this.cameras.main.worldView.width > 0) { 
      const currentTime = this.time.now;
      if (currentTime < this.cooldownEndTime) {
        const remainingTimeMs = this.cooldownEndTime - currentTime;
        const remainingTimeSec = Math.max(0, remainingTimeMs / 1000);
        this.cooldownText.setText(`Tempo da Carrera: ${remainingTimeSec.toFixed(1)}s`);
        if (!this.cooldownText.visible) this.cooldownText.setVisible(true);
      } else {
        if (this.cooldownText.visible) this.cooldownText.setVisible(false);
        this.cooldownEndTime = 0;
      }
    }
  }

   private handleBoostActivated(endTime: number) {
    this.cooldownEndTime = endTime;
    this.cooldownText.setVisible(true);
  }
}