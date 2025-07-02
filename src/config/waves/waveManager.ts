import { gameOptions } from "../GameOptionsConfig";
import { applyWaveBuffs } from "../enemies/ScaleEnemies";
import { waveIndicator } from "../GameOptionsConfig";
import { WaveNumbers, Waves } from "./wavesContainer";
import { globalEventEmitter } from "../../components/events/globalEventEmitter";

export class WaveManager {
  private static defaultWaveKey: WaveNumbers = 'Wave_1';

  static getWaveData(waveKey?: WaveNumbers): WaveData {
    const key = waveKey && Waves[waveKey] ? waveKey : this.defaultWaveKey;
    return Waves[key];
  }

  static getWaveKey(index: number, act: number): WaveNumbers {
    if (act === 1) {
      return `Wave_${index}` as WaveNumbers;
    } else if (act === 2) {
      return `Wave_${index}_Act2` as WaveNumbers;
    } else if (act === 3) {
      return `Wave_${index}_Act3` as WaveNumbers;
    }
    return 'Wave_1'; // Fallback
  }

  static getCurrentWave(): number {
    return waveIndicator.currentWave;
  }

  static getCurrentAct(): number {
    return waveIndicator.currentAct;
  }
}

export function onWaveComplete() {
  const currentWaveKey = WaveManager.getWaveKey(waveIndicator.currentWave, waveIndicator.currentAct);
  const nextWaveKey = getNextWaveKey(currentWaveKey);
  const nextWaveData = WaveManager.getWaveData(nextWaveKey);

  waveIndicator.currentWave = nextWaveData.waveNumber;
  waveIndicator.currentAct = nextWaveData.belongToAct;
  
  applyWaveBuffs(waveIndicator.currentWave);
  globalEventEmitter.emit('waveCompletedAndAdvance'); // Emit event to trigger scene transition
}

export function getNextWaveKey(currentKey: WaveNumbers): WaveNumbers {
  const waveOrder: WaveNumbers[] = [
    'Wave_1', 'Wave_2', 'Wave_3', 'Wave_4', 'Wave_5', 'Wave_6', 'Wave_7', 'Wave_8', 'Wave_9',
    'Wave_1_Act2', 'Wave_2_Act2', 'Wave_3_Act2',
    'Wave_1_Act3'
  ];
  const idx = waveOrder.indexOf(currentKey);
  if (idx === -1) return 'Wave_1';
  if (idx + 1 >= waveOrder.length) return 'Wave_1_Act3'; // End of game, loop or final scene
  return waveOrder[idx + 1];
}

type WaveData = typeof Waves[WaveNumbers];

// Listen for boss killed event to trigger wave completion
globalEventEmitter.on('bossKilled', () => {
  onWaveComplete();
});




