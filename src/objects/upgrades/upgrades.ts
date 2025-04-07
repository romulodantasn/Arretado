import { gameOptions } from '../../config/gameOptionsConfig';

export interface UpgradeOption {
  name: string;
  type: 'damage' | 'life' | 'moveSpeed' | 'lucky';
  description: string;
  sentence: string;
  cost: number;
  effect: () => void;
}

export const damageItems: UpgradeOption[] = [
  {
    name: 'Cuscuz',
    type: 'damage',
    description: '+10 de Dano',
    sentence: 'Sustança na veia  e força no braço',
    cost: 10,
    effect: () => {
      // Implement the effect of this upgrade
      console.log(`${name} effect applied!`);
      console.log('Dano aumentado');
      gameOptions.playerDamage += 10;
    },
  },
  {
    name: 'Chifre',
    type: 'damage',
    description: '+30% de Velocidade',
    sentence: 'Gaia é o que dá a força',
    cost: 15,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Dano aumentado');
      gameOptions.playerDamage += 20;
    },
  },
  {
    name: 'Cachaça',
    type: 'damage',
    description: '+ 20 de Dano no final de cada onda',
    sentence: 'Dizem que dá sorte ou azar, depende de como cair.',
    cost: 20,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Dano aumentado');
      gameOptions.playerDamage += 1;
    },
  },
  {
    name: 'Espora de Aço',
    type: 'damage',
    description: '10% De chance de crítico',
    sentence: 'Dizem que dá sorte ou azar, depende de como cair.',
    cost: 20,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Dano aumentado');
      gameOptions.playerDamage += 1;
    },
  },
  {
    name: 'Pimenta Malagueta',
    type: 'damage',
    description: '10% De chance de crítico',
    sentence: 'Dizem que dá sorte ou azar, depende de como cair.',
    cost: 20,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Dano aumentado');
      gameOptions.playerDamage += 1;
    },
  },
];

export const lifeItems: UpgradeOption[] = [
  {
    name: 'Bodega de Seu Lunga',
    type: 'life',
    description: 'Restaura 50% de Vida ao final de cada onda',
    sentence: 'Sustança na veia  e força no braço',
    cost: 200,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Health restored!');
      gameOptions.playerHealth += 50;
    },
  },
  {
    name: 'Chapeu de Couro',
    type: 'life',
    description: '+30 de Vida',
    sentence: 'Gaia é o que dá a força',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Movement speed increased!');
      gameOptions.playerHealth += 30;
    },
  },
  {
    name: 'Mandinga de Velho',
    type: 'life',
    description: 'Chance de evitar a morte uma vez por onda',
    sentence: 'Dizem que dá sorte ou azar, depende de como cair.',
    cost: 250,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Manginga escolhida! ');
      gameOptions.playerHealth += 20;
    },
  },
  {
    name: 'Rapadura',
    type: 'life',
    description: '+20 de vida',
    sentence: 'É sweet mas não é soft não.',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Damage increased!');
      gameOptions.playerHealth += 20;
    },
  },
  {
    name: 'Mocotó Reforçado',
    type: 'life',
    description: '+ 35 de vida',
    sentence: 'Tu vai negar ?',
    cost: 20,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Damage increased!');
      gameOptions.playerHealth += 35;
    },
  },
];

export const moveSpeedItems: UpgradeOption[] = [
  {
    name: 'Pé de pano',
    type: 'moveSpeed',
    description: '+30% de Velocidade de Movimento',
    sentence: 'Foi Por Essa Droga Que Você Se Apaixonou Pé De Pano?',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Movespeed item choosed!');
      gameOptions.playerMoveSpeed += 30;
    },
  },
  {
    name: 'Alperacata de Couro',
    type: 'moveSpeed',
    description: '+10% de Velocidade de Movimento',
    sentence: 'De couro e confiável',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Movement speed increased!');
      gameOptions.playerMoveSpeed += 300;
    },
  },
  {
    name: 'Guaraná Jesus',
    type: 'moveSpeed',
    description: '+25% de velocidade por 10s após beber, depois -10% de velocidade',
    sentence: 'Adocica meu amor',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Item escolhido! ');
      gameOptions.playerMoveSpeed += 20;
    },
  },
  {
    name: 'Poeira Levantada',
    type: 'moveSpeed',
    description: '+20 de MoveSpeed',
    sentence: 'Oque que há velhinho?',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Damage increased!');
      gameOptions.playerMoveSpeed += 20;
    },
  },
  {
    name: 'Patuá de São Jorge',
    type: 'moveSpeed',
    description: '+35 de MoveSpeed',
    sentence: 'Para que meus inimigos tendo pés não me alcancem',
    cost: 200,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Damage increased!');
      gameOptions.playerMoveSpeed += 35;
    },
  },
];

export const luckyItems: UpgradeOption[] = [
  {
    name: 'Olho de Cobra Coral',
    type: 'lucky',
    description: '+5% de Crítico',
    sentence: 'Veneno bom é o da tua cobra',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Movespeed item choosed!');
      gameOptions.playerLucky += 30;
    },
  },
  {
    name: 'Cordel do Destino',
    type: 'lucky',
    description: '+10% de Crítico',
    sentence: 'A vida toda num papel',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Movement speed increased!');
      gameOptions.playerLucky += 300;
    },
  },
  {
    name: 'Dado de Cangaceiro',
    type: 'lucky',
    description: 'Críticos causam +50% de dano',
    sentence: 'Dado de 6 lados, 1 lado é a morte',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Item escolhido! ');
      gameOptions.playerLucky += 50;
    },
  },
  {
    name: 'Ferradura Virada',
    type: 'lucky',
    description: '+10% de chance de critico',
    sentence: 'Dizem que dá sorte ou azar, depende de como cair',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Lucky increased!');
      gameOptions.playerLucky += 20;
    },
  },
  {
    name: 'Figa de Guiné',
    type: 'lucky',
    description: '+15% de chance de critico apos ficar com pouca vida',
    sentence: 'Para que meus inimigos tendo pés não me alcancem',
    cost: 200,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Damage increased!');
      gameOptions.playerLucky += 15;
    },
  },
];
