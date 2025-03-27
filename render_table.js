import { paginate } from "./helper_funcs.js";

export function createElement(tag, options = {}) {
  const {
    classNames = [],
    children = [],
    textContent = null,
    onClick = null,
  } = options;
  const element = document.createElement(tag);

  classNames.forEach((className) => element.classList.add(className));
  children.forEach((child) => element.append(child));

  if (textContent !== null) {
    element.textContent = textContent;
  }

  if (onClick) {
    element.addEventListener("click", onClick);
  }

  return element;
}

export function renderTable(rootElement, columns, data, pageSize = 10) {
  let sortedData = [...data];
  let currentSortColumn = null;
  let isIncreasing = true;
  let currentPage = 1;

  const sortData = (columnIndex) => {
    const column = columns[columnIndex];

    if (currentSortColumn === columnIndex) {
      isIncreasing = !isIncreasing;
    } else {
      currentSortColumn = columnIndex;
      isIncreasing = true;
    }

    sortedData.sort((a, b) => {
      const valueA = column.selector(a);
      const valueB = column.selector(b);

      if (valueA === "-" && valueB === "-") return 0;
      if (valueA === "-") return 1;
      if (valueB === "-") return -1;

      const numA = parseFloat(valueA);
      const numB = parseFloat(valueB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return isIncreasing ? numA - numB : numB - numA;
      }

      return isIncreasing
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    renderTableContent();
  };

  const renderTableContent = () => {
    rootElement.innerHTML = "";

    const header = createElement("thead", {
      children: columns.map((v, index) =>
        createElement("th", {
          textContent: v.header,
          onClick: () => sortData(index),
          classNames: ["sortable"],
        })
      ),
    });

    const paginatedData = paginate(sortedData, pageSize, currentPage);
    const rows = paginatedData.map((row) =>
      columns
        .map((v) => v.selector(row))
        .map((v) => createElement("td", { textContent: v }))
    );

    const table = createElement("table", {
      children: [
        header,
        ...rows.map((cells) => createElement("tr", { children: cells })),
      ],
      classNames: ["table__wrapper"],
    });

    const paginationControls = createPaginationControls();
    rootElement.append(table, paginationControls);
  };

  const createPaginationControls = () => {
    const totalPages = Math.ceil(sortedData.length / pageSize);

    const pagination = createElement("div", {
      classNames: ["pagination"],
      children: [
        createElement("button", {
          textContent: "Previous",
          onClick: () => {
            if (currentPage > 1) {
              currentPage--;
              renderTableContent();
            }
          },
        }),
        createElement("span", {
          textContent: `Page ${currentPage} of ${totalPages}`,
        }),
        createElement("button", {
          textContent: "Next",
          onClick: () => {
            if (currentPage < totalPages) {
              currentPage++;
              renderTableContent();
            }
          },
        }),
      ],
    });

    return pagination;
  };

  renderTableContent();
}
