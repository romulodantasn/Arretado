// main.ts
import Phaser from 'phaser';
import { configObject } from './config/config';
import { PreloadAssets } from './assets/preloadAssets';
import { PlayGame } from './scenes/gameScene';
import { pauseScene } from './scenes/pauseScene';

configObject.scene = [PreloadAssets, PlayGame, pauseScene];

// Inicializando o jogo
new Phaser.Game(configObject);
