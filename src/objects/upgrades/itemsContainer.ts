import { playerStats } from '../../config/gameOptionsConfig';

export interface itemsContainer {
  imageKey: string;
  name: string;
  type: 'dano' | 'vida' | 'Velocidade' | 'sorte';
  description: string;
  sentence: string;
  cost: number;
  effect: () => void;
}

export const damageItems: itemsContainer[] = [
  {
    imageKey: 'munguza',
    name: 'Munguzá',
    type: 'dano',
    description: '+10 de Dano',
    sentence: '"Sustança na veia  e força no braço"',
    cost: 10,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Dano aumentado');
      playerStats.playerDamage += 10;
    },
  },
  {
    imageKey: 'chifre',
    name: 'Chifre',
    type: 'dano',
    description: '+30 de Dano',
    sentence: '"É chifre, mas é power-up. Força dos corno é descomunal."',
    cost: 15,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Dano aumentado');
      playerStats.playerDamage += 20;
    },
  },
  {
    imageKey: 'pitu',
    name: 'Pitu',
    type: 'dano',
    description: '+ 20 de Dano no final de cada onda',
    sentence: '"Depois de uma dose de Pitú, ninguém segura o caba!"',
    cost: 20,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Dano aumentado');
      playerStats.playerDamage += 20;
    },
  },
  {
    imageKey: 'esporaDeAco',
    name: 'Espora de Aço',
    type: 'dano',
    description: '+10 de dano',
    sentence: '"Com uma espora dessas, até um djabo corre de medo!"',
    cost: 20,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Dano aumentado');
      playerStats.playerDamage += 10;
    },
  },
  {
    imageKey: 'pimenta',
    name: 'pimenta',
    type: 'dano',
    description: '+10 de dano',
    sentence: '"Arde mais que briga de vizinho com som alto no domingo."',
    cost: 20,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Dano aumentado');
      playerStats.playerDamage += 10;
    },
  },
];

export const lifeItems: itemsContainer[] = [
  {
    imageKey: 'bodega',
    name: 'Bodega',
    type: 'vida',
    description: 'Restaura 50% de Vida ao final de cada onda',
    sentence: '"Mais forte que café coado em pano de chão"',
    cost: 200,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Health restored!');
      playerStats.playerHealth += 50;
    },
  },
  {
    imageKey: 'chapeu',
    name: 'Chapéu',
    type: 'vida',
    description: '+30 de Vida',
    sentence: '"Proteção de cabeça e alma, igual chapéu de cangaceiro"',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Movement speed increased!');
      playerStats.playerHealth += 30;
    },
  },
  {
    imageKey: 'mandiga',
    name: 'Mandiga de velho',
    type: 'vida',
    description: 'Chance de evitar a morte uma vez por onda',
    sentence: '"Só morre se quiser, com mandinga dessas até encosto foge"',
    cost: 250,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Manginga escolhida! ');
      playerStats.playerHealth += 20;
    },
  },
  {
    imageKey: 'rapadura',
    name: 'Rapadura',
    type: 'vida',
    description: '+20 de vida',
    sentence: '"É sweet mas não é soft não."',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Damage increased!');
      playerStats.playerHealth += 20;
    },
  },
  {
    imageKey: 'mocoto',
    name: 'Mocotó',
    type: 'vida',
    description: '+ 35 de vida',
    sentence: '"Com esse mocotó tu aguenta até missa de ressaca."',
    cost: 20,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Damage increased!');
      playerStats.playerHealth += 35;
    },
  },
];

export const moveSpeedItems: itemsContainer[] = [
  {
    imageKey: 'peDePano',
    name: 'Pé de Pano',
    type: 'Velocidade',
    description: '+30% de Velocidade de Movimento',
    sentence: '"Foi por essa droga que você se apaixonou, Pé de Pano?"',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Movespeed item choosed!');
      playerStats.playerMoveSpeed += 30;
    },
  },
  {
    imageKey: 'sandaliaJesus',
    name: 'sandaliaJesus',
    type: 'Velocidade',
    description: '+10% de Velocidade de Movimento',
    sentence: '"Corre mais que notícia ruim no grupo do zap"',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Movement speed increased!');
      playerStats.playerMoveSpeed += 300;
    },
  },
  {
    imageKey: 'guaranaJesus',
    name: 'guaranaJesus',
    type: 'Velocidade',
    description: '+25% de velocidade por 10s após beber, depois -10% de velocidade',
    sentence: '"Igual promessa de político, primeiro adoça, depois derruba."',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Item escolhido! ');
      playerStats.playerMoveSpeed += 20;
    },
  },
  {
    imageKey: 'poeira',
    name: 'poeira',
    type: 'Velocidade',
    description: '+20 de MoveSpeed',
    sentence: '"Oque que há velhinho?"',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Damage increased!');
      playerStats.playerMoveSpeed += 20;
    },
  },
  {
    imageKey: 'patuaSaoJorge',
    name: 'patuaSaoJorge',
    type: 'Velocidade',
    description: '+35 de MoveSpeed',
    sentence: '"Para que meus inimigos tendo pés não me alcancem"',
    cost: 200,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Damage increased!');
      playerStats.playerMoveSpeed += 35;
    },
  },
];

export const luckyItems: itemsContainer[] = [
  {
    imageKey: 'olhoDeCobra',
    name: 'Olho de Cobra',
    type: 'sorte',
    description: '+5% de Crítico',
    sentence: '"Veneno bom é o da tua cobra"',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Lucky item choosed!');
      playerStats.playerLucky += 30;
    },
  },
  {
    imageKey: 'cordel',
    name: 'cordel',
    type: 'sorte',
    description: '+10% de Crítico',
    sentence: '"Cordel escrito à mão, destino traçado com emoção!"',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Movement speed increased!');
      playerStats.playerLucky += 300;
    },
  },
  {
    imageKey: 'dadoCangaceiro',
    name: 'dadoCangaceiro',
    type: 'sorte',
    description: 'Críticos causam +50% de dano',
    sentence: '"Dado de 6 lados, 1 lado é a morte"',
    cost: 50,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Item escolhido! ');
      playerStats.playerLucky += 50;
    },
  },
  {
    imageKey: 'ferradura',
    name: 'ferradura',
    type: 'sorte',
    description: '+10% de chance de critico',
    sentence: '"Dizem que dá sorte ou azar, depende de como cair"',
    cost: 100,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Lucky increased!');
      playerStats.playerLucky += 20;
    },
  },
  {
    imageKey: 'guine',
    name: 'guine',
    type: 'sorte',
    description: '+15% de chance de critico apos ficar com pouca vida',
    sentence: '"Fica fraco, mas vira bicho"',
    cost: 200,
    effect: () => {
      // Implement the effect of this upgrade
      console.log('Lucky increased!');
      playerStats.playerLucky += 15;
    },
  },
];
