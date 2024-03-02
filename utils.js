function quoteString(value) {
  if (value == null) return null;
  return "'" + value + "'";
}

function sortByString(a, b) {
  const aString = a.toUpperCase();
  const bString = b.toUpperCase();
  if (aString < bString) return -1;
  if (aString > bString) return 1;
  return 0;
}

module.exports = { quoteString, sortByString };
