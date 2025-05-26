export const gameOptions : {
  gameSize: { width: number, height: number}
  tilemap?: Phaser.Tilemaps.Tilemap,
  tilesets?: Phaser.Tilemaps.Tileset [],
  groundLayer?: Phaser.Tilemaps.TilemapLayer,
  objectsLayer?: Phaser.Tilemaps.TilemapLayer,
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
  invulnerabilityDuration: 100,
  apCoin: 0,
  };

 

export const waveIndicator ={
  currentWave: 1,
  currentAct: 1,
}

export const gun = {
  gunDamage: 1000,
  bulletSpeed: 600, // velocidade da bala, em pixels por segundo
  fireRate: 250,
}


export function setupTilemap(
  scene: Phaser.Scene,
  tilemapKey: string,
  tilesets: { name: string; imageKey: string }[],
  layers: string[],
  collisionLayers?: string[]
) {
  const map = scene.make.tilemap({ key: tilemapKey });

  if (!map) {
    console.error(`Falha ao criar tilemap com a chave: ${tilemapKey}`);
    return;
  }

  const addedTilesets: Phaser.Tilemaps.Tileset[] = tilesets.reduce((acc, { name, imageKey }) => {
  const tileset = map.addTilesetImage(name, imageKey);
  if (tileset) acc.push(tileset);
  else console.error(`Falha ao adicionar tileset "${name}" com imagem "${imageKey}"`);
  return acc;
}, [] as Phaser.Tilemaps.Tileset[]);


  const createdLayers: Record<string, Phaser.Tilemaps.TilemapLayer> = {};
  for (const layerName of layers) {
    const layer = map.createLayer(layerName, addedTilesets);
    layer?.setDepth(-5)
    if (layer) {
      createdLayers[layerName] = layer;

      if(collisionLayers?.includes(layerName)) {
          layer?.setCollisionByProperty({collides: true});
         console.log(`Colisao aplicada a camada "${layerName}"`)
      }
    } else {
      console.warn(`Camada "${layerName}" não foi criada.`);
    }
  }

  gameOptions.tilemap = map;
  gameOptions.tilesets = addedTilesets;
  gameOptions.gameSize.width = map.widthInPixels;
  gameOptions.gameSize.height = map.heightInPixels;
}

