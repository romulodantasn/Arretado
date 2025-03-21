import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptionsConfig';
import { timer } from '../../components/timer/timerComponent';

export class gameHud extends Phaser.Scene {
  private timerInstance: timer;
  public waveNumber: number = 1;
  private waveText: Phaser.GameObjects.Text;
  public actNumber: number = 1;
  private actText: Phaser.GameObjects.Text;
  private coinGame: number;
  private coinText: Phaser.GameObjects.Text;
  public shouldIncrementWave: boolean = true;

  constructor() {
    super({
      key: 'gameHud',
    });
  }

  create() {
    const gameScene = this.scene.get('gameScene') as Phaser.Scene;
    const textStyle = { fontFamily: 'Cordelina',  color: '#ffffff',stroke: '#000000', strokeThickness: 8, };
    const waveText = [`Onda:${this.waveNumber}`];
    const actText = [`Ato:${this.actNumber}`];
    const cointText = [`10`];
   
    this.events.off('timeUp');
    this.events.on('timeUp', () => {
      console.log('timeUp disparado');
      this.phaseCount();
    });

    console.log('actNumber: ', this.actNumber, 'waveNumber: ', this.waveNumber);
    this.add.image(80, 40, 'health-bar').setDisplaySize(120, 120);
    this.add.image(60, 130, 'gun').setDisplaySize(90, 90);
    this.add.image(1770, 130, 'coin').setDisplaySize(60, 60);
   
    this.add.text(1785, 80, waveText, textStyle).setFontSize(36).setAlign('center').setOrigin(0.5);
    this.add.text(1780, 40, actText, textStyle).setFontSize(36).setAlign('center').setOrigin(0.5);
    this.add.text(1820, 130, cointText, textStyle).setFontSize(48).setAlign('center').setOrigin(0.5);

    this.updateHud();

    this.coinCount();

    this.timerInstance = new timer(this);
    this.timerInstance.create();
  }

  public phaseCount() {
    if (!this.shouldIncrementWave) return;

    console.log(`Chamando phaseCount(). waveNumber: ${this.waveNumber}, actNumber: ${this.actNumber}`);

    this.waveNumber++;

    if (this.waveNumber > 9) {
      this.waveNumber = 1;
      this.actNumber++;
    }

    console.log(`Depois do incremento. waveNumber: ${this.waveNumber}, actNumber: ${this.actNumber}`);

    this.updateHud();
  }

  public updateHud() {
    if (this.waveText && this.actText) {
      this.waveText.setText(`Onda: ${this.waveNumber}`);
      this.actText.setText(`Ato: ${this.actNumber}`);
    } else {
      console.warn('HUD ainda não foi criado.');
    }
  }

  public advanceWaveCount() {
    console.log(this.waveNumber, 'waveCount');
  }

  public enableWaveIncrement() {
    this.shouldIncrementWave = true;
  }

  public disableWaveIncrement() {
    this.shouldIncrementWave = false;
  }

  public coinCount() {
    this.coinGame = 10;
  }
}
