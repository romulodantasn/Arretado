import Phaser from 'phaser';
import { gameHud } from '../ui/gameHudUi';
import { gameOptions, waveIndicator } from '../../config/GameOptionsConfig';
import { playerStats } from '../../config/player/PlayerConfig';
import { currentEnemyStats, EnemyType } from '../../config/enemies/EnemiesContainer';
import { resetGameState } from '../../components/events/gameResetEvent';

export class GameOverScene extends Phaser.Scene {
  private GameOverText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'GameOverScene',
    });
  }

  create() {
    this.gameOverScene();
    console.log('GameOverScene Carregada');
  }

  public gameOverScene() {
    const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 5 };
    const gameOverText = ['Eita macho tu perdesse. Reiniciando...'];
    this.add.text(960, 510, gameOverText, textStyle).setFontSize(36).setAlign('center').setOrigin(0.5);
    console.log('Eita macho tu perdesse. Reiniciando...');

    this.time.delayedCall(1500, () => {
      localStorage.clear();
      window.location.reload();
    });
  }

  shutdown() {
    this.events.removeAllListeners();
    this.input.keyboard?.removeAllListeners();
  }
}
