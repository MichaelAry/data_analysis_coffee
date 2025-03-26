export function isValidRecord(record) {
  return !!record.baristaId && !!record.coffeeId;
}

// by - функция, которая выбирает какое-то поле, e.g. (v) => v.baristaId
export function groupBy(rows, by) {
  const groups = {};

  for (const row of rows) {
    const key = by(row);

    const existingGroup = groups[key];

    if (existingGroup) {
      existingGroup.push(row);
      continue;
    }

    const newGroup = [row];
    groups[key] = newGroup;
  }

  return groups;
}

// const items = [{ id: 1, count: 1 }, { id: 2, count: 5 }, { id: 1, count: 2 }]
// groups - by id
// by = (row) => row.id
// groupBy(items, (row) => row.id)
// => {
//      1: [{ id: 1, count: 1}, { id: 1, count: 2}],
//      2: [{ id: 2, count: 5}]
//    }

// by - функция, которая берет поле по которому мы суммируем
export function sum(items, by) {
  let sum = 0;

  for (const item of items) {
    const value = by(item);
    sum += value;
  }

  return sum;

  // return items.reduce((acc, cur) => acc + by(cur), 0);
}

// const rows = [
//    {"baristaId":1,"coffeeId":"4","cups":4,"price":3.12},
//    {"baristaId":1,"coffeeId":"4","cups":7,"price":2.21}
// ]
//
// sum(rows, (row) => row.cups) -> 11
