import { gameOptions } from './gameOptionsConfig';
import { bootScene } from '../scenes/bootScene';
import { preloadAssets } from '../scenes/preloadAssets';
import { titleScene } from '../scenes/titleScene';
import { gameScene } from '../scenes/gameScene';
import { pauseScene } from '../scenes/pauseScene';
import { nextPhaseScene } from '../scenes/nextPhaseScene';
import { GameOverScene } from '../scenes/GameOverScene';
import { healthUi } from '../objects/ui/healthUi';
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
    bootScene,
    preloadAssets,
    gameScene,
    healthUi,
    GameOverScene,
    nextPhaseScene,
    pauseScene,
    itemScene,
    titleScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0, x: 0 },
    },
  },
};
