import { gameScene } from '../../scenes/gameScene';
import { player } from '../../objects/player/player';
import { enemyGroup } from '../../objects/enemies/enemy';

export class collider {
  private scene: gameScene;
  private player: player;
  private enemy: enemyGroup;

  constructor(scene: gameScene, player: player, enemy: enemyGroup) {
    this.scene = scene;
    this.player = player;
    this.enemy = enemy;
  }
  create() {
    this.setupCollision();
  }

  public setupCollision() {
    this.scene.physics.add.collider(this.player, this.enemy, () => {
      console.log('Eita macho tu perdesse. Reiniciando.');
      this.scene.scene.restart();
    });
  }
}
