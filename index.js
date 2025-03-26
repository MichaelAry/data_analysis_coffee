import { generateOrders, COFFEE_BY_ID } from "./generation.js";
import { groupBy, isValidRecord, sum } from "./helper_funcs.js";
import { renderTable } from "./render_table.js";

const RECORDS_N = 1000;
const records = generateOrders(RECORDS_N);

console.table(records.slice(0, 10));
console.log(COFFEE_BY_ID);

function prepareRows(rows) {
  const validatedRows = rows.filter(isValidRecord);

  const groupedRows = groupBy(validatedRows, (row) => row.baristaId);

  // Object.entries - для объекта key:value [[key, value]]
  const groupedByBaristaNCoffee = Object.entries(groupedRows).map(
    ([baristaId, rows]) => {
      const grouped = groupBy(rows, (row) => row.coffeeId);

      const sells = Object.entries(grouped).map(([coffeeId, rows]) => {
        const subTotal = sum(rows, (row) => row.cups * row.price);
        const totalCups = sum(rows, (row) => row.cups);

        return {
          coffeeId,
          coffeeName: COFFEE_BY_ID[coffeeId],
          subTotal,
          totalCups,
        };
      });

      const total = sum(sells, (row) => row.subTotal);

      return {
        baristaId,
        sells,
        total,
      };
    }
  );

  return groupedByBaristaNCoffee;
}

const pre = document.querySelector("#data");

const groupedRows = prepareRows(records);

// pre.innerText = JSON.stringify(groupedRows, null, 2);

const root = document.body;

// Object { key1: value1, key2: value2 }
// Object.entries(object) => [[key1, value1], [key2, value2]]
// map => [{ header: "Latte"}, { header: "Cappuccino" }]
// ...[{ header: "Latte"}, { header: "Cappuccino" }]

const tableColumns = [
  {
    header: "ID",
    selector: (r) => r.baristaId,
  },
  ...Object.entries(COFFEE_BY_ID).flatMap(([id, coffee]) => [
    {
      header: coffee,
      selector: (r) => r.sells.find((c) => c.coffeeId === id)?.totalCups ?? "-",
    },
    {
      header: `${coffee} price`,
      selector: (r) =>
        r.sells.find((c) => c.coffeeId === id)?.subTotal.toFixed(2) ?? "-",
    },
  ]),
  {
    header: "Total",
    selector: (r) => r.total.toFixed(2),
  },
];

renderTable(root, tableColumns, groupedRows);

// Optional chaining operator https://learn.javascript.ru/optional-chaining

// let value = { id: 1 } (maybe null)
// value?.id - value or undefined
// r.sells.find((c) => c.coffeeId === id)?.subTotal.toFixed(2)

// ?? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
