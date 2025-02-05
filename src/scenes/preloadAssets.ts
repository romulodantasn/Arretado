// classe pra fazer o preload dos assets
//import Phaser from "phaser";

// classe do preloadassets se extende pra clase phaser.scene
export class PreloadAssets extends Phaser.Scene {

    // construtor
    constructor () {
        super ({
            key : 'PreloadAssets'
        });
    }

    // metodo pra ser chamado durante o preloading da classe
    preload() : void {

        // carregar imagens
        this.load.image('enemy', 'assets/sprites/enemy.png');
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');
    }

    //executa quando a cena é criada

    create() : void {

        //começa a cena PlayGame
        this.scene.start('PlayGame');
    }
}
