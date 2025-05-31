import { gun } from '../../config/GameOptionsConfig';
import { playerStats } from '../../config/player/PlayerConfig';

export interface itemsContainer {
  imageKey: string;
  name: string;
  type: 'dano' | 'vida' | 'Velocidade' | 'Fire Rate';
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
      console.log(`${name} Comprado, Dano aumentado`);
      gun.gunDamage += 3;
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
      console.log(`${name} Comprado, Dano aumentado`);
      gun.gunDamage += 5;
    },
  },
  {
    imageKey: 'pitu',
    name: 'Pitu',
    type: 'dano',
    description: '+ 20 de Dano',
    sentence: '"Depois de uma dose de Pitú, ninguém segura o caba!"',
    cost: 18,
    effect: () => {
      console.log(`${name} Comprado, Dano aumentado`);
      gun.gunDamage += 8;
    },
  },
  {
    imageKey: 'esporaDeAco',
    name: 'Espora de Aço',
    type: 'dano',
    description: '+10 de dano',
    sentence: '"Com uma espora dessas, até um djabo corre de medo!"',
    cost: 36,
    effect: () => {
      console.log(`${name} Comprado, Dano aumentado`);
      gun.gunDamage += 17;
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
      console.log(`${name} Comprado, Dano aumentado`);
      gun.gunDamage += 10;
    },
  },
];

export const lifeItems: itemsContainer[] = [
  {
    imageKey: 'bodega',
    name: 'Bodega',
    type: 'vida',
    description: '+50 de Vida',
    sentence: '"Mais forte que café coado em pano de chão"',
    cost: 400,
    effect: () => {
      console.log(`${name} Comprado, Vida aumentada`);
      playerStats.Health += 50;
    },
  },
  {
    imageKey: 'chapeu',
    name: 'Chapéu',
    type: 'vida',
    description: '+30 de Vida',
    sentence: '"Proteção de cabeça e alma, igual chapéu de cangaceiro"',
    cost: 150,
    effect: () => {
      console.log(`${name} Comprado, Vida aumentada`);
      playerStats.Health += 30;
    },
  },
  {
    imageKey: 'mandiga',
    name: 'Mandiga de velho',
    type: 'vida',
    description: '+20 de Vida',
    sentence: '"Só morre se quiser, com mandinga dessas até encosto foge"',
    cost: 120,
    effect: () => {
      console.log(`${name} Comprado, Vida aumentada`);
      playerStats.Health += 20;
    },
  },
  {
    imageKey: 'manga',
    name: 'Manga',
    type: 'vida',
    description: '+20 de vida',
    sentence: '"Manguinha docinha pra nois comer"',
    cost: 100,
    effect: () => {
      console.log(`${name} Comprado, Vida aumentada`);
      playerStats.Health += 20;
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
      console.log(`${name} Comprado, Vida aumentada`);
      playerStats.Health += 35;
    },
  },
];

export const moveSpeedItems: itemsContainer[] = [
  {
    imageKey: 'peDePano',
    name: 'Pé de Pano',
    type: 'Velocidade',
    description: '+15% de Velocidade de Movimento',
    sentence: '"Foi por essa droga que você se apaixonou, Pé de Pano?"',
    cost: 25,
    effect: () => {
      console.log(`${name} Comprado, MoveSpeed aumentada`);
      playerStats.MoveSpeed += 15;
    },
  },
  {
    imageKey: 'sandaliaJesus',
    name: 'Sandália de Jesus',
    type: 'Velocidade',
    description: '+25% de Velocidade de Movimento',
    sentence: '"Corre mais que notícia ruim no grupo do zap"',
    cost: 40,
    effect: () => {
      console.log(`${name} Comprado, MoveSpeed aumentada`);
      playerStats.MoveSpeed += 25;
    },
  },
  {
    imageKey: 'guaranaJesus',
    name: 'Guaraná Jesus',
    type: 'Velocidade',
    description: '+40% de Velocidade de Movimento',
    sentence: '"Igual promessa de político, primeiro adoça, depois derruba."',
    cost: 65,
    effect: () => {
      console.log(`${name} Comprado, MoveSpeed aumentada`);
      playerStats.MoveSpeed += 40;
    },
  },
  {
    imageKey: 'poeira',
    name: 'Poeira',
    type: 'Velocidade',
    description: '+10% de Velocidade de Movimento',
    sentence: '"Oque que há velhinho?"',
    cost: 15,
    effect: () => {
      console.log(`${name} Comprado, MoveSpeed aumentada`);
      playerStats.MoveSpeed += 10;
    },
  },
  {
    imageKey: 'patuaSaoJorge',
    name: 'Patuá de São Jorge',
    type: 'Velocidade',
    description: '+50% de Velocidade de Movimento',
    sentence: '"Para que meus inimigos tendo pés não me alcancem"',
    cost: 85,
    effect: () => {
      console.log(`${name} Comprado, MoveSpeed aumentada`);
      playerStats.MoveSpeed += 50;
    },
  },
];

export const firerateItems: itemsContainer[] = [
  {
    imageKey: 'olhoDeCobra',
    name: 'Olho de Cobra',
    type: 'Fire Rate',
    description: '-15% no tempo entre tiros',
    sentence: '"Ligeiro que nem bote de cobra!"',
    cost: 30,
    effect: () => {
      console.log(`${name} Comprado, Cadência aumentada`);
      gun.fireRate *= 0.85; // Reduz o tempo entre tiros em 15%
    },
  },
  {
    imageKey: 'cordel',
    name: 'Cordel do Cangaço',
    type: 'Fire Rate',
    description: '-25% no tempo entre tiros',
    sentence: '"Rápido nas rimas, rápido nos tiros!"',
    cost: 50,
    effect: () => {
      console.log(`${name} Comprado, Cadência aumentada`);
      gun.fireRate *= 0.75;
    },
  },
  {
    imageKey: 'dadoCangaceiro',
    name: 'Dado Cangaceiro',
    type: 'Fire Rate',
    description: '-40% no tempo entre tiros',
    sentence: '"A sorte favorece os rápidos!"',
    cost: 75,
    effect: () => {
      console.log(`${name} Comprado, Cadência aumentada`);
      gun.fireRate *= 0.6;
    },
  },
  {
    imageKey: 'ferradura',
    name: 'Ferradura Enferrujada',
    type: 'Fire Rate',
    description: '-10% no tempo entre tiros',
    sentence: '"Barato, mas vai que funciona..."',
    cost: 15,
    effect: () => {
      console.log(`${name} Comprado, Cadência aumentada`);
      gun.fireRate *= 0.9;
    },
  },
  {
    imageKey: 'guine',
    name: 'Pólvora de Guiné',
    type: 'Fire Rate',
    description: '-50% no tempo entre tiros',
    sentence: '"Tão rápido que o cano fica vermelho!"',
    cost: 100,
    effect: () => {
      console.log(`${name} Comprado, Cadência aumentada`);
      gun.fireRate *= 0.5;
    },
  },
];
