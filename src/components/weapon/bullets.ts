// BulletManager.ts
import Phaser from 'phaser';
import { gameOptions } from '../../config/gameOptions';
import { player } from '../../objects/player/player';
import { enemyGroup } from '../../objects/enemies/enemy';

export class bulletManager {
  private scene: Phaser.Scene;
  private player: player;
  private enemyGroup: enemyGroup;
  private bulletGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, player: player, enemyGroup: enemyGroup) {
    this.scene = scene;
    this.player = player;
    this.enemyGroup = enemyGroup;
    this.bulletGroup = this.scene.physics.add.group();
    this.initializeBullets();
  }

  private initializeBullets() {
    console.log('Iniciando as balas');
    this.scene.time.addEvent({
      delay: gameOptions.bulletRate,
      loop: true,
      callback: this.createBullet,
      callbackScope: this,
    });

    this.scene.physics.add.collider(this.bulletGroup, this.enemyGroup, this.handleBulletCollision, undefined, this);
  }

  private createBullet() {
    const enemies = this.enemyGroup.getChildren();
    if (enemies.length > 0) {
      const closestEnemy = this.scene.physics.closest(this.player, enemies);
      if (closestEnemy && closestEnemy.body) {
        const bullet = this.scene.physics.add.sprite(this.player.x, this.player.y, 'bullet');
        this.bulletGroup.add(bullet);

        const angle = Phaser.Math.Angle.Between(
          this.player.body?.position.x ?? 0,
          this.player.body?.position.y ?? 0,
          closestEnemy.body.position.x,
          closestEnemy.body.position.y
        );
        const speed = gameOptions.bulletSpeed;
        bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        console.log(`Criação de bala, número de inimigos: ${enemies.length}`);
      }
    }
  }

  private handleBulletCollision(bullet: any, enemy: any) {
    console.log(`Colisão detectada entre bala e inimigo`);
    console.log(`Posição da bala: (${bullet.x}, ${bullet.y})`);
    console.log(`Posição do inimigo: (${enemy.x}, ${enemy.y})`);
    this.bulletGroup.killAndHide(bullet);
    bullet.body.checkCollision.none = true;
    this.enemyGroup.killAndHide(enemy);
    enemy.body.checkCollision.none = true;
  }
}
