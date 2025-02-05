// main.ts
import Phaser from 'phaser';
import { configObject } from './config/config';
import { PreloadAssets } from './scenes/preloadAssets';
import { PlayGame } from './scenes/playGame';


configObject.scene = [PreloadAssets, PlayGame]

// Inicializando o jogo
new Phaser.Game(configObject);
