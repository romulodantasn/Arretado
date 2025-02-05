/* eslint-disable @typescript-eslint/no-explicit-any */

import { GameOptions } from "./../config/gameOptions";

export class PlayGame extends Phaser.Scene {
   
    constructor() {
        super({ key: 'PlayGame' });
    }
    
    controlKeys: any; // teclas pra mover o player
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // player
    enemyGroup: Phaser.Physics.Arcade.Group; // grupo com todos os inimigos

    create(): void {
        
        //adicionando player, grupo de inimigos e balas
        this.player = this.physics.add.sprite(GameOptions.gameSize.width / 2, GameOptions.gameSize.height / 2, 'player');
        this.enemyGroup = this.physics.add.group();
        const bulletGroup: Phaser.Physics.Arcade.Group = this.physics.add.group();
        
        //setando os controles do teclado
        const keyboard : Phaser.Input.Keyboard.KeyboardPlugin = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin; 
        this.controlKeys = keyboard.addKeys({
            'up'    : Phaser.Input.Keyboard.KeyCodes.W,
            'left'  : Phaser.Input.Keyboard.KeyCodes.A,
            'down'  : Phaser.Input.Keyboard.KeyCodes.S,
            'right' : Phaser.Input.Keyboard.KeyCodes.D
        });
        
        //setando a area de spawn dos inimigos
        const outerRectangle : Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(-100, -100, GameOptions.gameSize.width + 200, GameOptions.gameSize.height + 200);
        const innerRectangle : Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(-50, -50, GameOptions.gameSize.width + 100, GameOptions.gameSize.height + 100);

        this.time.addEvent({
            delay: GameOptions.enemyRate,
            loop: true,
            callback: () => {
                const spawnPoint : Phaser.Geom.Point = Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
                const enemy : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'enemy');
                this.enemyGroup.add(enemy);
            },
        });

        this.time.addEvent({
            delay: GameOptions.bulletRate,
            loop: true,
            callback: () => {
                const closestEnemy = this.physics.closest(this.player, this.enemyGroup.getChildren());
                if (closestEnemy) {
                    const bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
                    bulletGroup.add(bullet);
                    this.physics.moveToObject(bullet, closestEnemy, GameOptions.bulletSpeed);
                }
            },
        });

        // colisão bala vs inimigo
        this.physics.add.collider(bulletGroup, this.enemyGroup, (bullet : any, enemy : any) => {
            bulletGroup.killAndHide(bullet);
            bullet.body.checkCollision.none = true;
            this.enemyGroup.killAndHide(enemy);
            enemy.body.checkCollision.none = true;
        });

        // colisao player vs inimigo 
        this.physics.add.collider(this.player, this.enemyGroup, () => {
            this.scene.restart();
        });  
        
    }

    update() {   
        
        // seta movimentação de acordo com as teclas pressionadas
        let movementDirection : Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);  
        if (this.controlKeys.right.isDown) {
            movementDirection.x ++;  
        }
        if (this.controlKeys.left.isDown) {
            movementDirection.x --;
        }
        if (this.controlKeys.up.isDown) {
            movementDirection.y --;    
        }
        if (this.controlKeys.down.isDown) {
            movementDirection.y ++;    
        }
        
        // seta a velocidade do player de acordo com a direção
        this.player.setVelocity(0, 0);
        if (movementDirection.x == 0 || movementDirection.y == 0) {
            this.player.setVelocity(movementDirection.x * GameOptions.playerSpeed, movementDirection.y * GameOptions.playerSpeed);
        }
        else {
            this.player.setVelocity(movementDirection.x * GameOptions.playerSpeed / Math.sqrt(2), movementDirection.y * GameOptions.playerSpeed / Math.sqrt(2));    
        } 

        // move inimigos para o player
        this.enemyGroup.getMatching('visible', true).forEach((enemy : any) => {
            this.physics.moveToObject(enemy, this.player, GameOptions.enemySpeed);
        });
    }
}
