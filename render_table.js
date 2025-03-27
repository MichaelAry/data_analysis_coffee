import { paginate } from "./helper_funcs.js";

/**
 * Creates an HTML element with specified properties
 *
 * @param {string} tag - The HTML tag name (like 'div', 'table', 'button')
 * @param {Object} options - Options for the element
 * @returns {HTMLElement} - The created HTML element
 */
export function createElement(tag, options = {}) {
  // Extract options with default values if not provided
  const classNames = options.classNames || [];
  const children = options.children || [];
  const textContent =
    options.textContent !== undefined ? options.textContent : null;
  const onClick = options.onClick || null;

  // Create a new HTML element of the specified tag type
  const element = document.createElement(tag);

  // Add CSS classes to the element
  for (let i = 0; i < classNames.length; i++) {
    element.classList.add(classNames[i]);
  }

  // Add child elements to this element
  for (let i = 0; i < children.length; i++) {
    element.append(children[i]);
  }

  // Set the text content if provided
  if (textContent !== null) {
    element.textContent = textContent;
  }

  // Add a click event handler if provided
  if (onClick) {
    element.addEventListener("click", onClick);
  }

  // Return the created element
  return element;
}

/**
 * Renders a sortable, paginated table
 *
 * @param {HTMLElement} rootElement - The element to append the table to
 * @param {Array} columns - Column definitions with header text and data columnElement functions
 * @param {Array} data - The data to display in the table
 * @param {number} pageSize - Number of rows per page (default: 10)
 */
export function renderTable(rootElement, columns, data, pageSize = 23) {
  // Make a copy of the data so we don't modify the original
  let sortedData = [];
  for (let i = 0; i < data.length; i++) {
    sortedData.push(data[i]);
  }

  // Variables to track the current sort state
  let currentSortColumn = null; // Which column we're sorting by (null = unsorted)
  let isIncreasing = true; // Whether we're sorting in ascending order
  let currentPage = 1; // Current page number (starting from 1)

  /**
   * Sorts the data by a specific column
   *
   * @param {number} columnIndex - Index of the column to sort by
   */
  function sortData(columnIndex) {
    const column = columns[columnIndex];

    // If we're already sorting by this column, reverse the sort direction
    if (currentSortColumn === columnIndex) {
      isIncreasing = !isIncreasing;
    } else {
      // Otherwise, sort by this column in ascending order
      currentSortColumn = columnIndex;
      isIncreasing = true;
    }

    // Sort the data array
    sortedData.sort(function (a, b) {
      // Get the values to compare using the column's columnElement function
      const valueA = column.columnElement(a);
      const valueB = column.columnElement(b);

      // Handle special case where values are "-" (missing data)
      if (valueA === "-" && valueB === "-") return 0;
      if (valueA === "-") return 1; // Move missing values to the end
      if (valueB === "-") return -1;

      // Try to convert values to numbers for numeric comparison
      const numA = parseFloat(valueA);
      const numB = parseFloat(valueB);

      // If both values are valid numbers, compare them numerically
      if (!isNaN(numA) && !isNaN(numB)) {
        if (isIncreasing) {
          return numA - numB; // Ascending order
        } else {
          return numB - numA; // Descending order
        }
      }

      // Otherwise, compare as strings
      if (isIncreasing) {
        return String(valueA).localeCompare(String(valueB)); // Ascending
      } else {
        return String(valueB).localeCompare(String(valueA)); // Descending
      }
    });

    // Re-render the table with the sorted data
    renderTableContent();
  }

  /**
   * Renders the table content with the current sort and page settings
   */
  function renderTableContent() {
    // Clear the root element
    rootElement.innerHTML = "";

    // Create table header with sortable column headers
    let headerCells = [];
    for (let i = 0; i < columns.length; i++) {
      const columnIndex = i; // Save the index for the click handler

      // Create a header cell for this column
      const headerCell = createElement("th", {
        textContent: columns[i].header,
        onClick: function () {
          sortData(columnIndex);
        },
        classNames: ["sortable"],
      });

      headerCells.push(headerCell);
    }

    const header = createElement("thead", {
      children: headerCells,
    });

    // Get the data for the current page
    const paginatedData = paginate(sortedData, pageSize, currentPage);

    // Create table rows for the current page
    let tableRows = [];
    for (let i = 0; i < paginatedData.length; i++) {
      const rowData = paginatedData[i];

      // Create cells for this row
      let cells = [];
      for (let j = 0; j < columns.length; j++) {
        // Get the value for this cell using the column's columnElement function
        const cellValue = columns[j].columnElement(rowData);

        // Create a table cell with this value
        const cell = createElement("td", {
          textContent: cellValue,
        });

        cells.push(cell);
      }

      // Create a table row with these cells
      const row = createElement("tr", {
        children: cells,
      });

      tableRows.push(row);
    }

    // Create the table with header and rows
    const table = createElement("table", {
      children: [header, ...tableRows],
      classNames: ["table__wrapper"],
    });

    // Create pagination controls
    const paginationControls = createPaginationControls();

    // Add the table and pagination controls to the root element
    rootElement.append(table);
    rootElement.append(paginationControls);
  }

  /**
   * Creates pagination controls (Previous/Next buttons and page counter)
   *
   * @returns {HTMLElement} - The pagination controls element
   */
  function createPaginationControls() {
    // Calculate total number of pages
    const totalPages = Math.ceil(sortedData.length / pageSize);

    // Create "Previous" button
    const prevButton = createElement("button", {
      textContent: "Previous",
      onClick: function () {
        // Go to previous page if not on first page
        if (currentPage > 1) {
          currentPage--;
          renderTableContent();
        }
      },
    });

    // Create page counter text
    const pageCounter = createElement("span", {
      textContent: `Page ${currentPage} of ${totalPages}`,
    });

    // Create "Next" button
    const nextButton = createElement("button", {
      textContent: "Next",
      onClick: function () {
        // Go to next page if not on last page
        if (currentPage < totalPages) {
          currentPage++;
          renderTableContent();
        }
      },
    });

    // Create container for pagination controls
    const pagination = createElement("div", {
      classNames: ["pagination"],
      children: [prevButton, pageCounter, nextButton],
    });

    return pagination;
  }

  // Initial render of the table
  renderTableContent();
}
