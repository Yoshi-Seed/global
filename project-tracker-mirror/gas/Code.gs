/**
 * Project Tracker (Mirror) - Google Apps Script
 *
 * - doGet:  ?action=list で全件JSONを返す
 * - doPost: action=add で1行追記 / action=delete_request で削除依頼を別シートへ記録
 *
 * フロント側: /project-tracker-mirror/js/config.js の GAS_CONFIG を設定
 */

// ✅ 対象スプレッドシート（project-tracker-data）
const SPREADSHEET_ID = '1gR00_BA86KxNDIkvmedq2WRRt8aukGK3T4YXDJp1YNc';
// URL末尾の gid（#gid=...）
const MAIN_SHEET_GID = 1721680771;

// 🔐 任意: 簡易トークン（フロントの GAS_CONFIG.TOKEN と一致させる）
// 空文字のままならチェックしません。
const TOKEN = '';

// 削除依頼の格納先
const DELETE_REQUEST_SHEET_NAME = 'delete_requests';

// 想定カラム（20列）
const PROJECT_HEADERS = [
  'id',
  'registrationId',
  '疾患名',
  '疾患略語',
  '手法',
  '調査種別',
  '対象者種別',
  '専門',
  '実績数',
  '問合せのみ',
  '対象条件',
  '薬剤',
  'リクルート実施',
  'モデレーター',
  'クライアント',
  'エンドクライアント',
  'PJ番号',
  '実施年月',
  '登録担当',
  '登録日'
];

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = (params.action || 'list').toLowerCase();

    if (!isAuthorized_(params)) {
      return json_({ success: false, message: 'Unauthorized' });
    }

    if (action === 'health') {
      return json_({ success: true, ok: true, version: 'mirror-gas-v1' });
    }

    if (action !== 'list') {
      return json_({ success: false, message: `Unknown action: ${action}` });
    }

    const sheet = getMainSheet_();
    ensureProjectHeader_(sheet);

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return json_({ success: true, projects: [], count: 0 });
    }

    const values = sheet.getRange(2, 1, lastRow - 1, PROJECT_HEADERS.length).getValues();
    const projects = values
      .filter(row => row && row.some(cell => String(cell).trim() !== ''))
      .map(rowToProject_);

    return json_({
      success: true,
      projects,
      count: projects.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return json_({ success: false, message: String(err && err.message ? err.message : err) });
  }
}

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    if (!isAuthorized_(params, e)) {
      return json_({ success: false, message: 'Unauthorized' });
    }

    const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '';
    const payload = rawBody ? JSON.parse(rawBody) : {};

    // action は URL or body のどちらでもOK
    const action = String(params.action || payload.action || 'add').toLowerCase();

    if (action === 'add') {
      return handleAdd_(payload);
    }

    if (action === 'delete_request') {
      return handleDeleteRequest_(payload);
    }

    return json_({ success: false, message: `Unknown action: ${action}` });
  } catch (err) {
    return json_({ success: false, message: String(err && err.message ? err.message : err) });
  }
}

// ------------------------
// Handlers
// ------------------------

function handleAdd_(data) {
  const validation = validateProject_(data);
  if (!validation.valid) {
    return json_({ success: false, message: 'Validation failed', details: validation.errors });
  }

  const sheet = getMainSheet_();
  ensureProjectHeader_(sheet);

  const id = getNextId_(sheet);
  const registrationId = getNextRegistrationId_(sheet);
  const registeredDate = formatDate_(new Date(), 'yyyy-MM-dd');

  const row = [
    id,
    registrationId,
    normalizeField_(data.diseaseName || ''),
    normalizeField_(data.diseaseAbbr || ''),
    normalizeField_(data.method || ''),
    normalizeField_(data.surveyType || ''),
    normalizeField_(data.targetType || ''),
    normalizeSpecialty_(data.specialty || ''),
    Number(data.recruitCount || 0),
    data.inquiryOnly ? 'TRUE' : 'FALSE',
    normalizeField_(data.targetConditions || ''),
    normalizeField_(data.drug || ''),
    normalizeField_(data.recruitCompany || ''),
    normalizeField_(data.moderator || ''),
    normalizeField_(data.client || ''),
    normalizeField_(data.endClient || ''),
    normalizeField_(data.projectNumber || ''),
    normalizeField_(data.implementationDate || ''),
    normalizeField_(data.registrant || ''),
    registeredDate,
  ];

  sheet.appendRow(row);

  return json_({
    success: true,
    id,
    registrationId,
    message: '登録しました',
  });
}

