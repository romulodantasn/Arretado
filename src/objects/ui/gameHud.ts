import Phaser from 'phaser';
export class gameHud extends Phaser.Scene {
  waveCount: number;
  waveText: Phaser.GameObjects.Text;
  actCount: number;
  actText: Phaser.GameObjects.Text;
  coinGame: number;
  coinText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'gameHud',
    });
  }

  create() {
    this.phaseCount();
    this.coinCount();
    this.advanceWaveCount();
    const gameScene = this.scene.get('gameScene');
    gameScene.events.on('nextPhase', this.advanceWaveCount, this);
  }

  public phaseCount() {
    this.waveCount = 1;
    this.actCount = 1;
    this.actText = this.add
      .text(1744, 8, `Ato:${this.actCount}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
  }

  public advanceWaveCount() {
    this.waveCount += 1;
    this.waveText = this.add
      .text(1740, 48, `Onda:${this.waveCount}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
  }

  public coinCount() {
    this.coinGame = 10;
    this.waveText = this.add
      .text(1820, 110, `${this.coinGame}`, {
        fontSize: '36px',
        color: '#fff',
      })
      .setDepth(10);
  }
}
