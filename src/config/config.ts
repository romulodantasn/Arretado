
import NinePatchPlugin from 'phaser3-rex-plugins/plugins/ninepatch-plugin.js';
import { gameOptions } from './GameOptionsConfig';
import { BootScene } from '../scenes/flow/BootScene';
import { preloadAssets } from '../scenes/base/preloadAssets';
import { titleScene } from '../scenes/flow/TitleScene';
import { GameScene } from '../scenes/gameplay/GameScene';
import { PauseScene } from '../scenes/flow/PauseScene';
import { nextPhaseScene } from '../scenes/flow/NextPhaseScene';
import { GameOverScene } from '../scenes/flow/GameOverScene';
import { PlayerHealthBar } from '../objects/player/PlayerHealthBar';
import { itemScene } from '../scenes/gameplay/itemScene';
import { menuScene } from '../scenes/flow/MenuScene';
import { StoreScene } from '../scenes/gameplay/StoreScene';
import { SkinScene } from '../scenes/gameplay/SkinScene';
import { CharacterSelectScene } from '../scenes/flow/CharacterSelectScene';
import { PlayerBoostCooldownUI } from '../objects/player/PlayerBoostCooldownUI';


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
    GameScene,
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
    PlayerBoostCooldownUI
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
