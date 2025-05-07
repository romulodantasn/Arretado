export interface BaseEnemyStatsStructure {
    name: string,
    Health: number,
    Speed: number,
    Rate: number,
    Damage: number,
    FireRate?: number,
    DashCooldown?: number,
}

export type EnemyType = 'BasicEnemy' | 'RangedEnemy' | 'DashEnemy' | 'TankEnemy' | 'BossEnemy';

export const EnemyTemplates: Record<EnemyType, BaseEnemyStatsStructure> = {
  BasicEnemy: {
    name: 'BasicEnemy',
    Health: 20,
    Speed: 50,
    Rate: 1000,
    Damage: 1,
  },
  RangedEnemy: {
    name: 'RangedEnemy',
    Health: 10,
    Speed: 45,
    Rate: 2000,
    Damage: 2,
    FireRate: 10,
  },
  DashEnemy: {
    name: 'DashEnemy',
    Health: 8,
    Speed: 65,
    Rate: 1800,
    Damage: 5,
    DashCooldown: 6000, //-> Milisegundos 
  },
  TankEnemy: {
    name: 'TankEnemy',
    Health: 45,
    Speed: 35,
    Rate: 2600,
    Damage: 4,
  },
  BossEnemy: {
    name: 'BossEnemy',
    Health: 100,
    Speed: 25,
    Damage: 10,
    Rate: 1000,
  },
} as const;

export type EnemyTypes = keyof typeof EnemyTemplates;
export type EnemyStats = typeof EnemyTemplates[EnemyTypes];

  
  // export function onWaveComplete() {
  //   gameOptions.currentWave++;
  //   BasicEnemy.Rate -= 50;
  //   BasicEnemy.Speed += 10;
  //   GameManager.timerLeft+=5;
  // }t