function handleDeleteRequest_(data) {
  // 本削除はせず、「削除依頼ログ」に追記します
  const targetId = Number(data.id);
  const reason = String(data.reason || '').trim();

  if (!targetId || !reason) {
    return json_({ success: false, message: 'id と reason は必須です' });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet_(ss, DELETE_REQUEST_SHEET_NAME, [
    'timestamp',
    'requestId',
    'id',
    'reason',
    'password',
    'projectInfo_json',
    'clientTimestamp',
  ]);

  const timestamp = new Date();
  const requestId = `del_${timestamp.getTime()}`;
  const projectInfo = data.projectInfo ? JSON.stringify(data.projectInfo) : '';
  const clientTs = data.clientTimestamp ? String(data.clientTimestamp) : '';

  sheet.appendRow([
    timestamp.toISOString(),
    requestId,
    targetId,
    reason,
    String(data.password || ''),
    projectInfo,
    clientTs,
  ]);

  return json_({
    success: true,
    requestId,
    message: '削除依頼を記録しました（管理者が確認します）',
  });
}

// ------------------------
// Helpers
// ------------------------

function getMainSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = ss.getSheets();
  const target = sheets.find(s => s.getSheetId() === MAIN_SHEET_GID);
  return target || ss.getActiveSheet();
}

function getOrCreateSheet_(ss, name, headerRow) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0 && headerRow && headerRow.length) {
    sheet.appendRow(headerRow);
  }
  return sheet;
}

function ensureProjectHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(PROJECT_HEADERS);
    return;
  }

  // ヘッダーが無い/短い場合にだけ補完
  const headerValues = sheet.getRange(1, 1, 1, PROJECT_HEADERS.length).getValues()[0];
  const joined = headerValues.map(v => String(v || '').trim()).join('');
  if (!joined) {
    sheet.getRange(1, 1, 1, PROJECT_HEADERS.length).setValues([PROJECT_HEADERS]);
  }
}

function isAuthorized_(params, e) {
  if (!TOKEN) return true;
  const token = String((params && params.token) || '').trim();
  if (token && token === TOKEN) return true;

  // body 側に token を含めたい場合の保険（基本はURLでOK）
  try {
    const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '';
    if (rawBody) {
      const payload = JSON.parse(rawBody);
      if (payload && String(payload.token || '').trim() === TOKEN) return true;
    }
  } catch (_) {
    // ignore
  }

  return false;
}

function rowToProject_(row) {
  return {
    id: row[0],
    registrationId: row[1],
    diseaseName: row[2],
    diseaseAbbr: row[3],
    method: row[4],
    surveyType: row[5],
    targetType: row[6],
    specialty: row[7],
    recruitCount: row[8],
    inquiryOnly: row[9],
    targetConditions: row[10],
    drug: row[11],
    recruitCompany: row[12],
    moderator: row[13],
    client: row[14],
    endClient: row[15],
    projectNumber: row[16],
    implementationDate: row[17],
    registrant: row[18],
    registeredDate: row[19],
  };
}

function validateProject_(data) {
  const errors = {};

  if (!data.diseaseName || String(data.diseaseName).trim() === '') {
    errors.diseaseName = '疾患名は必須です';
  }

  if (!data.method || String(data.method).trim() === '') {
    errors.method = '手法は必須です';
  }

  if (!data.surveyType || String(data.surveyType).trim() === '') {
    errors.surveyType = '調査種別は必須です';
  }

  if (!data.targetType || String(data.targetType).trim() === '') {
    errors.targetType = '対象者種別は必須です';
  }

  const recruitCount = Number.parseInt(data.recruitCount, 10);
  if (!recruitCount && recruitCount !== 0) {
    errors.recruitCount = '実績数は必須です';
  } else if (Number.isNaN(recruitCount) || recruitCount < 0) {
    errors.recruitCount = '実績数は0以上の整数で入力してください';
  }

  const client = String(data.client || '').trim();
  const endClient = String(data.endClient || '').trim();
  if (!client && !endClient) {
    errors.client = 'クライアントまたはエンドクライアントのいずれかを入力してください';
    errors.endClient = 'クライアントまたはエンドクライアントのいずれかを入力してください';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

function getNextId_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let max = 0;
  values.forEach(r => {
    const n = Number.parseInt(r[0], 10);
    if (!Number.isNaN(n) && n > max) max = n;
  });
  return max + 1;
}

function getNextRegistrationId_(sheet) {
  const today = new Date();
  const dateStr = formatDate_(today, 'yyyyMMdd');
  const prefix = `${dateStr}-`;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return `${dateStr}-0001`;
  }

  const values = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  let maxSeq = 0;

  values.forEach(r => {
    const reg = String(r[0] || '').trim();
    if (!reg.startsWith(prefix)) return;
    const parts = reg.split('-');
    if (parts.length !== 2) return;
    const seq = Number.parseInt(parts[1], 10);
    if (!Number.isNaN(seq) && seq > maxSeq) maxSeq = seq;
  });

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `${dateStr}-${nextSeq}`;
}

function normalizeField_(value) {
  if (value === null || value === undefined) return '';
  let normalized = String(value);
  normalized = normalized.replace(/\r\n/g, '；');
  normalized = normalized.replace(/\r/g, '；');
  normalized = normalized.replace(/\n/g, '；');
  normalized = normalized.replace(/；+/g, '；');
  normalized = normalized.replace(/^；+|；+$/g, '');
  return normalized;
}

function normalizeSpecialty_(value) {
  let normalized = normalizeField_(value);
  normalized = normalized.replace(/,/g, '，');
  return normalized;
}

function formatDate_(date, pattern) {
  const tz = Session.getScriptTimeZone() || 'Asia/Tokyo';
  return Utilities.formatDate(date, tz, pattern);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
