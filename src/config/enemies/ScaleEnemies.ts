import { EnemyType } from "./EnemiesContainer";
import { BaseEnemyStatsStructure } from "./EnemiesContainer";
import { currentEnemyStats } from "./EnemiesContainer";

type EnemyBuffs = Partial<Pick<BaseEnemyStatsStructure, 'Health' | 'Speed' | 'Rate' | 'Damage'>>;

const enemyBuffsByWave: Record<EnemyType, (waveNumber: number) => EnemyBuffs> = {
  BasicEnemy: (wave) => ({
    Health: 5 + wave,
    Speed: 2,
    Rate: -90,
  }),
  RangedEnemy: (wave) => ({
    Health: 3 + Math.floor(wave / 2),
    Damage: 1,
    Rate: -50,
  }),
  DashEnemy: (wave) => ({
    Health: 2,
    Speed: 3,
    Damage: wave % 2 === 0 ? 1 : 0,
    Rate: -20,
  }),
  TankEnemy: (wave) => ({
    Health: 10,
    Damage: 3,
    Speed: 1,
    Rate: -30,
  }),
  BossEnemy: (wave) => ({
    Health: 15 + wave * 2,
    Damage: 2,
  }),
};

export function applyWaveBuffs(waveNumber: number) {
    Object.keys(currentEnemyStats).forEach((enemyKey) => {
      const type = enemyKey as EnemyType;
      const buffs = enemyBuffsByWave[type]?.(waveNumber);
      const stats = currentEnemyStats[type];
  
      if (buffs) {
        if (buffs.Health !== undefined) stats.Health += buffs.Health;
        if (buffs.Speed !== undefined) stats.Speed += buffs.Speed;
        if (buffs.Rate !== undefined) stats.Rate = Math.max(100, stats.Rate + buffs.Rate);
        if (buffs.Damage !== undefined) stats.Damage += buffs.Damage;
      }
    });
  }
  
