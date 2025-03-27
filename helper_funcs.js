export function isValidRecord(record) {
  if (record.baristaId && record.coffeeId) {
    return true;
  } else {
    return false;
  }
}

/**
 * Groups an array of objects by a specific property
 *
 * @param {Array} rows - Array of objects to group
 * @param {Function} keySelector - Function that returns the key to group by
 * @returns {Object} - An object where keys are group names and values are arrays of matching items
 */

export function groupBy(rows, keyTaker) {
  let groups = {};
  rows.forEach((_, i) => {
    let row = rows[i];
    let key = keyTaker(row);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(row);
  });
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
