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

function sanityzeTextToDB(text) {
  if (text == null) return text;

  var cleanText = text.replace(/'/g, "&sap");
  cleanText = cleanText.replace(/"/g, "&dsap");
  return cleanText;
}

function sanityzeTextFromDB(text) {
  if (text == null) return text;
  var cleanText = text.replace(/&sap/g, "'");
  cleanText = cleanText.replace(/&dsap/g, '"');
  return text.replace("&sap", "'");
}

module.exports = {
  quoteString,
  sortByString,
  sanityzeTextToDB,
  sanityzeTextFromDB,
};
