
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Octopart')
      .addItem('Refresh all data', 'refresh')
      .addToUi();
}

function refresh() {
  SpreadsheetApp.getUi().alert('Refresh will take place.');
}
