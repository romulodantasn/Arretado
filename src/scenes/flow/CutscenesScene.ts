import { CUTSCENES } from '../../config/CutscenesContainer';
import { gameOptions } from '../../config/GameOptionsConfig';
import { inputManager } from '../../components/input/InputManager';

type CutsceneKey = keyof typeof CUTSCENES;

export class CutscenesScene extends Phaser.Scene {
    constructor() {
      super('CutscenesScene');
    }
  
    create(data: { 
      backgroundKey: string, 
      texto?: string, 
      duracao?: number, 
      proximaCena: string, 
      selectedCharacterId?: string,
      nextCutscene?: CutsceneKey,
      waveKey?: string 
    }) {
      const { backgroundKey, texto = '', duracao = 4000, proximaCena, selectedCharacterId, nextCutscene, waveKey } = data;
  
      this.add.image(gameOptions.gameSize.width / 2, gameOptions.gameSize.height / 2, backgroundKey)
        .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height)
        .setOrigin(0.5);
      
      if (texto) {
        this.add.text(gameOptions.gameSize.width / 2, gameOptions.gameSize.height * 0.8, texto, {
          fontFamily: 'Cordelina',
          fontSize: '56px',
          color: '#ffffff',
          wordWrap: { width: gameOptions.gameSize.width * 0.8 },
          align: 'center'
        }).setOrigin(0.5);
      }

      this.add.text(gameOptions.gameSize.width - 20, gameOptions.gameSize.height - 20, 'Pular Cutscene - Enter', {
        fontFamily: 'Cordelina',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(1, 1);

      inputManager.setupControls(this);
      const keys = inputManager.getKeys();

      const transitionToNextScene = () => {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
          if (proximaCena === 'gameScene') {
            this.scene.start(proximaCena, {
              selectedCharacterId,
              waveKey: waveKey || 'Wave_1'
            });
          } else if (proximaCena === 'CutscenesScene' && nextCutscene) {
            this.scene.start(proximaCena, {
              ...CUTSCENES[nextCutscene],
              selectedCharacterId
            });
          } else {
            this.scene.start(proximaCena, selectedCharacterId ? { selectedCharacterId } : undefined);
          }
        });
      };

      keys.enter.on('down', transitionToNextScene);
  
      this.cameras.main.fadeIn(1000);
  
      this.time.delayedCall(duracao, () => {
        this.cameras.main.fadeOut(1000);
        this.time.delayedCall(1000, transitionToNextScene);
      });
    }

    shutdown() {
      this.events.removeAllListeners();
      this.input.keyboard?.removeAllListeners();
    }
  }
  