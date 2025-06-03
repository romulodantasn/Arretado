import { gameOptions, waveIndicator } from '../../config/GameOptionsConfig';
import { playerStats } from '../../config/player/PlayerConfig';
import { currentEnemyStats, EnemyType } from '../../config/enemies/EnemiesContainer';

export const gameResetEvents = {
  resetGame: 'resetGame'
} as const;

export function resetGameState() {
  playerStats.Health = 10;
  playerStats.Damage = 6;
  playerStats.MoveSpeed = 400;
  playerStats.Lucky = 0;
  playerStats.CoinGame = 0;

  waveIndicator.currentWave = 1;
  waveIndicator.currentAct = 1;

  (Object.keys(currentEnemyStats) as EnemyType[]).forEach(enemyType => {
    const enemy = currentEnemyStats[enemyType];
    if (enemy) {
      enemy.Speed = enemy.Speed;
      enemy.Rate = enemy.Rate;
    }
  });
}

export function completeGameReset() {
  localStorage.clear();
  
  resetGameState();
  
  window.location.reload();
} 