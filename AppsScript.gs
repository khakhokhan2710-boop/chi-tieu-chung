/**
 * Chi Tieu Chung — Google Apps Script
 * Cai dat: script.google.com -> New project -> paste code -> Deploy -> Web app
 */

const SHEET = 'ChiTieu';
const SHEET_INCOME = 'ThuNhap';

function doGet(e) {
  const action = e?.parameter?.action || 'read';
  if (action === 'read') return getData();
  return json({ error: 'unknown action' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.entries) saveSheet(SHEET, ['date','category','amount','person','note'], data.entries);
    if (data.incomes) saveSheet(SHEET_INCOME, ['date','amount','note'], data.incomes);
    return json({ success: true, entries: (data.entries||[]).length, incomes: (data.incomes||[]).length });
  } catch(err) {
    return json({ error: err.toString() });
  }
}

function getData() {
  const entries = readSheet(SHEET, ['date','category','amount','person','note']);
  const incomes = readSheet(SHEET_INCOME, ['date','amount','note']);
  return json({ entries, incomes });
}

function readSheet(name, keys) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const r = data[i];
    if (!r[0]) continue;
    const obj = {};
    keys.forEach((k, idx) => { obj[k] = typeof r[idx] === 'number' ? r[idx] : String(r[idx] || ''); });
    rows.push(obj);
  }
  return rows;
}

function saveSheet(name, keys, rows) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); sheet.appendRow(keys); }
  const last = sheet.getLastRow();
  if (last > 1) sheet.getRange(2, 1, last - 1, keys.length).clearContent();
  if (rows.length > 0) {
    const vals = rows.map(r => keys.map(k => r[k] ?? ''));
    sheet.getRange(2, 1, vals.length, keys.length).setValues(vals);
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
