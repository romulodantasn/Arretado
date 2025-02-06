// config.ts

import { GameOptions } from './gameOptions';
import { PreloadAssets } from '../scenes/preloadAssets';
import { PlayGame } from '../scenes/playGame';
import { pauseScene } from '../scenes/pauseScene';

export const scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode        : Phaser.Scale.FIT,                     
    autoCenter  : Phaser.Scale.CENTER_BOTH,             
    parent      : 'theGame',                            
    width       : GameOptions.gameSize.width,           
    height      : GameOptions.gameSize.height 
};

export const configObject: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    backgroundColor: GameOptions.gameBackgroundColor,
    scale: scaleObject,
    scene: [
        PreloadAssets,
        PlayGame,
        pauseScene
    ],
    physics: {
        default: 'arcade'
    }
};

