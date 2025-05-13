export const gameOptions : {
  gameSize: { width: number, height: number}
  tilemap?: Phaser.Tilemaps.Tilemap,
  tilesets?: Phaser.Tilemaps.Tileset,
  groundLayer?: Phaser.Tilemaps.TilemapLayer,
  treesLayer?: Phaser.Tilemaps.TilemapLayer,
  wave_1_background: string,
  type: number,
  waveDuration: number,
  invulnerabilityDuration: number,
  apCoin: number,} 
  = { gameSize : {
    width: 1920,
    height: 1080,
  },
  wave_1_background: 'wave_1_background',
  type: Phaser.AUTO,
  waveDuration: 10,
  invulnerabilityDuration: 300,
  apCoin: 0,
  };

 

export const waveIndicator ={
  currentWave: 1,
  currentAct: 1,
}

export const gun = {
  gunDamage: 100,
  bulletSpeed: 600, // velocidade da bala, em pixels por segundo
}


export function setupTilemap(scene:Phaser.Scene, tilemapKey: string, tilesetName: string, tilesetImageKey: string) {
   const map = scene.make.tilemap({ key: tilemapKey });
  
   if(!map) {
    console.error(`Falha ao criar tilemap com a chave: ${tilemapKey}`);
    return;
   }

   const tileset = map.addTilesetImage(tilesetName, tilesetImageKey);
   if(!tileset) {
    console.error(`Falha ao adicionar tileset "${tilesetName}" usando a imagem "${tilesetImageKey}" ao mapa.}`)
    return;
   }
   const groundLayer = map.createLayer("ground", tileset);
   const treesLayer = map.createLayer("trees", tileset);

   gameOptions.tilemap = map;
   gameOptions.tilesets = tileset;
   gameOptions.groundLayer = groundLayer!;
   gameOptions.treesLayer = treesLayer!;
   gameOptions.gameSize.width = map.widthInPixels;
   gameOptions.gameSize.height = map.heightInPixels;
}
