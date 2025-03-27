import { paginate } from "./helper_funcs.js";

export function createElement(tag, options = {}) {
  const classNames = options.classNames || [];
  const children = options.children || [];
  const textContent =
    options.textContent !== undefined ? options.textContent : 0;
  const onClick = options.onClick || 0;

  const element = document.createElement(tag);

  classNames.forEach((_, i) => {
    element.classList.add(classNames[i]);
  });

  children.forEach((_, i) => {
    element.append(children[i]);
  });

  if (textContent) element.textContent = textContent;

  if (onClick) element.addEventListener("click", onClick);

  return element;
}

export function renderTable(bodyElement, columns, data, pageSize = 23) {
  let sortedData = [];
  data.forEach((_, i) => {
    sortedData.push(data[i]);
  });

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

  function renderTableContent() {
    bodyElement.innerHTML = "";

    let headerCells = [];
    columns.forEach((_, i) => {
      const columnIndexToSortBy = i;
      const headerCell = createElement("th", {
        textContent: columns[i].header,
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
      columns.forEach((_, j) => {
        const cellValue = columns[j].columnElement(rowData);

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

    const table = createElement("table", {
      children: [header, ...tableRows],
      classNames: ["table__wrapper"],
    });

    const paginationControls = createPaginationControls();

    bodyElement.append(table);
    bodyElement.append(paginationControls);
  }

  function createPaginationControls() {
    const totalPages = Math.ceil(sortedData.length / pageSize);

    const prevButton = createElement("button", {
      textContent: "Previous Page",
      onClick: function () {
        if (currentPage > 1) {
          currentPage--;
          renderTableContent();
        }
      },
    });

    const currentPageCounter = createElement("span", {
      textContent: `Page ${currentPage} of ${totalPages}`,
    });

    const nextButton = createElement("button", {
      textContent: "Next Page",
      onClick: function () {
        if (currentPage < totalPages) {
          currentPage++;
          renderTableContent();
        }
      },
    });

    const pagination = createElement("div", {
      classNames: ["pagination"],
      children: [prevButton, currentPageCounter, nextButton],
    });

    return pagination;
  }

  renderTableContent();
}
