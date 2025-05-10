
import { gameOptions } from "./gameOptionsConfig";
import { applyWaveBuffs } from "./scaleEnemies";
import { waveIndicator } from "./gameOptionsConfig";
import { WaveNumbers, Waves } from '../config/wavesContainer';

export class WaveManager {
  private static defaultWaveKey: WaveNumbers = 'Wave_1';

  static getWaveData(waveKey?: WaveNumbers): WaveData {
    const key = waveKey && Waves[waveKey] ? waveKey : this.defaultWaveKey;
    return Waves[key];
  }

  static getWaveKey(index: number): WaveNumbers {
    return `Wave_${index}` as WaveNumbers;
  }

  static getCurrentWave(): number {
    return waveIndicator.currentWave;
  }
}

export function onWaveComplete() {
  waveIndicator.currentWave++;
  applyWaveBuffs(waveIndicator.currentWave)
}


type WaveData = typeof Waves[WaveNumbers];

