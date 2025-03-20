import Phaser from 'phaser';
import { configObject } from './config/config';
import { bootScene } from './scenes/bootScene';
import { preloadAssets } from './scenes/preloadAssets';
import { titleScene } from './scenes/titleScene';
import { gameScene } from './scenes/gameScene';
import { pauseScene } from './scenes/pauseScene';
import { gameHud } from './objects/ui/gameHud';
import { nextPhaseScene } from './scenes/nextPhaseScene';
import { colliderScene } from './scenes/colliderScene';

configObject.scene = [
  bootScene,
  preloadAssets,
  titleScene,
  gameScene,
  gameHud,
  pauseScene,
  colliderScene,
  nextPhaseScene,
];

new Phaser.Game(configObject);
