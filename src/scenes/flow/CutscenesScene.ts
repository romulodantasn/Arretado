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
      let { backgroundKey, texto = '', duracao = 4000, proximaCena, selectedCharacterId, nextCutscene, waveKey } = data;
      if (backgroundKey === CUTSCENES.cutscene5.backgroundKey) {
        duracao = 10000;
        this.scene.manager.scenes.forEach(scene => {
          if (scene.scene.key !== this.scene.key && scene.scene.isActive()) {
            this.scene.stop(scene.scene.key);
            this.scene.remove(scene.scene.key);
          }
        });
      }
  
      // Ajuste de aspecto para mostrar a imagem inteira, centralizada, sem cortes
      const imgTexture = this.textures.get(backgroundKey).getSourceImage();
      const imgW = imgTexture.width;
      const imgH = imgTexture.height;
      const canvasW = gameOptions.gameSize.width;
      const canvasH = gameOptions.gameSize.height;
      const scale = Math.min(canvasW / imgW, canvasH / imgH);
      const displayW = imgW * scale;
      const displayH = imgH * scale;
      const bgImage = this.add.image(canvasW / 2, canvasH / 2, backgroundKey)
        .setOrigin(0.5)
        .setDisplaySize(displayW, displayH);
      
      // Legenda sempre por cima, centralizada na parte inferior
      if (texto) {
        this.add.text(canvasW / 2, canvasH * 0.8, texto, {
          fontFamily: 'Cordelina',
          fontSize: '56px',
          color: '#ffffff',
          wordWrap: { width: canvasW * 0.8 },
          align: 'center',
          stroke: '#000000',
          strokeThickness: 6
        }).setOrigin(0.5).setDepth(10);
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
          if (backgroundKey === CUTSCENES.cutscene5.backgroundKey) {
            window.location.reload();
            return;
          }
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
  