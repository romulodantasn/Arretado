import { gameOptions } from './gameOptionsConfig';
import { BootScene } from '../scenes/BootScene';
import { preloadAssets } from '../scenes/preloadAssets';
import { titleScene } from '../scenes/titleScene';
import { gameScene } from '../scenes/gameScene';
import { PauseScene } from '../scenes/PauseScene';
import { nextPhaseScene } from '../scenes/nextPhaseScene';
import { GameOverScene } from '../scenes/GameOverScene';
import { PlayerHealthBar } from '../objects/player/PlayerHealthBar';
import { itemScene } from '../scenes/itemScene';

export const scaleObject: Phaser.Types.Core.ScaleConfig = {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  parent: 'theGame',
  width: gameOptions.gameSize.width,
  height: gameOptions.gameSize.height,
};

export const configObject: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  scale: scaleObject,
  scene: [
    BootScene,
    preloadAssets,
    gameScene,
    PlayerHealthBar,
    GameOverScene,
    nextPhaseScene,
    PauseScene,
    itemScene,
    titleScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0, x: 0 },
    },
  },
};
