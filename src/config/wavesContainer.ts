import { EnemyType } from "./enemiesContainer";

export interface WaveConfig {
    waveNumber: number; // número da onda
    enemies: EnemyType[]; // tipos de inimigos que aparecem na onda
    duration: number; // duração da onda em segundos
    background: string; // imagem de fundo da onda
    music: string; // música da onda
    tilemapKey?: string; // Chave do tilemap Tiled JSON 
    tileset?: {
        name: string, // Nome do tileset no Tiled
        imageKey: string, // Chave da imagem carregada no Phaser
    }[];
    layers?: string[], // Nomes das camadas que devem ser criadas
    collisionLayers?: string[], // Nome das camadas de colisao
    belongToAct : number; // Ato a qual a onda pertence 
}

export type WaveNumbers = 'Wave_1' | 'Wave_2' | 'Wave_3' | 'Wave_4' | 'Wave_5' | 'Wave_6' | 'Wave_7' | 'Wave_8' | 'Wave_9';

export const Waves : Record <WaveNumbers, WaveConfig> = {
    Wave_1: {
        waveNumber: 1,
        enemies: ['BasicEnemy'],
        duration: 5,
        background: 'wave_1_background',
        music: 'wave_1_music',
        tilemapKey: 'tileset_wave_1', // key do tilemap carregado em assets.json
        tileset: [
            {name: 'limbo_wave_1', imageKey: 'limbo_wave_1'}, // key e url do png da imagem do tileset no assets.json
        ],
        layers: ['ground'], // nome das layers no tileset.json
        collisionLayers: ['ground'],
        belongToAct: 1,
    },
    Wave_2: {
        waveNumber: 2,
        enemies: ['BasicEnemy', 'RangedEnemy'],
        duration: 25,
        background: 'wave_2_background',
        music: 'wave_2_music',
        tilemapKey: 'tileset_wave_2', 
        tileset: [
            {name: 'luxury_wave_2', imageKey: 'luxury_wave_2'}, 
        ],
        layers: ['Tile Layer 1'], 
        collisionLayers: ['Tile Layer 1'],
        belongToAct: 1,
    },
    Wave_3: {
        waveNumber: 3,
        enemies: ['BasicEnemy', 'RangedEnemy'],
        duration: 30,
        background: 'wave_3_background',
        music: 'wave_3_music',
        tilemapKey: 'tileset_wave_3', 
        tileset: [
            {name: 'gluttony_wave_3', imageKey: 'gluttony_wave_3'}, 
        ],
        layers: ['ground'],
        collisionLayers: ['ground'],
        belongToAct: 1,
    },
    Wave_4: {
        waveNumber: 4,
        enemies: ['BasicEnemy', 'RangedEnemy', 'DashEnemy'],
        duration: 35,
        background: 'wave_4_background',
        music: 'wave_4_music',
        tilemapKey: 'tileset_wave_4', 
        tileset: [
            {name: 'greed_wave_4', imageKey: 'greed_wave_4'}, 
        ],
        layers: ['Tile Layer 1'], 
        collisionLayers: ['Tile Layer 1'],
        belongToAct: 1,
    },
    Wave_5: {
        waveNumber: 5,
        enemies:['BasicEnemy', 'RangedEnemy', 'DashEnemy'],
        duration: 40,
        background: 'wave_5_background',
        music: 'wave_5_music',
        tilemapKey: 'tileset_wave_5', 
        tileset: [
            {name: 'rage_wave_5', imageKey: 'rage_wave_5'}, 
        ],
        layers: ['Tile Layer 1'],
        collisionLayers: ['Tile Layer 1'],
        belongToAct: 1,
    },
    Wave_6: {
        waveNumber: 6,
        enemies: ['BasicEnemy', 'RangedEnemy', 'DashEnemy', 'TankEnemy'],
        duration: 45,
        background: 'wave_6_background',
        music: 'wave_6_music',
        tilemapKey: 'tileset_wave_6', 
        tileset: [
            {name: 'heresy_wave_6', imageKey: 'heresy_wave_6'}, 
        ],
        layers: ['Tile Layer 1'],
        collisionLayers: ['Tile Layer 1'],
        belongToAct: 1,
    },
    Wave_7: {
        waveNumber: 7,
        enemies: ['BasicEnemy', 'RangedEnemy', 'DashEnemy', 'TankEnemy'],
        duration: 50,
        background: 'wave_7_background',
        music: 'wave_7_music',
        tilemapKey: 'tileset_wave_7', 
        tileset: [
            {name: 'violence_wave_7', imageKey: 'violence_wave_7'}, 
        ],
        layers: ['Tile Layer 1'],
        collisionLayers: ['Tile Layer 1'], 
        belongToAct: 1,
    },
    Wave_8: {
        waveNumber: 8,
        enemies: ['BasicEnemy', 'RangedEnemy', 'DashEnemy', 'TankEnemy'],
        duration: 55,
        background: 'wave_8_background',
        music: 'wave_8_music',
        tilemapKey: 'tileset_wave_8', 
        tileset: [
            {name: 'fraud_wave_8', imageKey: 'fraud_wave_8'}, 
        ],
        layers: ['Tile Layer 1'],
        collisionLayers: ['Tile Layer 1'],
        belongToAct: 1,
    },
    Wave_9: {
        waveNumber: 9,
        enemies: ['BasicEnemy', 'RangedEnemy', 'DashEnemy', 'TankEnemy', 'BossEnemy'],
        duration: 60,
        background: 'wave_9_background',
        music: 'wave_9_music',
        tilemapKey: 'tileset_wave_9', 
        tileset: [
            {name: 'betrayel_wave_9', imageKey: 'betrayel_wave_9'}, 
        ],
        layers: ['Tile Layer 1'],
        collisionLayers: ['Tile Layer 1'],
        belongToAct: 1,
    },
}
