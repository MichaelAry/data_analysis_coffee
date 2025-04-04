import { createElement } from "./dom-utils.js";
import { createPaginationControls } from "./pagination-controls.js";
import { paginate } from "./helper_funcs.js";

export function renderTable(bodyElement, columns, data, pageSize = 23) {
  let sortedData = [];
  data.forEach((_, i) => {
    sortedData.push(data[i]);
  });

  let visibleColumns = columns.map(() => true);

  let currentSortedColumn = 0;
  let increasingOrderOfElements = true;
  let currentPage = 1;

  function sortData(columnIndexToSortBy) {
    const column = columns[columnIndexToSortBy];

    if (currentSortedColumn === columnIndexToSortBy) {
      increasingOrderOfElements = !increasingOrderOfElements;
    } else {
      currentSortedColumn = columnIndexToSortBy;
      increasingOrderOfElements = true;
    }

    sortedData.sort(function (a, b) {
      const stringA = column.columnElement(a);
      const stringB = column.columnElement(b);

      if (stringA === "-" && stringB === "-") return 0;
      if (stringA === "-") return 1;
      if (stringB === "-") return -1;

      const numA = parseFloat(stringA);
      const numB = parseFloat(stringB);

      if (numA && numB) {
        if (increasingOrderOfElements) {
          return numA - numB;
        } else {
          return numB - numA;
        }
      }

      if (increasingOrderOfElements) {
        return String(stringA).localeCompare(String(stringB));
      } else {
        return String(stringB).localeCompare(String(stringA));
      }
    });

    renderTableContent();
  }

  function toggleColumnVisibility(columnIndex) {
    visibleColumns[columnIndex] = !visibleColumns[columnIndex];
    renderTableContent();
  }

  function createColumnControls() {
    const columnControlsContainer = createElement("div", {
      classNames: ["column-controls"],
    });

    const controlsLabel = createElement("span", {
      textContent: "Toggle columns: ",
      classNames: ["controls-label"],
    });
    columnControlsContainer.appendChild(controlsLabel);

    columns.forEach((column, i) => {
      const toggleButton = createElement("button", {
        textContent: column.header,
        class: "showColumn",
        onClick: function () {
          toggleColumnVisibility(i);
        },
        classNames: visibleColumns[i] ? ["column-visible"] : ["column-hidden"],
      });
      columnControlsContainer.appendChild(toggleButton);
    });

    return columnControlsContainer;
  }

  function calculateTotals() {
    const totals = {};

    columns.forEach((column, i) => {
      if (!visibleColumns[i]) return;

      let total = 0;
      let hasNumericValues = false;

      sortedData.forEach((row) => {
        const value = column.columnElement(row);
        if (value !== "-") {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            total += numValue;
            hasNumericValues = true;
          }
        }
      });

      totals[i] = hasNumericValues ? total : "-";
    });

    return totals;
  }

  function handlePageChange(newPage) {
    currentPage = newPage;
    renderTableContent();
  }

  function handlePageSizeChange(newSize) {
    pageSize = newSize;
    currentPage = 1;
    renderTableContent();
  }

  function renderTableContent() {
    bodyElement.innerHTML = "";

    const columnControls = createColumnControls();
    bodyElement.appendChild(columnControls);

    let headerCells = [];
    columns.forEach((column, i) => {
      if (!visibleColumns[i]) return;

      const columnIndexToSortBy = i;
      const headerCell = createElement("th", {
        textContent: column.header,
        onClick: function () {
          sortData(columnIndexToSortBy);
        },
        classNames: ["sortable"],
      });

      headerCells.push(headerCell);
    });

    const header = createElement("thead", {
      children: headerCells,
    });

    const paginatedData = paginate(sortedData, pageSize, currentPage);

    let tableRows = [];
    paginatedData.forEach((_, i) => {
      const rowData = paginatedData[i];

      let cells = [];
      columns.forEach((column, j) => {
        if (!visibleColumns[j]) return;

        const cellValue = column.columnElement(rowData);

        const cell = createElement("td", {
          textContent: cellValue,
        });

        cells.push(cell);
      });

      const row = createElement("tr", {
        children: cells,
      });

      tableRows.push(row);
    });

    const totals = calculateTotals();
    let footerCells = [];

    footerCells.push(
      createElement("td", {
        textContent: "TOTAL",
        classNames: ["total-label"],
      })
    );

    let firstColumnProcessed = false;
    columns.forEach((_, i) => {
      if (!visibleColumns[i]) return;

      if (!firstColumnProcessed) {
        firstColumnProcessed = true;
        return;
      }

      const totalValue = totals[i];
      const formattedValue =
        typeof totalValue === "number" ? totalValue.toFixed(2) : totalValue;

      const cell = createElement("td", {
        textContent: formattedValue,
        classNames: ["total-value"],
      });

      footerCells.push(cell);
    });

    const footer = createElement("tfoot", {
      children: [
        createElement("tr", {
          children: footerCells,
          classNames: ["total-row"],
        }),
      ],
      classNames: ["table-footer"],
    });

    const table = createElement("table", {
      children: [
        header,
        createElement("tbody", { children: tableRows }),
        footer,
      ],
      classNames: ["table__wrapper"],
    });

    const paginationControls = createPaginationControls(
      sortedData,
      pageSize,
      currentPage,
      handlePageChange,
      handlePageSizeChange
    );

    bodyElement.append(table);
    bodyElement.append(paginationControls);
  }

  renderTableContent();
}
