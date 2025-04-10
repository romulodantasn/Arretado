import Phaser from 'phaser';
import { configObject } from './config/config';
import { BootScene } from './scenes/BootScene';
import { preloadAssets } from './scenes/preloadAssets';
import { titleScene } from './scenes/titleScene';
import { gameScene } from './scenes/gameScene';
import { PauseScene } from './scenes/PauseScene';
import { gameHud } from './objects/ui/gameHudUi';
import { nextPhaseScene } from './scenes/nextPhaseScene';
import { GameOverScene } from './scenes/GameOverScene';
import { healthUi } from './objects/ui/healthUi';
import { itemScene } from './scenes/itemScene';

configObject.scene = [
  BootScene,
  preloadAssets,
  titleScene,
  gameScene,
  gameHud,
  healthUi,
  PauseScene,
  GameOverScene,
  nextPhaseScene,
  itemScene,
];

new Phaser.Game(configObject);
