import Phaser from 'phaser';
import { configObject } from '../src/config/config';
import { BootScene } from '../src/scenes/flow/BootScene';
import { preloadAssets } from '../src/scenes/base/preloadAssets';
import { titleScene } from '../src/scenes/flow/TitleScene';
import { GameScene } from '../src/scenes/gameplay/GameScene';
import { PauseScene } from '../src/scenes/flow/PauseScene';
import { gameHud } from '../src/scenes/ui/gameHudUi';
import { nextPhaseScene } from '../src/scenes/flow/NextPhaseScene';
import { GameOverScene } from '../src/scenes/flow/GameOverScene';
import { PlayerHealthBar } from '../src/objects/player/PlayerHealthBar';
import { itemScene } from '../src/scenes/gameplay/itemScene';
import { menuScene } from '../src/scenes/flow/MenuScene';
import { StoreScene } from '../src/scenes/gameplay/StoreScene';
import { SkinScene } from '../src/scenes/gameplay/SkinScene';
import { CharacterSelectScene } from '../src/scenes/flow/CharacterSelectScene';
import { PlayerBoostCooldownUI } from '../src/objects/player/PlayerBoostCooldownUI';
import { CutscenesScene } from '../src/scenes/flow/CutscenesScene';
import { BossHealthBar } from '../src/objects/enemies/BossHealthBar';


configObject.scene = [
  BootScene,
  preloadAssets,
  titleScene,
  GameScene,
  gameHud,
  PlayerHealthBar,
  PauseScene,
  StoreScene,
  SkinScene,
  GameOverScene,
  nextPhaseScene,
  itemScene,
  menuScene,
  CharacterSelectScene,
  PlayerBoostCooldownUI,
  CutscenesScene,
  BossHealthBar
];

new Phaser.Game(configObject);
