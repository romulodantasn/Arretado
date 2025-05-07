import { scaleEnemyBaseStats } from "./scaleEnemy";
import { EnemyTemplates, EnemyType } from "./enemiesContainer";
import { DEFAULT_WAVE_TIMER } from "./GameManager"; 
import { WaveConfig } from "./wavesContainer";

export interface WaveEnemy{
    name: EnemyType;
    stats: ReturnType<typeof scaleEnemyBaseStats >;
}




export function generateWave(waveNumber: number): WaveConfig {
    const enemyTypesInitializing = initializeEnemyForWave(waveNumber);
    const enemies: WaveEnemy[] = enemyTypesInitializing.map( name => ({
        name,
        stats: scaleEnemyBaseStats(EnemyTemplates[name], waveNumber), // Escala os inimigos de acordo com a onda
    }))
  return {
    enemies,
    duration: DEFAULT_WAVE_TIMER, // Use the imported constant
    background: `wave_${waveNumber}_background`, // Imagem de fundo da onda
    music: `wave_${waveNumber}_music`, // Música da onda
    currentWaveText: waveNumber,
    currentActText: 1,
  }
}

function initializeEnemyForWave(waveNumber:number) : EnemyType[] {
  let enemyType: EnemyType[] = ['BasicEnemy'];
  if (waveNumber >= 2) {
    enemyType.push('RangedEnemy');
  }
  if (waveNumber >= 4) {
    enemyType.push('DashEnemy')
  }
  if (waveNumber >= 6) {
    enemyType.push('TankEnemy')
  }
  if (waveNumber == 9) {
      enemyType.push('BossEnemy')
  }
  return enemyType;
}

// export function advanceToNextWave() {
//   GlobalWaveNumber++;
//     // Lógica para fim de jogo ou loop (ex: após 9 ondas)
//   if (GlobalWaveNumber > TOTAL_WAVES) {
//     console.log("Todas as ondas completas! Reiniciando para Ato 1, Onda 1.");
//       // Implementar cutscene final aqui
//     GlobalWaveNumber = 1; 
//   }
//   GlobalActNumber = Math.floor((GlobalWaveNumber - 1) / WAVES_PER_ACT) + 1;
//   console.log(`Avançando para: Ato ${GlobalActNumber}, Onda ${GlobalWaveNumber}`);
// }

export const WAVES: WaveConfig[] = [];
for (let i = 1; i <= 9; i++) {
  WAVES.push(generateWave(i));
}