import Phaser from "phaser";
import { gameHud } from "../ui/gameHudUi";
import { waveIndicator } from "../../config/GameOptionsConfig";

export class nextPhaseScene extends Phaser.Scene {
  constructor() {
    super({
      key: "nextPhaseScene",
    });
  }

  create() {
    this.nextPhase();
    this.scene.stop("gameScene");
    if (this.scene.isActive("gameHud")) {
      this.scene.stop("gameHud");
    }
    if (this.scene.isActive("PlayerHealthBar")) {
      this.scene.stop("PlayerHealthBar");
    }
    if (this.scene.isActive("PauseScene")) {
      this.scene.stop("PauseScene");
    }
    this.input.enabled = false;
    this.input.setDefaultCursor("none");
  }

  public nextPhase() {
    const hudScene = this.scene.get("gameHud") as gameHud;
    const textStyle = {
      fontFamily: "Cordelina",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    };
    const nextPhaseText = [
      "Eita caba danado! Sobreviveu! Avançando para a próxima fase...",
    ];
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 3, nextPhaseText, textStyle)
      .setFontSize(36)
      .setAlign("center")
      .setOrigin(0.5);

    if (hudScene) {
      // The wave progression is now handled by onWaveComplete in waveManager.ts
      // This line is no longer needed here as it duplicates the logic.
      // hudScene.advanceWaveCount();
    }

    this.time.delayedCall(2000, () => {
      this.scene.stop("nextPhaseScene");
      // Pass the current wave and act to the itemScene so it can determine the next gameScene wave
      // waveIndicator is already updated by waveManager.onWaveComplete, so just pass its current state.
      this.scene.start("itemScene", { 
        currentWave: waveIndicator.currentWave, 
        currentAct: waveIndicator.currentAct 
      });
    });

    console.log("Avançando para a próxima fase..");
  }

  shutdown() {
    this.events.removeAllListeners();
    this.input.keyboard?.removeAllListeners();
  }
}


