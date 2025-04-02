import Phaser from 'phaser';
import { configObject } from './config/config';
import { bootScene } from './scenes/bootScene';
import { preloadAssets } from './scenes/preloadAssets';
import { titleScene } from './scenes/titleScene';
import { gameScene } from './scenes/gameScene';
import { pauseScene } from './scenes/pauseScene';
import { gameHud } from './objects/ui/gameHudUi';
import { nextPhaseScene } from './scenes/nextPhaseScene';
import { GameOverScene } from './scenes/GameOverScene';
import { healthUi } from './objects/ui/healthUi';

configObject.scene = [
  bootScene,
  preloadAssets,
  titleScene,
  gameScene,
  gameHud,
  healthUi,
  pauseScene,
  GameOverScene,
  nextPhaseScene,
];

new Phaser.Game(configObject);
