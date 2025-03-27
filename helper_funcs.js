/*export function isValidRecord(record) {
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
*/
// Check if a record is valid by ensuring it has both baristaId and coffeeId
export function isValidRecord(record) {
  return Boolean(record.baristaId && record.coffeeId);
}

// Group an array of objects by a specified key
export function groupBy(rows, keySelector) {
  return rows.reduce((groups, row) => {
    const key = keySelector(row);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(row);
    return groups;
  }, {});
}

// Sum the values of a specified field in an array of objects
export function sum(items, valueSelector) {
  return items.reduce((total, item) => total + valueSelector(item), 0);
}

// Example usage:
// const items = [{ id: 1, count: 1 }, { id: 2, count: 5 }, { id: 1, count: 2 }];
// const groupedItems = groupBy(items, item => item.id);
// console.log(groupedItems);
// => { 1: [{ id: 1, count: 1 }, { id: 1, count: 2 }], 2: [{ id: 2, count: 5 }] }
// const totalCups = sum(items, item => item.count);
// console.log(totalCups);
// => 8
