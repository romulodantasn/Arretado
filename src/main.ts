// main.ts
import Phaser from 'phaser';
import { configObject } from './config/config';
import { PreloadAssets } from './scenes/preloadAssets';
import { PlayGame } from './scenes/playGame';
import { pauseScene } from './scenes/pauseScene';


configObject.scene = [PreloadAssets, PlayGame, pauseScene]

// Inicializando o jogo
new Phaser.Game(configObject);
