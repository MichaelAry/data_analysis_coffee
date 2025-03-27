// Import functions and data from other files
import { generateOrders, COFFEE_BY_ID } from "./generation.js";
import { groupBy, isValidRecord, sum } from "./helper_funcs.js";
import { renderTable } from "./render_table.js";

// Number of coffee order records to generate
const RECORDS_N = 1000;

// Generate random coffee orders
const records = generateOrders(RECORDS_N);

// Show the first 10 records in the console for debugging
console.table(records.slice(0, 10));

// Show the coffee types in the console
console.log(COFFEE_BY_ID);

/**
 * Processes raw coffee order data into a format suitable for display
 * 
 * @param {Array} rows - Raw coffee order records
 * @returns {Array} - Processed data grouped by barista with sales calculations
 */
function prepareRows(rows) {
  // Step 1: Filter out invalid records (missing barista ID or coffee ID)
  const validatedRows = [];
  for (let i = 0; i < rows.length; i++) {
    if (isValidRecord(rows[i])) {
      validatedRows.push(rows[i]);
    }
  }
  
  // Step 2: Group orders by barista ID
  const groupedRows = groupBy(validatedRows, function(row) {
    return row.baristaId;
  });
  
  // Step 3: Process each barista's data
  const groupedByBaristaNCoffee = [];
  
  // Loop through each barista's data
  const baristaIds = Object.keys(groupedRows);
  for (let i = 0; i < baristaIds.length; i++) {
    const baristaId = baristaIds[i];
    const baristaRows = groupedRows[baristaId];
    
    // Group this barista's orders by coffee type
    const grouped = groupBy(baristaRows, function(row) {
      return row.coffeeId;
    });
    
    // Process each coffee type for this barista
    const sells = [];
    const coffeeIds = Object.keys(grouped);
    
    for (let j = 0; j < coffeeIds.length; j++) {
      const coffeeId = coffeeIds[j];
      const coffeeRows = grouped[coffeeId];
      
      // Calculate total cups and revenue for this coffee type
      let subTotal = 0;
      let totalCups = 0;
      
      for (let k = 0; k < coffeeRows.length; k++) {
        const row = coffeeRows[k];
        subTotal += row.cups * row.price;
        totalCups += row.cups;
      }
      
      // Add this coffee's data to the sells array
      sells.push({
        coffeeId: coffeeId,
        coffeeName: COFFEE_BY_ID[coffeeId],
        subTotal: subTotal,
        totalCups: totalCups
      });
    }
    
    // Calculate total revenue for this barista
    let total = 0;
    for (let j = 0; j < sells.length; j++) {
      total += sells[j].subTotal;
    }
    
    // Add this barista's data to the result
    groupedByBaristaNCoffee.push({
      baristaId: baristaId,
      sells: sells,
      total: total
    });
  }
  
  return groupedByBaristaNCoffee;
}

// Process the raw data
const groupedRows = prepareRows(records);

// Get the document body to append our table to
const root = document.body;

// Define the columns for our table
const tableColumns = [
  // First column: Barista ID
  {
    header: "ID",
    selector: function(row) {
      return row.baristaId;
    }
  }
];

// Add columns for each coffee type (cups and price)
const coffeeIds = Object.keys(COFFEE_BY_ID);
for (let i = 0; i < coffeeIds.length; i++) {
  const id = coffeeIds[i];
  const coffeeName = COFFEE_BY_ID[id];
  
  // Column for number of cups sold
  tableColumns.push({
    header: coffeeName,
    selector: function(row) {
      // Find this coffee in the barista's sells array
      let coffeeSales = null;
      for (let j = 0; j < row.sells.length; j++) {
        if (row.sells[j].coffeeId === id) {
          coffeeSales = row.sells[j];
          break;
        }
      }
      
      // Return cups sold or "-" if none
      return coffeeSales ? coffeeSales.totalCups : "-";
    }
  });
  
  // Column for revenue from this coffee
  tableColumns.push({
    header: `${coffeeName} price`,
    selector: function(row) {
      // Find this coffee in the barista's sells array
      let coffeeSales = null;
      for (let j = 0; j < row.sells.length; j++) {
        if (row.sells[j].coffeeId === id) {
          coffeeSales = row.sells[j];
          break;
        }
      }
      
      // Return formatted price or "-" if none
      return coffeeSales ? coffeeSales.subTotal.toFixed(2) : "-";
    }
  });
}

// Add final column for total revenue
tableColumns.push({
  header: "Total",
  selector: function(row) {
    return row.total.toFixed(2);
  }
});

// Set up the button to render the table when clicked
document.getElementById("renderTableButton").onclick = function() {
  renderTable(root, tableColumns, groupedRows);
};
