
function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createAddonMenu().addItem('Upload BOM...', 'showSidebar').addToUi();
}

/*
 * Uploads current active sheet to Octopart.
 *
 * good reference for using blobs as payload
 * https://code.google.com/p/google-apps-script-issues/issues/detail?id=1387
 */

function showSidebar() {
  var ui = SpreadsheetApp.getUi();
  var sidebar = HtmlService.createHtmlOutputFromFile("sidebar").setTitle("Upload BOM");
  SpreadsheetApp.getUi().showSidebar(sidebar);
}

function uploadBOM() {
  var octopart = new Octopart();
  return octopart.upload();
}
