
import NinePatchPlugin from 'phaser3-rex-plugins/plugins/ninepatch-plugin.js';
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
import { menuScene } from '../scenes/menuScene';
import { StoreScene } from '../scenes/StoreScene';
import { SkinScene } from '../scenes/SkinScene';
import { CharacterSelectScene } from '../scenes/CharacterSelectScene';

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
  pixelArt: true,
  scene: [
    BootScene,
    preloadAssets,
    gameScene,
    PlayerHealthBar,
    GameOverScene,
    nextPhaseScene,
    PauseScene,
    StoreScene,
    SkinScene,
    itemScene,
    titleScene,
    menuScene,
    CharacterSelectScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0, x: 0 },
    },
  },
  plugins: {
    global: [
      {
        key: 'rexNinePatchPlugin',
        plugin: NinePatchPlugin,
        start: true
      },
    ],
  },
};
