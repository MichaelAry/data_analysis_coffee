import { generateOrders, COFFEE_BY_ID } from "./generation.js";
import { groupBy, isValidRecord } from "./helper_funcs.js";
import { renderTable } from "./render_table.js";

const NUMBER_OF_RECORDS = 8765;
const records = generateOrders(NUMBER_OF_RECORDS);

document.getElementById("renderTableButton").onclick = function () {
  renderTable(document.body, tableColumns, groupedRows);
};

function transformRowsIntoStructed(rows) {
  const checkedRows = [];
  rows.forEach((_, i) => {
    if (isValidRecord(rows[i])) {
      checkedRows.push(rows[i]);
    }
  });

  const groupedRows = groupBy(checkedRows, function (row) {
    return row.baristaId;
  });

  const coffeeGroupedByBarista = [];

  const baristaIds = Object.keys(groupedRows);
  baristaIds.forEach((_, i) => {
    const baristaId = baristaIds[i];
    const baristaRows = groupedRows[baristaId];

    const groupedByCoffeeType = groupBy(baristaRows, function (row) {
      return row.coffeeId;
    });

    const sellsOfBarista = [];
    const coffeeIds = Object.keys(groupedByCoffeeType);

    coffeeIds.forEach((_, j) => {
      const coffeeId = coffeeIds[j];
      const coffeeRows = groupedByCoffeeType[coffeeId];

      let totalPriceForCofee = 0;
      let cupsOfTypeOfCoffee = 0;

      coffeeRows.forEach((_, k) => {
        const row = coffeeRows[k];
        totalPriceForCofee += row.cups * row.price;
        cupsOfTypeOfCoffee += row.cups;
      });

      sellsOfBarista.push({
        coffeeId: coffeeId,
        coffeeName: COFFEE_BY_ID[coffeeId],
        totalPriceForCofee: totalPriceForCofee,
        cupsOfTypeOfCoffee: cupsOfTypeOfCoffee,
      });
    });

    let totalPrice = 0;
    sellsOfBarista.forEach((_, g) => {
      totalPrice += sellsOfBarista[g].totalPriceForCofee;
    });

    coffeeGroupedByBarista.push({
      baristaId: baristaId,
      sellsOfBarista: sellsOfBarista,
      totalPrice: totalPrice,
    });
  });

  return coffeeGroupedByBarista;
}

const groupedRows = transformRowsIntoStructed(records);

const tableColumns = [
  {
    header: "Baristd ID",
    columnElement: function (row) {
      return row.baristaId;
    },
  },
];

const coffeeIds = Object.keys(COFFEE_BY_ID);
coffeeIds.forEach((_, i) => {
  const id = coffeeIds[i];
  const coffeeName = COFFEE_BY_ID[id];

  tableColumns.push({
    header: coffeeName,
    columnElement: function (row) {
      let coffeeSales = 0;
      for (let j = 0; j < row.sellsOfBarista.length; j++) {
        if (row.sellsOfBarista[j].coffeeId === id) {
          coffeeSales = row.sellsOfBarista[j];
          break;
        }
      }
      return coffeeSales ? coffeeSales.cupsOfTypeOfCoffee : "-";
    },
  });

  tableColumns.push({
    header: `${coffeeName} price`,
    columnElement: function (row) {
      let coffeeSales = 0;
      for (let j = 0; j < row.sellsOfBarista.length; j++) {
        if (row.sellsOfBarista[j].coffeeId === id) {
          coffeeSales = row.sellsOfBarista[j];
          break;
        }
      }
      return coffeeSales ? coffeeSales.totalPriceForCofee.toFixed(2) : "-";
    },
  });
});

tableColumns.push({
  header: "Total",
  columnElement: function (row) {
    return row.totalPrice.toFixed(2);
  },
});
