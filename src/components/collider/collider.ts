import { gameScene } from '../../scenes/gameScene';
import { player } from '../../objects/player/player';
import { enemyGroup } from '../../objects/enemies/enemy';
import { gameHud } from '../../objects/ui/gameHud';

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

      // Reseta as ondas ao reiniciar
      const gameHud = this.scene.scene.get('gameHud') as gameHud;
      if (gameHud) {
        gameHud.waveNumber = 1;
        gameHud.actNumber = 1;
        gameHud.shouldIncrementWave = true;
        gameHud.updateHud();
      }

      this.scene.scene.restart();
    });
  }
}
