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

const groupedRows = prepareRows(records);

const root = document.body;

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

document.getElementById("renderTableButton").onclick = function () {
  renderTable(root, tableColumns, groupedRows);
};
