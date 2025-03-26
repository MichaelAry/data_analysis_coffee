/**
 * ! В этом файле ничего менять не нужно !
 * Будем считать, что эти данные приходят
 * нам с сервера и мы их не контролируем
 */

export const COFFEE_BY_ID = {
  1: "Americano",
  2: "Latte",
  3: "Cappuccino",
  4: "Espresso",
  5: "Mocha",
  6: "Iced Coffee",
};

export function generateOrders(length = 10) {
  return Array.from({ length }, () => ({
    baristaId: maybe(0.9, getRandomInt(1, Math.ceil(length * (2 / 10)))),
    coffeeId: maybe(0.85, random(Object.keys(COFFEE_BY_ID))),
    cups: getRandomInt(1, 10),
    price: parseFloat(`${getRandomInt(1, 10)}.${getRandomInt(0, 99)}`),
  }));
}

const random = (list) => list[getRandomInt(0, list.length - 1)];

const maybe = (chance, value) => (Math.random() < chance ? value : "");

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
