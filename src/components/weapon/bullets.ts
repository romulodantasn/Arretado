import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';
export class initializeBullets extends Phaser.Scene {
  enemyGroup: Phaser.Physics.Arcade.Group;
  bulletGroup: Phaser.Physics.Arcade.Group = this.physics.add.group();
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super({
      key: 'bullets',
    });
  }

  create() {
    this.initializeBullets();
  }

  public initializeBullets() {
    this.time.addEvent({
      delay: gameOptions.bulletRate,
      loop: true,
      callback: () => {
        const enemies = this.enemyGroup.getChildren();
        if (enemies.length > 0) {
          const closestEnemy = this.physics.closest(this.player, enemies);
          if (closestEnemy && closestEnemy.body) {
            const bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
            this.bulletGroup.add(bullet);

            const angle = Phaser.Math.Angle.Between(
              this.player.body.position.x,
              this.player.body.position.y,
              closestEnemy.body.position.x,
              closestEnemy.body.position.y
            );
            const speed = gameOptions.bulletSpeed;
            bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
          }
        }
      },
    });

    this.physics.add.collider(this.bulletGroup, this.enemyGroup, (bullet: any, enemy: any) => {
      this.bulletGroup.killAndHide(bullet);
      bullet.body.checkCollision.none = true;
      this.enemyGroup.killAndHide(enemy);
      enemy.body.checkCollision.none = true;
    });
  }
}
