export const CUTSCENES = {
    cutscene1: {
      backgroundKey: 'cutscene1',
      texto: 'ERA UMA NUM TEMPO DE SECA BRABA, QUANDO ATÉ A ESPERANÇA QUEIMAVA, LAMPIÃO ENCONTROU A MORTE… MAS SUA JORNADA ESTAVA LONGE DE ACABAR.',
      duracao: 6000,
      proximaCena: 'CharacterSelectScene'
    },
    cutscene2: {
      backgroundKey: 'cutscene2',
      texto: 'LAMPIÃO, TUA HORA CHEGOU, MAS O JUÍZO AINDA NÃO FOI FEITO. QUERES UMA SEGUNDA CHANCE? TERÁS QUE ATRAVESSAR O ALÉM-SERTÃO E PROVAR TEU VALOR.',
      duracao: 6000,
      proximaCena: 'CutscenesScene',
      nextCutscene: 'cutscene3'
    },
    cutscene3: {
      backgroundKey: 'cutscene3',
      texto: 'O PRIMEIRO PASSO DA JORNADA SERÁ ATRAVESSAR O INFERNO.',
      duracao: 6000,
      proximaCena: 'gameScene',
      waveKey: 'Wave_1'
    },
    cutscene4: {
      backgroundKey: 'cutscene4',
      texto: 'A TERRA CASTIGADA SENTE O PESO DA REDENÇÃO. O PORTAO FINALMENTE SE ABRE PARA A REDENÇÃO',
      duracao: 6000,
      proximaCena: 'endScene'
    }
  };
  