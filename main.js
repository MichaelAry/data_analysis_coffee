import { generateOrders, COFFEE_BY_ID } from "./generation.js";
import { groupBy, isValidRecord } from "./helper_funcs.js";
import { renderTable } from "./render_table.js";

const NUMBER_OF_RECORDS = 8765;
const records = generateOrders(NUMBER_OF_RECORDS);

document.getElementById("renderTableButton").onclick = function () {
  renderTable(root, tableColumns, groupedRows);
};

/**
 * Processes raw coffee order data into a format suitable for display
 *
 * @param {Array} rows - Raw coffee order records
 * @returns {Array} - Processed data grouped by barista with sales calculations
 */
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
      let cupsOfTypeOfCofee = 0;

      coffeeRows.forEach((_, k) => {
        const row = coffeeRows[k];
        totalPriceForCofee += row.cups * row.price;
        cupsOfTypeOfCofee += row.cups;
      });

      
      sellsOfBarista.push({
        coffeeId: coffeeId,
        coffeeName: COFFEE_BY_ID[coffeeId],
        totalPriceForCofee: totalPriceForCofee,
        cupsOfTypeOfCofee: cupsOfTypeOfCofee,
      });
    });

  
    let totalPrice = 0;
    sellsOfBarista.forEach((_,g)=> {
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

// Process the raw data
const groupedRows = transformRowsIntoStructed(records);

// Get the document body to append our table to
const root = document.body;

// Define the columns for our table
const tableColumns = [
  // First column: Barista ID
  {
    header: "ID",
    selector: function (row) {
      return row.baristaId;
    },
  },
];

// Add columns for each coffee type (cups and price)
const coffeeIds = Object.keys(COFFEE_BY_ID);
for (let i = 0; i < coffeeIds.length; i++) {
  const id = coffeeIds[i];
  const coffeeName = COFFEE_BY_ID[id];

  // Column for number of cups sold
  tableColumns.push({
    header: coffeeName,
    selector: function (row) {
      // Find this coffee in the barista's sellsOfBarista array
      let coffeeSales = null;
      for (let j = 0; j < row.sellsOfBarista.length; j++) {
        if (row.sellsOfBarista[j].coffeeId === id) {
          coffeeSales = row.sellsOfBarista[j];
          break;
        }
      }

      // Return cups sold or "-" if none
      return coffeeSales ? coffeeSales.cupsOfTypeOfCofee : "-";
    },
  });

  // Column for revenue from this coffee
  tableColumns.push({
    header: `${coffeeName} price`,
    selector: function (row) {
      // Find this coffee in the barista's sellsOfBarista array
      let coffeeSales = null;
      for (let j = 0; j < row.sellsOfBarista.length; j++) {
        if (row.sellsOfBarista[j].coffeeId === id) {
          coffeeSales = row.sellsOfBarista[j];
          break;
        }
      }

      // Return formatted price or "-" if none
      return coffeeSales ? coffeeSales.totalPriceForCofee.toFixed(2) : "-";
    },
  });
}

// Add final column for totalPrice revenue
tableColumns.push({
  header: "Total",
  selector: function (row) {
    return row.totalPrice.toFixed(2);
  },
});
