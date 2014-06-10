
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Octopart')
      .addItem('Upload BOM', 'upload')
      .addToUi();
}

function upload() {
  SpreadsheetApp.getUi().alert('Coming soon...');
}
