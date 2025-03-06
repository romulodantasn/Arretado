/* eslint-disable @typescript-eslint/no-explicit-any */

import { DOWN, LEFT, RIGHT, UP } from "phaser";
import { GameOptions } from "./../config/gameOptions";

export class PlayGame extends Phaser.Scene {
  // Atributos
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
  enemySprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super({ key: "PlayGame" });
  }

  // Métodos de criação/inicialização principais
  create(): void {
    console.log("PlayGame carregado!");
    
    
    this.initializePlayer();
    this.initializeEnemyGroup();
    this.setupCollisions();
    this.initializeTimer();
    this.phaseCount();
    this.initializeBullets();
    this.initializeControls();
    this.coinCount();
    
    
   
    
    this.add.image(0, 0, "gameBackgroundLimbo").setOrigin(0, 0).setDisplaySize(GameOptions.gameSize.width, GameOptions.gameSize.height);
    this.add.image(80, 40, "health-bar").setDisplaySize(120,120);
    this.add.image(60, 130, "gun").setDisplaySize(90,90);
    this.add.image(1770, 130, "coin").setDisplaySize(60,60);
    

    this.anims.create({
      key: "playerWalk",
      frames: this.anims.generateFrameNumbers("playerWalk", { start: 0, end: 3}),
      frameRate: 16,
      repeat: -1,
    });
    this.player.play("playerWalk", true);
    
    this.anims.create({
      key: "playerRun",
      frames: this.anims.generateFrameNumbers("playerRun", { start: 0, end: 6}),
      frameRate: 16,
      repeat: -1,
    });
    this.player.play("playerRun", true);
    
    
    this.anims.create({
      key: "enemy",
      frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update(): void {
    this.handlePause();
    this.handlePlayerMovement();
    this.updateEnemyMovement();
    this.animationPlayerControl();
  }
  
  private initializeTimer() {
    this.timeLeft = 45;
    this.timerText = this.add.text(920, 16, `00:${this.timeLeft}`, {
      fontSize: "24px",
      color: "#fff",
    }).setDepth(10);

    this.time.addEvent({
      delay: 1000, // milissegundos
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }
  private phaseCount() {
    this.waveCount = 1;
    this.waveText = this.add.text(1740, 48, `Onda:${this.waveCount}`, {
      fontSize: "36px",
      color: "#fff",
    }).setDepth(10);
    this.actCount = 1;
    this.actText = this.add.text(1744, 8, `Ato:${this.actCount}`, {
      fontSize: "36px",
      color: "#fff",
    })
    .setDepth(10);
  }
  
  private coinCount() {
    this.coinGame = 10;
    this.waveText = this.add.text(1820, 110, `${this.coinGame}`, {
      fontSize: "36px",
      color: "#fff",
    }).setDepth(10);
  }

  private initializePlayer() {
    console.log("Player inicializado!");
    this.player = this.physics.add.sprite(
      GameOptions.gameSize.width / 2,
      GameOptions.gameSize.height / 2,
      "player",
    ).setCollideWorldBounds(true)
    .setVisible(true)
    .setActive(true)
    .setDepth(10);
  }

  private initializeEnemyGroup() {
    this.enemyGroup = this.physics.add.group();
    

    const outerRectangle = new Phaser.Geom.Rectangle(
      -100,
      -100,
      GameOptions.gameSize.width + 200,
      GameOptions.gameSize.height + 200
    );

    const innerRectangle = new Phaser.Geom.Rectangle(
      -50,
      -50,
      GameOptions.gameSize.width + 100,
      GameOptions.gameSize.height + 100
    );

    this.time.addEvent({
      delay: GameOptions.enemyRate,
      loop: true,
      callback: () => {
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
          outerRectangle, 
          innerRectangle
        );
        this.enemySprite = this.physics.add.sprite(
          spawnPoint.x,
          spawnPoint.y,
          "enemy"
        );
        this.enemySprite.play("enemy",true);   
        this.enemyGroup.add(this.enemySprite);
      },
    });
  }

  private initializeBullets() {
    const bulletGroup: Phaser.Physics.Arcade.Group = this.physics.add.group();

    this.time.addEvent({
      delay: GameOptions.bulletRate,
      loop: true,
      callback: () => {
        const enemies = this.enemyGroup.getChildren();
        if (enemies.length > 0) {
          const closestEnemy = this.physics.closest(this.player, enemies);
          if (closestEnemy && closestEnemy.body) {
            const bullet = this.physics.add.sprite(
              this.player.x,
              this.player.y,
              "bullet"
            );
            bulletGroup.add(bullet);

            const angle = Phaser.Math.Angle.Between(
              this.player.body.position.x,
              this.player.body.position.y,
              closestEnemy.body.position.x,
              closestEnemy.body.position.y
            );
            const speed = GameOptions.bulletSpeed;
            bullet.setVelocity(
              Math.cos(angle) * speed,
              Math.sin(angle) * speed
            );
          }
        }
      },
    });

    this.physics.add.collider(
      bulletGroup,
      this.enemyGroup,
      (bullet: any, enemy: any) => {
        bulletGroup.killAndHide(bullet);
        bullet.body.checkCollision.none = true;
        this.enemyGroup.killAndHide(enemy);
        enemy.body.checkCollision.none = true;
      }
    );
  }
  
  private setupCollisions() {
    this.physics.add.collider(this.player, this.enemyGroup,() => {
      console.log("Eita macho tu perdesse. Reiniciando.");
      this.resetGameSettings();
      this.scene.restart();
    });
  }

  private handlePause() {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.controlKeys.pause as Phaser.Input.Keyboard.Key
      )
    ) {
      if (this.scene.isPaused("PlayGame")) {
        console.log("Jogo retomado");
        this.scene.resume("PlayGame");
        this.scene.stop("pauseScene");
      } else {
        console.log("Jogo Pausado");
        this.scene.pause("PlayGame");
        this.scene.launch("pauseScene");
      }
    }
  }


  private initializeControls() {
    const keyboard = this.input
      .keyboard as Phaser.Input.Keyboard.KeyboardPlugin;

    this.controlKeys = keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
  }

  private handlePlayerMovement() {
    let movementDirection = new Phaser.Math.Vector2(0, 0);
    let isMoving = false;

    if (this.controlKeys.right.isDown) {
      movementDirection.x++;
       isMoving = true;
    }
    if (this.controlKeys.left.isDown) {
      movementDirection.x--;
       isMoving = true;
    }
    if (this.controlKeys.up.isDown) {
      movementDirection.y--;
       isMoving = true;
    }
    if (this.controlKeys.down.isDown) {
      movementDirection.y++;
       isMoving = true;
    }

    this.player.setVelocity(0, 0);

    if (movementDirection.x === 0 || movementDirection.y === 0) {
      this.player.setVelocity(
        movementDirection.x * GameOptions.playerSpeed,
        movementDirection.y * GameOptions.playerSpeed
      );
    } else {
      this.player.setVelocity(
        (movementDirection.x * GameOptions.playerSpeed) / Math.sqrt(2),
        (movementDirection.y * GameOptions.playerSpeed) / Math.sqrt(2)
      );
    }
    return isMoving;
  }

  private animationPlayerControl() {
    if (this.handlePlayerMovement()) {
      if (this.player.anims.currentAnim?.key !== "playerRun") {
        this.player.play("playerRun", true);
      }
    } else {
      if (this.player.anims.currentAnim?.key !== "playerWalk") {
        this.player.play("playerWalk", true);
      }
    }    
  }

  private updateEnemyMovement() {
    this.enemyGroup.getMatching("visible", true).forEach((enemy: any) => {
      this.physics.moveToObject(enemy, this.player, GameOptions.enemySpeed);
    });
  }

  private updateTimer() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.timerText.setText(`00:${this.timeLeft}`);
    }

    if (this.timeLeft <= 0) {
      this.advanceToNextPhase();
    }
  }

  private advanceToNextPhase() {
    console.log("Eita caba danado! Sobreviveu! Avançando para a próxima fase");
    this.timeLeft = 45;
    GameOptions.enemyRate -= 500;
    this.scene.restart();
  }

  private resetGameSettings() {
    this.timeLeft = 45;
    GameOptions.enemyRate = 800;
  }
}
