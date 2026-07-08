/**
 * Chi Tieu Chung — Google Apps Script
 * Cai dat: script.google.com -> New project -> paste code -> Deploy -> Web app
 */

var SHEET = 'ChiTieu';
var SHEET_INCOME = 'ThuNhap';

function doGet(e) {
  var action = 'read';
  var callback = '';
  if (e && e.parameter && e.parameter.action) {
    action = e.parameter.action;
  }
  if (e && e.parameter && e.parameter.callback) {
    callback = e.parameter.callback;
  }
  if (action === 'read') {
    var result = getDataRaw();
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return json(result);
  }
  return json({ error: 'unknown action' });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.entries) {
      saveSheet(SHEET, ['date','category','amount','person','note'], data.entries);
    }
    if (data.incomes) {
      saveSheet(SHEET_INCOME, ['date','amount','note'], data.incomes);
    }
    return json({
      success: true,
      entries: (data.entries || []).length,
      incomes: (data.incomes || []).length
    });
  } catch(err) {
    return json({ error: err.toString() });
  }
}

function getDataRaw() {
  var entries = readSheet(SHEET, ['date','category','amount','person','note']);
  var incomes = readSheet(SHEET_INCOME, ['date','amount','note']);
  return { entries: entries, incomes: incomes };
}

function getData() {
  return json(getDataRaw());
}

function readSheet(name, keys) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[0]) continue;
    var obj = {};
    for (var j = 0; j < keys.length; j++) {
      obj[keys[j]] = typeof r[j] === 'number' ? r[j] : String(r[j] || '');
    }
    rows.push(obj);
  }
  return rows;
}

function saveSheet(name, keys, rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(keys);
  }
  var last = sheet.getLastRow();
  if (last > 1) {
    sheet.getRange(2, 1, last - 1, keys.length).clearContent();
  }
  if (rows.length > 0) {
    var vals = [];
    for (var i = 0; i < rows.length; i++) {
      var row = [];
      for (var j = 0; j < keys.length; j++) {
        row.push(rows[i][keys[j]] || '');
      }
      vals.push(row);
    }
    sheet.getRange(2, 1, vals.length, keys.length).setValues(vals);
  }
}

function json(obj) {
  var output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  // Allow CORS from GitHub Pages
  output.addHeader('Access-Control-Allow-Origin', '*');
  output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  return output;
}
