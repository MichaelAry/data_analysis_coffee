export function isValidRecord(record) {
  return Boolean(record.baristaId && record.coffeeId);
}

export function groupBy(rows, keySelector) {
  return rows.reduce((groups, row) => {
    const key = keySelector(row);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(row);
    return groups;
  }, {});
}

export function sum(items, valueSelector) {
  return items.reduce((total, item) => total + valueSelector(item), 0);
}

export function paginate(items, pageSize, pageNumber) {
  const start = pageSize * (pageNumber - 1);
  return items.slice(start, start + pageSize);
}
