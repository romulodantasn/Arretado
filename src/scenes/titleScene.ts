import { gameOptions } from "../config/gameOptions";
import { inputManager } from "../components/input/inputManager";

export class titleScene extends Phaser.Scene {
    static controlKeys: any;
    constructor ()
    {
        super('titleScene');
    }

    create ()
    {
        console.log('titleScene carregada');
        const textStyle = { fontFamily: 'Cordelina', color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add
             .image(0, 0, 'titleSceneBackground')
             .setOrigin(0, 0)
             .setDisplaySize(gameOptions.gameSize.width, gameOptions.gameSize.height);

        const gameName =  [
            'ARRETADO'
        ]
        this.add.text(960, 550, gameName, textStyle).setFontSize(64).setAlign('center').setOrigin(0.5);
        
        const instructions = [
            "Pressione ENTER para começar"
        ]

        this.add.text(980, 850, instructions, textStyle).setFontSize(48).setAlign('center').setOrigin(0.5);
        
        const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
        const enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
       
        enterKey.on('down', () => {
            this.scene.start('gameScene');
            
            
        });
    }
}