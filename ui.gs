
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Octopart')
      .addItem('Upload BOM', 'upload')
      .addToUi();
}

/*
 * helper to create byte blobs
 */
function toBytes(str) {
  return Utilities.newBlob(str).getBytes();
}

/*
 * Uploads current active sheet to Octopart.
 *
 * good reference for using blobs as payload
 * https://code.google.com/p/google-apps-script-issues/issues/detail?id=1387
 */

function upload() {

  var url = "https://octopart.com/bom-lookup/upload";

  var boundary = "15b909e62efccd31a1b0098eae5dba3db361743f";
  var boundaryFull = "\r\n--" + boundary + "\r\n";

  // start multipart bounday
  var payload = toBytes(boundaryFull);
  payload = payload.concat(toBytes("Content-Disposition: form-data; name=\"datafile\"; filename=\"filename.csv\"\r\n\r\n"));

  // spreadsheet data
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getDataRange();
  var data = range.getValues();

  for (var i = 0; i < data.length; i++)
    payload = payload.concat(toBytes(data[i].toString() + "\r\n"));

  // end multipart boundary
  payload = payload.concat(toBytes(boundaryFull));

  var options = {
    method: 'post',
    payload: payload,
    contentType: "multipart/form-data; boundary=" + boundary,
    followRedirects: false,
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);

  // TODO: not easy to give proper errors to user here.
  if (response.getResponseCode() != 302) {
    SpreadsheetApp.getUi().alert("Something wrong while uploading your BOM.");
  } else {
    var template = HtmlService.createTemplateFromFile('popup');
    template.bom_url = response.getHeaders()["Location"];

    var html = template.evaluate();
    html.setHeight(300);

    SpreadsheetApp.getUi().showModalDialog(html, 'BOM Upload');
  }
}
