import { WaveEnemy } from "./waveManager";

export interface WaveConfig {
    waveNumber: number; // número da onda
    enemies: WaveEnemy[]; // tipos de inimigos que aparecem na onda
    duration: number; // duração da onda em segundos
    background: string; // imagem de fundo da onda
    music: string; // música da onda
    belongToAct : number; // Ato a qual a onda pertence 
}

export type WaveNumbers = 'Wave_1' | 'Wave_2' | 'Wave_3' | 'Wave_4' | 'Wave_5' | 'Wave_6' | 'Wave_7' | 'Wave_8' | 'Wave_9';

export const Waves : Record<WaveNumbers, WaveConfig> = {
    Wave_1: {
        waveNumber: 1,
        enemies: ['BasicEnemy'],
        duration: 20,
        background: 'wave_1_background',
        music: 'wave_1_music',
        belongToAct: 1,
    },
    Wave_2: {
        waveNumber: 2,
        enemies: ['BasicEnemy'],
        duration: 20,
        background: 'wave_2_background',
        music: 'wave_2_music',
        belongToAct: 1,
    },
    Wave_3: {
        waveNumber: 3,
        enemies: ['BasicEnemy', 'RangedEnemy'],
        duration: 20,
        background: 'wave_3_background',
        music: 'wave_3_music',
        belongToAct: 1,
    },
    Wave_4: {
        waveNumber: 1,
        enemies: ['BasicEnemy'],
        duration: 20,
        background: 'wave_1_background',
        music: 'wave_1_music',
        belongToAct: 1,
    },
    Wave_5: {
        waveNumber: 1,
        enemies: ['BasicEnemy'],
        duration: 20,
        background: 'wave_1_background',
        music: 'wave_1_music',
        belongToAct: 1,
    },
    Wave_6: {
        waveNumber: 1,
        enemies: ['BasicEnemy'],
        duration: 20,
        background: 'wave_1_background',
        music: 'wave_1_music',
        belongToAct: 1,
    },
    Wave_7: {
        waveNumber: 1,
        enemies: ['BasicEnemy'],
        duration: 20,
        background: 'wave_1_background',
        music: 'wave_1_music',
        belongToAct: 1,
    },
    Wave_8: {
        waveNumber: 1,
        enemies: ['BasicEnemy'],
        duration: 20,
        background: 'wave_1_background',
        music: 'wave_1_music',
        belongToAct: 1,
    },
    Wave_9: {
        waveNumber: 1,
        enemies: ['BasicEnemy'],
        duration: 20,
        background: 'wave_1_background',
        music: 'wave_1_music',
        belongToAct: 1,
    },
}

