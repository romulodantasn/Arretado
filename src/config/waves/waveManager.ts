
import { gameOptions } from "../GameOptionsConfig";
import { applyWaveBuffs } from "../enemies/ScaleEnemies";
import { waveIndicator } from "../GameOptionsConfig";
import { WaveNumbers, Waves } from "./wavesContainer";

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

