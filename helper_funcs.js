export function isValidRecord(record) {
  if (record.baristaId && record.coffeeId) {
    return true;
  } else {
    return false;
  }
}

export function groupBy(rows, keyTaker) {
  let groups = {};
  rows.forEach((row) => {
    let key = keyTaker(row);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(row);
  });
  return groups;
}

export function paginate(items, pageSize, pageNumber) {
  const startIndex = pageSize * (pageNumber - 1);
  const endIndex = startIndex + pageSize;
  return items.slice(startIndex, endIndex);
}
