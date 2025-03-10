export type GameTypes = {
  timeLeft: number;
  timerText: Phaser.GameObjects.Text;
  waveCount: number;
  waveText: Phaser.GameObjects.Text;
  actCount: number;
  actText: Phaser.GameObjects.Text;
  coinGame: number;
  coinText: Phaser.GameObjects.Text;
  controlKeys: any;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemyGroup: Phaser.Physics.Arcade.Group;
  enemySprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
};
