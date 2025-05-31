export interface BaseEnemyStatsStructure {
    name: string,
    Health: number,
    Speed: number,
    Rate: number,
    Damage: number,
    FireRate?: number,
    BulletSpeed?: number,
    BulletDamage?: number,
    DashCooldown?: number,
}
export function getEnemyStats(type: EnemyType) {
  return EnemyTemplates[type];
}

export type EnemyType = 'BasicEnemy' | 'RangedEnemy' | 'DashEnemy' | 'TankEnemy' | 'BossEnemy';

export const EnemyTemplates: Record<EnemyType, BaseEnemyStatsStructure> = {
  BasicEnemy: {
    name: 'BasicEnemy',
    Health: 12,
    Speed: 50,
    Rate: 1500,
    Damage: 3,
  },
  RangedEnemy: {
    name: 'RangedEnemy',
    Health: 17,
    BulletSpeed: 250,
    Speed: 35,
    Rate: 1200,
    Damage: 4,
    FireRate: 6000,
  },
  DashEnemy: {
    name: 'DashEnemy',
    Health: 8,
    Speed: 125,
    Rate: 1400,
    Damage: 5,
    DashCooldown: 4000, //-> Milisegundos 
  },
  TankEnemy: {
    name: 'TankEnemy',
    Health: 10,
    Speed: 35,
    Rate: 1500,
    Damage: 7,
  },
  BossEnemy: {
    name: 'BossEnemy',
    Health: 3000,
    Speed: 20,
    BulletSpeed: 450,
    BulletDamage: 20,
    Damage: 15,
    FireRate: 5000,
    Rate: 1000,
  },
} as const;

export const currentEnemyStats: Record<EnemyType, BaseEnemyStatsStructure> = 
  JSON.parse(JSON.stringify(EnemyTemplates));


export type EnemyTypes = keyof typeof EnemyTemplates;
export type EnemyStats = typeof EnemyTemplates[EnemyTypes];