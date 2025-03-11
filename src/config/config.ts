import { gameOptions } from './gameOptions';
import { bootScene } from '../scenes/bootScene';
import { preloadAssets } from '../scenes/preloadAssets';
import { gameScene } from '../scenes/gameScene';
import { pauseScene } from '../scenes/pauseScene';

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
  scene: [bootScene, preloadAssets, gameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0, x: 0 },
    },
  },
};
