/* eslint-disable @typescript-eslint/no-explicit-any */

import { GameOptions } from '../config/gameOptions';

export class PlayGame extends Phaser.Scene {
  timeLeft: number = 45;
  timerText: Phaser.GameObjects.Text;
  waveCount: number = 1;
  waveText: Phaser.GameObjects.Text;
  actCount: number = 1;
  actText: Phaser.GameObjects.Text;
  coinGame: number;
  coinText: Phaser.GameObjects.Text;
  controlKeys: any;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemyGroup: Phaser.Physics.Arcade.Group;
  enemySprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super({ key: 'PlayGame' });
  }

  create(): void {
    this.initializePlayer();
    this.initializeEnemyGroup();
    this.setupCollisions();
    this.initializeTimer();
    this.phaseCount();
    this.initializeBullets();
    this.initializeControls();
    this.coinCount();
  }

  update(): void {}
}
