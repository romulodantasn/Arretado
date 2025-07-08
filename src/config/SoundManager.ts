export class SoundManager {
  static events = new Phaser.Events.EventEmitter();
  private static currentWaveMusic?: Phaser.Sound.BaseSound;
  private static isInGameScene: boolean = false;

  static titleSceneAudio: Phaser.Sound.BaseSound;
  static enterStoreSFX: Phaser.Sound.BaseSound;
  static openItemStoreSFX: Phaser.Sound.BaseSound;
  static uiChangeMenuSelectSFX: Phaser.Sound.BaseSound;
  static menuBackgroundSFX: Phaser.Sound.BaseSound;
  static buyItemAPSFX: Phaser.Sound.BaseSound;
  static gunShootSFX: Phaser.Sound.BaseSound;
  static selectorIconSFX: Phaser.Sound.BaseSound;
  static bahiaBuySFX: Phaser.Sound.BaseSound;
  static bossDeathSFX: Phaser.Sound.BaseSound;
  static basicEnemyDeathSFX: Phaser.Sound.BaseSound;
  static rangedEnemyDeathSFX: Phaser.Sound.BaseSound;
  static dashEnemyDeathSFX: Phaser.Sound.BaseSound;
  static tankEnemyDeathSFX: Phaser.Sound.BaseSound;
  static wave1Music: Phaser.Sound.BaseSound;
  static wave2Music: Phaser.Sound.BaseSound;
  static wave3Music: Phaser.Sound.BaseSound;
  static wave4Music: Phaser.Sound.BaseSound;
  static wave5Music: Phaser.Sound.BaseSound;
  static wave6Music: Phaser.Sound.BaseSound;
  static wave7Music: Phaser.Sound.BaseSound;
  static wave8Music: Phaser.Sound.BaseSound;
  static wave9Music: Phaser.Sound.BaseSound;
  static wave1Act3Music: Phaser.Sound.BaseSound;
  static wave1Act2Music: Phaser.Sound.BaseSound;
  static wave2Act2Music: Phaser.Sound.BaseSound;
  static wave3Act2Music: Phaser.Sound.BaseSound

  private static readonly waveMusicKeys = {
    1: 'wave1Music',
    2: 'wave2Music',
    3: 'wave3Music',
    4: 'wave4Music',
    5: 'wave5Music',
    6: 'wave6Music',
    7: 'wave7Music',
    8: 'wave8Music',
    9: 'wave9Music',
  } as const;

  static setInGameScene(value: boolean) {
    this.isInGameScene = value;
    if (!value) {
      this.stopCurrentWaveMusic();
    }
  }

  static playTitleSceneMusic() {
    this.titleSceneAudio?.play({ loop: true });
    this.events.emit('play_title_scene');
  }

  static playEnterStoreSFX() {
    this.enterStoreSFX?.play();
    this.events.emit('enter_store');
  }

  static playOpenItemStoreSFX() {
    this.openItemStoreSFX?.play();
    this.events.emit('open_item_store');
  }

  static playUIChangeMenuSelectSFX() {
    this.uiChangeMenuSelectSFX?.play();
    this.events.emit('ui_change_menu_select');
  }

  static playMenuBackgroundSFX() {
    this.menuBackgroundSFX?.play({ loop: true , volume: 0.0});
    this.events.emit('menu_background');
  }

  static playBuyItemAPSFX() {
    this.buyItemAPSFX?.play({volume: 0.15});
    this.events.emit('buy_item_ap');
  }

  static playGunShootSFX() {
    this.gunShootSFX?.play();
    this.events.emit('gun_shoot');
  }

  static playSelectorSFX() {
    this.selectorIconSFX?.play();
    this.events.emit('selector_icon');
  }

  static playBahiaBuySFX() {
    this.bahiaBuySFX?.play({ volume: 0.20 });
    this.events.emit('bahia_buy');
  }

  static playBossDeathSFX() {
    this.bossDeathSFX?.play({ volume: 0.30 });
    this.events.emit('boss_death');
  }

  static playBasicEnemyDeathSFX() {
    this.basicEnemyDeathSFX?.play({ volume: 0.15 });
    this.events.emit('basic_enemy_death');
  }

  static playRangedEnemyDeathSFX() {
    this.rangedEnemyDeathSFX?.play({ volume: 0.10 });
    this.events.emit('ranged_enemy_death');
  }

  static playDashEnemyDeathSFX() {
    this.dashEnemyDeathSFX?.play({ volume: 0.08 });
    this.events.emit('dash_enemy_death');
  }

  static playTankEnemyDeathSFX() {
    this.tankEnemyDeathSFX?.play({ volume: 0.25 });
    this.events.emit('tank_enemy_death');
  }

  static stopCurrentWaveMusic() {
    if (this.currentWaveMusic) {
      this.currentWaveMusic.stop();
      this.currentWaveMusic = undefined;
    }
  }

  static playWaveMusic(waveMusicKeyOrNumber: number | string) {
    if (!this.isInGameScene) {
      return;
    }

    this.stopCurrentWaveMusic();

    if (typeof waveMusicKeyOrNumber === 'string') {
      const musicKeyToProperty: Record<string, string> = {
        'wave_1_music': 'wave1Music',
        'wave_2_music': 'wave2Music',
        'wave_3_music': 'wave3Music',
        'wave_4_music': 'wave4Music',
        'wave_5_music': 'wave5Music',
        'wave_6_music': 'wave6Music',
        'wave_7_music': 'wave7Music',
        'wave_8_music': 'wave8Music',
        'wave_9_music': 'wave9Music',
        'wave_1_act_2_music': 'wave1Act2Music',
        'wave_2_act_2_music': 'wave2Act2Music',
        'wave_3_act_2_music': 'wave3Act2Music',
        'wave_1_act_3_music': 'wave1Act3Music',
      };
      const property = musicKeyToProperty[waveMusicKeyOrNumber];
      if (property && (this as any)[property]) {
        this.currentWaveMusic = (this as any)[property] as Phaser.Sound.BaseSound;
        (this.currentWaveMusic as Phaser.Sound.BaseSound).play({ loop: true, volume: 0.5 });
        this.events.emit(`${waveMusicKeyOrNumber}_start`);
        return;
      }
      // fallback para o comportamento antigo
      const sound = (this as any)[waveMusicKeyOrNumber] as Phaser.Sound.BaseSound;
      if (sound) {
        this.currentWaveMusic = sound;
        sound.play({ loop: true, volume: 0.5 });
        this.events.emit(`${waveMusicKeyOrNumber}_start`);
      }
      return;
    }

    const musicKey = this.waveMusicKeys[waveMusicKeyOrNumber as keyof typeof this.waveMusicKeys];
    if (musicKey) {
      const waveMusic = this[musicKey] as Phaser.Sound.BaseSound;
      if (waveMusic) {
        this.currentWaveMusic = waveMusic;
        waveMusic.play({ loop: true, volume: 0.5 });
        this.events.emit(`wave_${waveMusicKeyOrNumber}_music_start`);
      }
    }
  }

  static pauseCurrentMusic() {
    if (this.currentWaveMusic && this.currentWaveMusic.isPlaying) {
      this.currentWaveMusic.pause();
    }
  }

  static resumeCurrentMusic() {
    if (this.currentWaveMusic && this.currentWaveMusic.isPaused) {
      this.currentWaveMusic.resume();
    }
  }

 
  static init(scene: Phaser.Scene) {
    if (scene.scene.key === 'gameScene') {
      this.setInGameScene(true);
    }

    this.titleSceneAudio = scene.sound.add('titleSceneAudio');
    this.enterStoreSFX = scene.sound.add('enter_store');
    this.openItemStoreSFX = scene.sound.add('openItemStore');
    this.uiChangeMenuSelectSFX = scene.sound.add('ui_change_menu_select');
    this.menuBackgroundSFX = scene.sound.add('menuBackground');
    this.buyItemAPSFX = scene.sound.add('buyItemAP');
    this.gunShootSFX = scene.sound.add('gun_shoot');
    this.selectorIconSFX = scene.sound.add('ui_change_menu_select');
    this.bahiaBuySFX = scene.sound.add('bahiaBuy');
    this.bossDeathSFX = scene.sound.add('bossDeath');
    this.basicEnemyDeathSFX = scene.sound.add('basicEnemyDeath');
    this.rangedEnemyDeathSFX = scene.sound.add('rangedEnemyDeath');
    this.dashEnemyDeathSFX = scene.sound.add('dashEnemyDeath');
    this.tankEnemyDeathSFX = scene.sound.add('tankEnemyDeath');

    this.wave1Music = scene.sound.add('wave_1_music');
    this.wave2Music = scene.sound.add('wave_2_music');
    this.wave3Music = scene.sound.add('wave_3_music');
    this.wave4Music = scene.sound.add('wave_4_music');
    this.wave5Music = scene.sound.add('wave_5_music');
    this.wave6Music = scene.sound.add('wave_6_music');
    this.wave7Music = scene.sound.add('wave_7_music');
    this.wave8Music = scene.sound.add('wave_8_music');
    this.wave9Music = scene.sound.add('wave_9_music');
    this.wave1Act3Music = scene.sound.add('wave_1_act_3_music');
    this.wave1Act2Music = scene.sound.add('wave_1_act_2_music');
    this.wave2Act2Music = scene.sound.add('wave_2_act_2_music');
    this.wave3Act2Music = scene.sound.add('wave_3_act_2_music');

    

    scene.events.once('shutdown', () => {
      if (scene.scene.key === 'gameScene') {
        this.setInGameScene(false);
      }
    });
  }
}
