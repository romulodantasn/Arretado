import Phaser, { Scene } from 'phaser';
import { inputManager } from '../../components/input/inputManagerComponent';
import { gameOptions } from '../../config/gameOptionsConfig';
import { player } from '../player/playerObject';
import { enemyGroup } from '../enemies/enemyObject';
import { gameScene } from '../../scenes/gameScene';

export class bulletComponent {
  #scene: Phaser.Scene;
  #player: player;
  #enemy: enemyGroup;
  #bulletGroup: Phaser.Physics.Arcade.Group;
  #reticle: Phaser.GameObjects.Sprite;
  #keys: any;
  #pointer: Phaser.Input.Pointer;

  constructor(
    scene: Phaser.Scene,
    player: player,
    enemyGroup: enemyGroup,
    reticle: Phaser.GameObjects.Sprite,
    pointer: Phaser.Input.Pointer
  ) {
    this.#scene = scene;
    this.#player = player;
    this.#pointer = pointer;
    this.#enemy = enemyGroup;
    this.#bulletGroup = this.#scene.physics.add.group();
    this.#keys = inputManager.getKeys();
  }

  create() {
    this.reticleMovement();
    this.setupShooting();
    this.createBullet(this.#player, this.#reticle);
    console.log('BulletComponent criado');
  }

  update() {
    this.#player.rotation = Phaser.Math.Angle.Between(this.#player.x, this.#player.y, this.#reticle.x, this.#reticle.y);
  }

  public reticleMovement() {
    this.#reticle = this.#scene.add.sprite(this.#player.x, this.#player.y - 50, 'reticle');
    this.#reticle.setOrigin(0.5, 0.5).setDisplaySize(40, 40);
    this.#reticle.setActive(true).setVisible(true);
    this.#scene.input.setDefaultCursor('none');

    this.#scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.#reticle.x = pointer.worldX;
      this.#reticle.y = pointer.worldY;
    });
  }

  public containReticle() {
    if (this.#reticle) {
      this.#reticle.x = Phaser.Math.Clamp(this.#reticle.x, 0, this.#scene.scale.width);
      this.#reticle.y = Phaser.Math.Clamp(this.#reticle.y, 0, this.#scene.scale.height);
    }
  }

  public setupShooting() {
    inputManager.setupClicks(this.#scene, {
      onFire: () => {
        console.log('Atirando!');
        this.createBullet(this.#player, this.#reticle);
      },
    });
  }

  public createBullet(shooter: player, target: Phaser.GameObjects.Sprite) {
    const bullet = this.#scene.physics.add.sprite(shooter.x, shooter.y, 'bullet');
    const angle = Phaser.Math.Angle.Between(shooter.x, shooter.y, target.x, target.y);
    const speed = gameOptions.bulletSpeed;

    this.#bulletGroup.add(bullet);
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    bullet.setActive(true).setVisible(true);
    this.#scene.physics.add.collider(this.#bulletGroup, this.#enemy, this.handleBulletCollision, undefined, this);

    //cconsole.log(`Criando bala em (${shooter.x}, ${shooter.y})`);
    //console.log(`Atirando em direção a (${target.x}, ${target.y})`);
    //console.log(`Colisão detectada entre bala e inimigo`);
    //console.log(`Posição da bala: (${bullet.x}, ${bullet.y})`);
    //console.log(`Posição do inimigo: (${target.x}, ${target.y})`);
  }

  private handleBulletCollision(bullet: any, target: any) {
    this.#bulletGroup.killAndHide(bullet);
    bullet.body.checkCollision.none = true;
    this.#enemy.killAndHide(target);
    target.body.checkCollision.none = true;
  }
}
