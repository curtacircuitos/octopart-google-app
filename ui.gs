
function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Octopart')
      .addItem('Upload BOM', 'upload')
      .addToUi();
}

/*
 * Uploads current active sheet to Octopart.
 *
 * good reference for using blobs as payload
 * https://code.google.com/p/google-apps-script-issues/issues/detail?id=1387
 */

function upload() {
  var octopart = new Octopart();
  octopart.upload();
}
