import { gameOptions } from "./GameOptionsConfig";

export const storeSpecificItems = [
  {
    id: "100coin",
    name: "Pequeno Tesouro",
    imageKey: "100moedas",
    itemValue: '100 A.P',
    cost: 'Rs 4,99', 
    effect: () => {
      gameOptions.apCoin += 100;
    },
  },
  {
    id: "500coin",
    imageKey: "500moedas", 
    itemValue: '500 A.P',
    cost: 'Rs 9,99', 
    effect: () => {
      gameOptions.apCoin += 500;
    },
  },
  {
    id: "1000coin",
    imageKey: "1000moedas",
    itemValue: '1000 A.P',
    cost: 'Rs 19,99', 
    effect: () => {
      gameOptions.apCoin += 1000;
    },
  },
  {
    id: "2000coin",
    imageKey: "2000moedas",
    itemValue: '2000 A.P',
    cost: 'Rs 34,99', 
    effect: () => {
      gameOptions.apCoin += 2000;
    },
  },
] as const