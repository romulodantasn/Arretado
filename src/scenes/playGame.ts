/* eslint-disable @typescript-eslint/no-explicit-any */

import { DOWN, LEFT, RIGHT, UP } from "phaser";
import { GameOptions } from "./../config/gameOptions";

export class PlayGame extends Phaser.Scene {
    // Atributos
    private timeLeft: number = 45;
    private timerText: Phaser.GameObjects.Text;
    private waveCount: number = 1;
    private waveText: Phaser.GameObjects.Text;
    private actCount: number = 1;
    private actText: Phaser.GameObjects.Text;
    controlKeys: any; // teclas pra mover o player
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // player
    enemyGroup: Phaser.Physics.Arcade.Group; // grupo com todos os inimigos

    constructor() {
        super({ key: 'PlayGame' });
    }

    // Métodos principais
    create(): void {
        
        console.log("PlayGame carregado!");

        // Adicionando o background
        this.add.image(0, 0, 'gameBackgroundLimbo').setOrigin(0, 0).setDisplaySize(GameOptions.gameSize.width, GameOptions.gameSize.height);
        // Configuração do cronômetro
        this.initializeTimer();
        this.phaseCount();

        // Adicionando player, grupo de inimigos e balas
        this.initializePlayer();
        this.initializeEnemyGroup();
        this.initializeBullets();

        // Configuração de controles
        this.initializeControls();

        // Configuração de colisões
        this.setupCollisions();
        
    }

    update(): void {
        this.handlePause();
        this.handlePlayerMovement();
        this.updateEnemyMovement();
    }

    // Métodos auxiliares
    private initializeTimer(): void {
        this.timeLeft = 45;
        this.timerText = this.add.text(920, 16, `00:${this.timeLeft}`, {
            fontSize: '24px',
            color: '#fff',
        });

        this.time.addEvent({
            delay: 1000, // milissegundos
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });
    }

    private phaseCount() : void {
        this.waveCount = 1;
        this.waveText = this.add.text(1740, 48, `Onda:${this.waveCount}`, {
            fontSize: '36px',
            color: '#fff',
        });
        this.actCount = 1;
        this.actText = this.add.text(1744,8, `Ato:${this.actCount}`, {
            fontSize: '36px',
            color: '#fff',
        })
    }


    private initializePlayer(): void {
        this.player = this.physics.add.sprite(
            GameOptions.gameSize.width / 2,
            GameOptions.gameSize.height / 2,
            'player'
        );
    }

    private initializeEnemyGroup(): void {
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
                const enemy = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'enemy');
                this.enemyGroup.add(enemy);
            },
        });
    }

    private initializeBullets(): void {
        const bulletGroup: Phaser.Physics.Arcade.Group = this.physics.add.group();

        this.time.addEvent({
            delay: GameOptions.bulletRate,
            loop: true,
            callback: () => {
                const enemies = this.enemyGroup.getChildren();
                if(enemies.length > 0) {
                    const closestEnemy = this.physics.closest(this.player, enemies);
                    if(closestEnemy && closestEnemy.body) {
                        const bullet = this.physics.add.sprite(this.player.x, this.player.y,'bullet');
                        bulletGroup.add(bullet);

                        const angle = Phaser.Math.Angle.Between(
                            this.player.body.position.x, this.player.body.position.y,
                            closestEnemy.body.position.x, closestEnemy.body.position.y
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

        this.physics.add.collider(bulletGroup, this.enemyGroup, (bullet: any, enemy: any) => {
            bulletGroup.killAndHide(bullet);
            bullet.body.checkCollision.none = true;
            this.enemyGroup.killAndHide(enemy);
            enemy.body.checkCollision.none = true;
        });
    }

    private initializeControls(): void {
        const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;

        this.controlKeys = keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            pause: Phaser.Input.Keyboard.KeyCodes.ESC,
        });
    }

    private setupCollisions(): void {
        this.physics.add.collider(this.player, this.enemyGroup, () => {
            console.log('Eita macho tu perdesse. Reiniciando.');
            this.resetGameSettings();
            this.scene.restart();
        });
    }

    private handlePause(): void {
        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.pause as Phaser.Input.Keyboard.Key)) {
            if (this.scene.isPaused('PlayGame')) {
                console.log("Jogo retomado");
                this.scene.resume('PlayGame');
                this.scene.stop('pauseScene');
            } else {
                console.log("Jogo Pausado");
                this.scene.pause('PlayGame');
                this.scene.launch('pauseScene');
            }
        }
    }

    private handlePlayerMovement(): void {
        let movementDirection = new Phaser.Math.Vector2(0, 0);

        if (this.controlKeys.right.isDown) {
            movementDirection.x++;
        }
        if (this.controlKeys.left.isDown) {
            movementDirection.x--;
        }
        if (this.controlKeys.up.isDown) {
            movementDirection.y--;
        }
        if (this.controlKeys.down.isDown) {
            movementDirection.y++;
        }

        this.player.setVelocity(0, 0);

        if (movementDirection.x === 0 || movementDirection.y === 0) {
            this.player.setVelocity(
                movementDirection.x * GameOptions.playerSpeed,
                movementDirection.y * GameOptions.playerSpeed
            );
        } else {
            this.player.setVelocity(
                movementDirection.x * GameOptions.playerSpeed / Math.sqrt(2),
                movementDirection.y * GameOptions.playerSpeed / Math.sqrt(2)
            );
        }
    }

    private updateEnemyMovement(): void {
        this.enemyGroup.getMatching('visible', true).forEach((enemy: any) => {
            this.physics.moveToObject(enemy, this.player, GameOptions.enemySpeed);
        });
    }

    private updateTimer(): void {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.timerText.setText(`00:${this.timeLeft}`);
        }

        if (this.timeLeft <= 0) {
            this.advanceToNextPhase();
        }
    }

    private advanceToNextPhase(): void {
        console.log('Eita caba danado! Sobreviveu! Avançando para a próxima fase');
        this.timeLeft = 45;
        GameOptions.enemyRate -= 500;
        this.scene.restart();
    }

    private resetGameSettings() {
        this.timeLeft = 45;
        GameOptions.enemyRate = 800;
    }
}
