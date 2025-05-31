import { CUTSCENES } from '../../config/CutscenesContainer';
import { gameOptions } from '../../config/GameOptionsConfig';

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
      nextCutscene?: CutsceneKey 
    }) {
      const { backgroundKey, texto = '', duracao = 4000, proximaCena, selectedCharacterId, nextCutscene } = data;
  
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
  
      this.cameras.main.fadeIn(1000);
  
      this.time.delayedCall(duracao, () => {
        this.cameras.main.fadeOut(1000);
        this.time.delayedCall(1000, () => {
          if (proximaCena === 'gameScene' && selectedCharacterId) {
            this.scene.start(proximaCena, {
              selectedCharacterId,
              waveKey: 'Wave_1'
            });
          } else if (proximaCena === 'CutscenesScene' && nextCutscene) {
            // Se tiver uma próxima cutscene, carrega ela com os dados do CUTSCENES
            this.scene.start(proximaCena, {
              ...CUTSCENES[nextCutscene],
              selectedCharacterId
            });
          } else {
            this.scene.start(proximaCena, selectedCharacterId ? { selectedCharacterId } : undefined);
          }
        });
      });
    }
  }
  