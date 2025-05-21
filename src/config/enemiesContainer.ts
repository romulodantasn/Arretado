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
    Health: 20,
    Speed: 50,
    Rate: 1000,
    Damage: 1,
  },
  RangedEnemy: {
    name: 'RangedEnemy',
    Health: 10,
    BulletSpeed: 350,
    Speed: 45,
    Rate: 1000,
    Damage: 2,
    FireRate: 6000,
  },
  DashEnemy: {
    name: 'DashEnemy',
    Health: 8,
    Speed: 65,
    Rate: 1000,
    Damage: 5,
    DashCooldown: 6000, //-> Milisegundos 
  },
  TankEnemy: {
    name: 'TankEnemy',
    Health: 45,
    Speed: 35,
    Rate: 1000,
    Damage: 4,
  },
  BossEnemy: {
    name: 'BossEnemy',
    Health: 30000,
    Speed: 25,
    BulletSpeed: 450,
    BulletDamage: 20,
    Damage: 10,
    FireRate: 4000,
    Rate: 1000,
  },
} as const;

// Cria uma cópia mutável dos atributos dos inimigos
export const currentEnemyStats: Record<EnemyType, BaseEnemyStatsStructure> = 
  JSON.parse(JSON.stringify(EnemyTemplates));


export type EnemyTypes = keyof typeof EnemyTemplates;
export type EnemyStats = typeof EnemyTemplates[EnemyTypes];