function getDate() {
  var date = new Date();
  var year = date.getFullYear().toString();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if(month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day;
  }
  var today = year + month + day;
  return today;
}

module.exports = getDate();