// classe pra fazer o preload dos assets
import Phaser from "phaser";
import { GameOptions } from "../config/gameOptions";

// classe do preloadassets se extende pra clase phaser.scene
export class PreloadAssets extends Phaser.Scene {

    // construtor
    constructor () {
        super ({
            key : 'PreloadAssets'
        });
    }

    // metodo pra ser chamado durante o preloading da classe
    preload() {

        // carregar imagens
        this.load.image('gameBackgroundLimbo', 'assets/backgrounds/background-limbo.png');
        this.load.image('enemy', 'assets/sprites/enemy.png');
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');

    }

    //executa quando a cena é criada

    create() {

        //começa a cena PlayGame
        this.add.image(0, 0, 'gameBackgroundLimbo').setOrigin(0,0).setDisplaySize(GameOptions.gameSize.height, GameOptions.gameSize.width);
        this.scene.start('PlayGame');
    }
}
