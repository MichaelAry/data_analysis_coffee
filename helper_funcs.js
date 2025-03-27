// helper_funcs.js - Simple utility functions for data analysis

/**
 * Checks if a coffee order record has all required information
 * 
 * @param {Object} record - A coffee order record
 * @returns {boolean} - True if the record has both baristaId and coffeeId, false otherwise
 */
export function isValidRecord(record) {
  // We need to make sure both the barista ID and coffee ID exist
  // If either is missing, we can't properly analyze this record
  if (record.baristaId && record.coffeeId) {
    return true;  // Record has all required fields
  } else {
    return false; // Record is missing required fields
  }
}

/**
 * Groups an array of objects by a specific property
 * 
 * @param {Array} rows - Array of objects to group
 * @param {Function} keySelector - Function that returns the key to group by
 * @returns {Object} - An object where keys are group names and values are arrays of matching items
 */
export function groupBy(rows, keySelector) {
  // Start with an empty object to hold our groups
  let groups = {};
  
  // Go through each row in the data
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    
    // Get the key for this row (like baristaId or coffeeId)
    let key = keySelector(row);
    
    // If we haven't seen this key before, create a new empty array for it
    if (!groups[key]) {
      groups[key] = [];
    }
    
    // Add this row to the appropriate group
    groups[key].push(row);
  }
  
  // Return the grouped data
  return groups;
}

/**
 * Calculates the sum of values in an array
 * 
 * @param {Array} items - Array of objects to sum values from
 * @param {Function} valueSelector - Function that returns the value to sum for each item
 * @returns {number} - The total sum
 */
export function sum(items, valueSelector) {
  // Start with a total of 0
  let total = 0;
  
  // Go through each item and add its value to the total
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let value = valueSelector(item);
    total = total + value;
  }
  
  // Return the final total
  return total;
}

/**
 * Divides an array into pages for display
 * 
 * @param {Array} items - Array of items to paginate
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Current page number (starting from 1)
 * @returns {Array} - Items for the requested page
 */
export function paginate(items, pageSize, pageNumber) {
  // Calculate the starting index for the requested page
  // For example, if pageSize is 10:
  // - Page 1 starts at index 0
  // - Page 2 starts at index 10
  // - Page 3 starts at index 20
  const startIndex = pageSize * (pageNumber - 1);
  
  // Calculate the ending index (exclusive)
  const endIndex = startIndex + pageSize;
  
  // Return a slice of the array from start index to end index
  // This gives us just the items for the current page
  return items.slice(startIndex, endIndex);
}
