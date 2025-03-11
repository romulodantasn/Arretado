import Phaser from 'phaser';
import { configObject } from './config/config';
import { bootScene } from './scenes/bootScene';
import { preloadAssets } from './scenes/preloadAssets';
import { gameScene } from './scenes/gameScene';
import { pauseScene } from './scenes/pauseScene';
import { gameHud } from './objects/ui/gameHud';

configObject.scene = [bootScene, preloadAssets, gameScene, gameHud, pauseScene];

// Inicializando o jogo
new Phaser.Game(configObject);
