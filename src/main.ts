import Phaser from 'phaser';
import { configObject } from './config/config';
import { bootScene } from './scenes/bootScene';
import { preloadAssets } from './scenes/preloadAssets';
import { gameScene } from './scenes/gameScene';
import { pauseScene } from './scenes/pauseScene';
import { gameHud } from './objects/ui/gameHud';
import { nextPhaseScene } from './scenes/nextPhaseScene';

configObject.scene = [bootScene, preloadAssets, gameScene, gameHud, pauseScene, nextPhaseScene];

// Inicializando o jogo
new Phaser.Game(configObject);
