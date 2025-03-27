/*export function createElement(tag, options = {}) {
  const { classNames = [], children = [], textContent = null } = options;
  const element = document.createElement(tag);

  // Can be replaced to .forEach
  for (const className of classNames) {
    element.classList.add(className);
  }

  // Can be replaced to .forEach
  for (const child of children) {
    element.append(child);
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

// Columns:
// {
//    header: "Column name",
//    selector: (r) => r.name
// }

export function renderTable(rootElement, columns, data) {
  const header = createElement("thead", {
    children: columns
      .map((v) => v.header)
      .map((v) => createElement("th", { textContent: v })),
  });

  const rows = data.map((row) =>
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

  rootElement.append(table);
}
*/
//one with sort
 export function createElement(tag, options = {}) {
  const {
    classNames = [],
    children = [],
    textContent = null,
    onClick = null,
  } = options;
  const element = document.createElement(tag);

  classNames.forEach(className => element.classList.add(className));
  children.forEach(child => element.append(child));

  if (textContent !== null) {
    element.textContent = textContent;
  }

  if (onClick) {
    element.addEventListener('click', onClick);
  }

  return element;
}

export function renderTable(rootElement, columns, data) {
  let sortedData = [...data];
  let currentSortColumn = null;
  let isIncreasing = true;

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
      
      // Handle string "-" cases
      if (valueA === "-" && valueB === "-") return 0;
      if (valueA === "-") return 1;
      if (valueB === "-") return -1;

      // Convert to numbers if possible
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
    rootElement.innerHTML = '';
    
    const header = createElement('thead', {
      children: columns.map((v, index) => 
        createElement('th', { 
          textContent: v.header,
          onClick: () => sortData(index),
          classNames: ['sortable']
        })
      ),
    });

    const rows = sortedData.map((row) =>
      columns
        .map((v) => v.selector(row))
        .map((v) => createElement('td', { textContent: v }))
    );

    const table = createElement('table', {
      children: [
        header,
        ...rows.map((cells) =>
          createElement('tr', { children: cells })
        ),
      ],
      classNames: ['table__wrapper'],
    });

    rootElement.append(table);
  };

  renderTableContent();
}

