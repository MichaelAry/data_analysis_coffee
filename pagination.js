import { createElement } from "./elements.js";
export function createPaginationControls(
  data,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange
) {
  const totalPages = Math.ceil(data.length / pageSize);

  const pageSizeContainer = createElement("div", {
    classNames: ["page-size-container"],
  });

  const pageSizeLabel = createElement("span", {
    textContent: "Rows per page:",
    classNames: ["page-size-label"],
  });

  const pageSizeInput = createElement("input", {
    classNames: ["page-size-input"],
    value: pageSize,
    onChange: function (event) {
      const newSize = parseInt(event.target.value);
      if (newSize > 0) {
        onPageSizeChange(newSize);
      }
    },
  });
  pageSizeInput.type = "number";
  pageSizeInput.min = "1";
  pageSizeInput.max = data.length;

  const quickSelectSizes = [10, 20, 50, 100];
  const quickSelectContainer = createElement("div", {
    classNames: ["quick-select-container"],
  });

  quickSelectSizes.forEach((size) => {
    const quickSelectButton = createElement("button", {
      textContent: size,
      classNames: ["quick-select-button"],
      onClick: function () {
        onPageSizeChange(size);
        pageSizeInput.value = size;
      },
    });
    quickSelectContainer.appendChild(quickSelectButton);
  });

  pageSizeContainer.append(pageSizeLabel, pageSizeInput, quickSelectContainer);

  const navigationContainer = createElement("div", {
    classNames: ["navigation-container"],
  });

  const prevButton = createElement("button", {
    textContent: "Previous Page",
    onClick: function () {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    },
    classNames: ["pagination-button"],
  });

  const currentPageCounter = createElement("span", {
    textContent: `Page ${currentPage} of ${totalPages}`,
    classNames: ["page-counter"],
  });

  const nextButton = createElement("button", {
    textContent: "Next Page",
    onClick: function () {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    },
    classNames: ["pagination-button"],
  });

  navigationContainer.append(prevButton, currentPageCounter, nextButton);

  const pagination = createElement("div", {
    classNames: ["pagination"],
    children: [pageSizeContainer, navigationContainer],
  });

  return pagination;
}
