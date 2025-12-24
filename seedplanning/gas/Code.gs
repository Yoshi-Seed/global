/**
 * Seed Planning Project Management System - Google Apps Script
 *
 * 2シート構成:
 * - projects_index: 一覧・検索用の軽量データ
 * - projects_detail: 詳細ページ用の重量データ（Markdown + JSON）
 *
 * API:
 * - GET  ?action=list                     - 一覧取得（フィルタ対応）
 * - GET  ?action=detail&pj=Z04012101      - 詳細取得
 * - POST ?action=add                      - 新規登録（index + detail 両方に追記）
 * - POST ?action=update&pj=Z04012101      - 更新（index + detail 両方を更新）
 * - POST ?action=delete_request           - 削除依頼記録
 * - POST ?action=delete&pj=Z04012101      - 削除実行（TOKEN必須）
 *
 * フロント側: /seedplanning/js/config.js の GAS_CONFIG を設定
 */

// ✅ 対象スプレッドシート（seedplanning-projects）
const SPREADSHEET_ID = '1dObSMppCo8ZXI9BoX63Xx-DZIBQ6voDBMJiPWU68i8I';

// シート名（GIDではなく名前で指定）
const INDEX_SHEET_NAME = 'projects_index';
const DETAIL_SHEET_NAME = 'projects_detail';

// 🔐 簡易トークン（フロントの GAS_CONFIG.TOKEN と一致させる）
// 空文字のままならチェックしません。
const TOKEN = '';

// 削除関連
const DELETE_REQUEST_SHEET_NAME = 'delete_requests';
const DELETE_LOG_SHEET_NAME = 'delete_logs';
const DELETE_CONFIRM_PHRASE = 'delete';
const REQUIRE_TOKEN_FOR_DELETE = true;

// ================================
// スキーマ定義
// ================================

// projects_index のカラム（10列）
const INDEX_HEADERS = [
  'pj_number',        // PJ番号（主キー）
  'project_name',     // プロジェクト名
  'project_type',     // プロジェクトタイプ（公的/民間）
  'category',         // カテゴリー（エネルギー・環境/エレクトロニクス・IT/その他の市場分野/ヘルスケア/メディカル・バイオ/医療IT）
  'term',             // 実施期（40期, 41期, ..., 44期） ※日付文字列なら自動変換
  'client_name',      // クライアント名
  'summary',          // 1行サマリー（80文字程度）
  'updated_at',       // 更新日時（ISO 8601）
  'registered_by',    // 登録担当者
  'registered_date'   // 登録日（yyyy-MM-dd）
];

/**
 * 日付文字列から「期」に変換
 * ルール: 43期 = 2025年3月～2026年2月
 *         44期 = 2026年3月～2027年2月
 *         N期 = (2025 + N - 43)年3月～(2026 + N - 43)年2月
 * 
 * @param {string|Date} dateInput - 日付文字列または Date オブジェクト
 * @return {string} "43期", "44期" などの文字列。変換できない場合は元の値
 */
function dateToTerm_(dateInput) {
  if (!dateInput) return '';
  
  // すでに「○○期」の形式なら、そのまま返す
  if (typeof dateInput === 'string' && /^\d+期$/.test(dateInput.trim())) {
    return dateInput.trim();
  }

  try {
    let date;
    if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      // 文字列から Date オブジェクトを作成
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
      // 変換できない場合は元の値を返す
      return String(dateInput);
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-indexed

    // 基準: 43期 = 2025/03 ~ 2026/02
    const BASE_TERM = 43;
    const BASE_START_YEAR = 2025;
    const BASE_START_MONTH = 3;

    // 期の開始年月を計算
    // 3月以降なら、その年の3月が期の開始
    // 2月以前なら、前年の3月が期の開始
    let termStartYear;
    if (month >= BASE_START_MONTH) {
      termStartYear = year;
    } else {
      termStartYear = year - 1;
    }

    // 43期からの差分を計算
    const yearDiff = termStartYear - BASE_START_YEAR;
    const term = BASE_TERM + yearDiff;

    return `${term}期`;
  } catch (error) {
    return String(dateInput);
  }
}

// projects_detail のカラム（7列）
const DETAIL_HEADERS = [
  'pj_number',        // PJ番号（主キー、indexと連携）
  'background',       // 背景・課題（顧客が抱えていた課題）
  'purpose',          // 目的（プロジェクトのゴール）
  'implementation',   // 実施内容（具体的に何を行ったか）
  'deliverables',     // 提供した成果物・実績
  'reference_files',  // 参照した主なファイル（テキスト形式）
  'history_log'       // 変更履歴（JSON配列文字列、任意）
];

// ================================
// doGet: 一覧取得・詳細取得
// ================================

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = (params.action || 'list').toLowerCase();

    if (!isAuthorized_(params)) {
      return json_({ success: false, message: 'Unauthorized' });
    }

    if (action === 'health') {
      return json_({ success: true, ok: true, version: 'seedplanning-gas-v1' });
    }

    if (action === 'list') {
      return handleList_(params);
    }

    if (action === 'detail') {
      return handleDetail_(params);
    }

    return json_({ success: false, message: `Unknown action: ${action}` });
  } catch (err) {
    return json_({ success: false, message: String(err && err.message ? err.message : err) });
  }
}

// ================================
// doPost: 登録・更新・削除
// ================================

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    if (!isAuthorized_(params, e)) {
      return json_({ success: false, message: 'Unauthorized' });
    }

    const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '';
    const payload = rawBody ? JSON.parse(rawBody) : {};

    const action = String(params.action || payload.action || 'add').toLowerCase();

    if (action === 'add') {
      return handleAdd_(payload);
    }

    if (action === 'update') {
      const pjNumber = params.pj || payload.pj_number || payload.pjNumber;
      return handleUpdate_(pjNumber, payload);
    }

    if (action === 'delete') {
      return handleDelete_(payload);
    }

    if (action === 'delete_request') {
      return handleDeleteRequest_(payload);
    }

    return json_({ success: false, message: `Unknown action: ${action}` });
  } catch (err) {
    return json_({ success: false, message: String(err && err.message ? err.message : err) });
  }
}

// ================================
// Handlers
// ================================

/**
 * 一覧取得（フィルタ対応）
 * ?action=list&type=公的&category=ヘルスケア&term=44期&client=社協&q=運営
 */
function handleList_(params) {
  const sheet = getIndexSheet_();
  ensureHeader_(sheet, INDEX_HEADERS);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return json_({ success: true, projects: [], count: 0 });
  }

  const values = sheet.getRange(2, 1, lastRow - 1, INDEX_HEADERS.length).getValues();
  let projects = values
    .filter(row => row && row[0]) // pj_number が存在する行のみ
    .map(rowToIndexProject_);

  // フィルタ適用
  const filters = {
    type: String(params.type || '').trim(),
    category: String(params.category || '').trim(),
    term: String(params.term || '').trim(),
    client: String(params.client || '').trim(),
    q: String(params.q || '').trim() // フリーワード検索
  };

  if (filters.type) {
    projects = projects.filter(p => p.project_type === filters.type);
  }

  if (filters.category) {
    projects = projects.filter(p => p.category === filters.category);
  }

  if (filters.term) {
    projects = projects.filter(p => p.term === filters.term);
  }

  if (filters.client) {
    const clientLower = filters.client.toLowerCase();
    projects = projects.filter(p => 
      (p.client_name || '').toLowerCase().includes(clientLower)
    );
  }

  if (filters.q) {
    const qLower = filters.q.toLowerCase();
    projects = projects.filter(p => {
      const searchText = [
        p.pj_number,
        p.project_name,
        p.client_name,
        p.summary
      ].join(' ').toLowerCase();
      return searchText.includes(qLower);
    });
  }

  return json_({
    success: true,
    projects,
    count: projects.length,
    filters: filters,
    updatedAt: new Date().toISOString()
  });
}

/**
 * 詳細取得
 * ?action=detail&pj=Z04012101
 */
function handleDetail_(params) {
  const pjNumber = String(params.pj || '').trim();
  if (!pjNumber) {
    return json_({ success: false, message: 'pj パラメータは必須です' });
  }

  const indexSheet = getIndexSheet_();
  const detailSheet = getDetailSheet_();
  
  ensureHeader_(indexSheet, INDEX_HEADERS);
  ensureHeader_(detailSheet, DETAIL_HEADERS);

  // index から基本情報を取得
  const indexRow = findRowByPjNumber_(indexSheet, pjNumber, 0);
  if (!indexRow) {
    return json_({ success: false, message: 'プロジェクトが見つかりません' });
  }

  const indexData = rowToIndexProject_(indexRow.values);

  // detail から詳細情報を取得
  const detailRow = findRowByPjNumber_(detailSheet, pjNumber, 0);
  const detailData = detailRow ? rowToDetailProject_(detailRow.values) : {
    pj_number: pjNumber,
    background: '',
    purpose: '',
    implementation: '',
    deliverables: '',
    reference_files: '',
    history_log: []
  };

  // マージして返す
  return json_({
    success: true,
    project: Object.assign({}, indexData, detailData)
  });
}

/**
 * 新規登録（index + detail 両方に追記）
 */
function handleAdd_(data) {
  const validation = validateProject_(data);
  if (!validation.valid) {
    return json_({ success: false, message: 'Validation failed', details: validation.errors });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const indexSheet = getIndexSheet_();
    const detailSheet = getDetailSheet_();
    
    ensureHeader_(indexSheet, INDEX_HEADERS);
    ensureHeader_(detailSheet, DETAIL_HEADERS);

    const pjNumber = data.pj_number || data.pjNumber;
    const now = new Date();
    const registeredDate = formatDate_(now, 'yyyy-MM-dd');
    const updatedAt = now.toISOString();

    // 重複チェック
    if (findRowByPjNumber_(indexSheet, pjNumber, 0)) {
      return json_({ success: false, message: 'このPJ番号は既に登録されています' });
    }

    // index に追記
    const indexRow = [
      pjNumber,
      data.project_name || data.projectName || '',
      data.project_type || data.projectType || '',
      data.category || '',
      data.term || '',
      data.client_name || data.clientName || '',
      data.summary || '',
      updatedAt,
      data.registered_by || data.registeredBy || '',
      registeredDate
    ];
    indexSheet.appendRow(indexRow);

    // detail に追記
    const detailRow = [
      pjNumber,
      data.background || '',
      data.purpose || '',
      data.implementation || '',
      data.deliverables || '',
      data.reference_files || data.referenceFiles || '',
      JSON.stringify([{
        timestamp: updatedAt,
        action: 'created',
        user: data.registered_by || data.registeredBy || ''
      }])
    ];
    detailSheet.appendRow(detailRow);

    return json_({
      success: true,
      pj_number: pjNumber,
      message: '登録しました'
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 更新（index + detail 両方を更新）
 */
function handleUpdate_(pjNumber, data) {
  if (!pjNumber) {
    return json_({ success: false, message: 'pj_number は必須です' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const indexSheet = getIndexSheet_();
    const detailSheet = getDetailSheet_();
    
    ensureHeader_(indexSheet, INDEX_HEADERS);
    ensureHeader_(detailSheet, DETAIL_HEADERS);

    const indexRow = findRowByPjNumber_(indexSheet, pjNumber, 0);
    if (!indexRow) {
      return json_({ success: false, message: 'プロジェクトが見つかりません' });
    }

    const now = new Date();
    const updatedAt = now.toISOString();

    // index を更新（pj_number 以外のフィールド）
    const indexRange = indexSheet.getRange(indexRow.rowIndex, 1, 1, INDEX_HEADERS.length);
    const currentIndex = indexRange.getValues()[0];
    
    const updatedIndex = [
      currentIndex[0], // pj_number は変更しない
      data.project_name || data.projectName || currentIndex[1],
      data.project_type || data.projectType || currentIndex[2],
      data.category || currentIndex[3],
      data.term || currentIndex[4],
      data.client_name || data.clientName || currentIndex[5],
      data.summary !== undefined ? data.summary : currentIndex[6],
      updatedAt,
      data.registered_by || data.registeredBy || currentIndex[8],
      currentIndex[9] // registered_date は変更しない
    ];
    indexRange.setValues([updatedIndex]);

    // detail を更新
    let detailRow = findRowByPjNumber_(detailSheet, pjNumber, 0);
    
    if (!detailRow) {
      // detail が存在しない場合は新規作成
      const newDetailRow = [
        pjNumber,
        data.background || '',
        data.purpose || '',
        data.implementation || '',
        data.deliverables || '',
        data.reference_files || data.referenceFiles || '',
        JSON.stringify([{
          timestamp: updatedAt,
          action: 'created_detail',
          user: data.registered_by || data.registeredBy || ''
        }])
      ];
      detailSheet.appendRow(newDetailRow);
    } else {
      // 既存の detail を更新
      const detailRange = detailSheet.getRange(detailRow.rowIndex, 1, 1, DETAIL_HEADERS.length);
      const currentDetail = detailRange.getValues()[0];
      
      // 履歴ログに追加
      let historyLog = [];
      try {
        historyLog = JSON.parse(currentDetail[6] || '[]');
      } catch (e) {
        historyLog = [];
      }
      historyLog.push({
        timestamp: updatedAt,
        action: 'updated',
        user: data.registered_by || data.registeredBy || ''
      });
      
      const updatedDetail = [
        currentDetail[0], // pj_number は変更しない
        data.background !== undefined ? data.background : currentDetail[1],
        data.purpose !== undefined ? data.purpose : currentDetail[2],
        data.implementation !== undefined ? data.implementation : currentDetail[3],
        data.deliverables !== undefined ? data.deliverables : currentDetail[4],
        data.reference_files !== undefined ? data.reference_files : (data.referenceFiles !== undefined ? data.referenceFiles : currentDetail[5]),
        JSON.stringify(historyLog)
      ];
      detailRange.setValues([updatedDetail]);
    }

    return json_({
      success: true,
      pj_number: pjNumber,
      message: '更新しました'
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 削除依頼記録
 */
function handleDeleteRequest_(data) {
  const pjNumber = String(data.pj_number || data.pjNumber || '').trim();
  const reason = String(data.reason || '').trim();

  if (!pjNumber || !reason) {
    return json_({ success: false, message: 'pj_number と reason は必須です' });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet_(ss, DELETE_REQUEST_SHEET_NAME, [
    'timestamp',
    'requestId',
    'pj_number',
    'reason',
    'password',
    'projectInfo_json',
    'clientTimestamp'
  ]);

  const timestamp = new Date();
  const requestId = `del_${timestamp.getTime()}`;
  const projectInfo = data.projectInfo ? JSON.stringify(data.projectInfo) : '';
  const clientTs = data.clientTimestamp ? String(data.clientTimestamp) : '';

  sheet.appendRow([
    timestamp.toISOString(),
    requestId,
    pjNumber,
    reason,
    String(data.password || ''),
    projectInfo,
    clientTs
  ]);

  return json_({
    success: true,
    requestId,
    message: '削除依頼を記録しました（管理者が確認します）'
  });
}

/**
 * 削除実行（TOKEN必須）
 */
function handleDelete_(data) {
  if (REQUIRE_TOKEN_FOR_DELETE && !TOKEN) {
    return json_({
      success: false,
      message: 'TOKEN が未設定のため削除は無効です'
    });
  }

  const pjNumber = String(data.pj_number || data.pjNumber || '').trim();
  const reason = String(data.reason || '').trim();
  const password = String(data.password || '').trim();

  if (!pjNumber) {
    return json_({ success: false, message: 'pj_number は必須です' });
  }
  if (!reason) {
    return json_({ success: false, message: 'reason は必須です' });
  }
  if (password !== DELETE_CONFIRM_PHRASE) {
    return json_({ success: false, message: '確認パスワードが正しくありません' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const indexSheet = getIndexSheet_();
    const detailSheet = getDetailSheet_();
    
    ensureHeader_(indexSheet, INDEX_HEADERS);
    ensureHeader_(detailSheet, DETAIL_HEADERS);

    // index から検索
    const indexRow = findRowByPjNumber_(indexSheet, pjNumber, 0);
    if (!indexRow) {
      return json_({ success: false, message: 'プロジェクトが見つかりません' });
    }

    // スナップショット取得
    const indexData = rowToIndexProject_(indexRow.values);
    const detailRow = findRowByPjNumber_(detailSheet, pjNumber, 0);
    const detailData = detailRow ? rowToDetailProject_(detailRow.values) : {};

    // ログ記録
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const logSheet = getOrCreateSheet_(ss, DELETE_LOG_SHEET_NAME, [
      'timestamp',
      'pj_number',
      'reason',
      'clientTimestamp',
      'deletedIndexRow',
      'deletedDetailRow',
      'snapshot_json'
    ]);

    logSheet.appendRow([
      new Date().toISOString(),
      pjNumber,
      reason,
      String(data.clientTimestamp || ''),
      indexRow.rowIndex,
      detailRow ? detailRow.rowIndex : '',
      JSON.stringify(Object.assign({}, indexData, detailData))
    ]);

    // 削除実行（detail → index の順）
    if (detailRow) {
      detailSheet.deleteRow(detailRow.rowIndex);
    }
    indexSheet.deleteRow(indexRow.rowIndex);

    return json_({
      success: true,
      message: '削除しました',
      pj_number: pjNumber
    });
  } finally {
    lock.releaseLock();
  }
}

// ================================
// Helper Functions
// ================================

function getIndexSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(INDEX_SHEET_NAME) || ss.getSheets()[0];
}

function getDetailSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(DETAIL_SHEET_NAME) || ss.getSheets()[1];
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

function ensureHeader_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }

  const headerValues = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const joined = headerValues.map(v => String(v || '').trim()).join('');
  if (!joined) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function findRowByPjNumber_(sheet, pjNumber, colIndex) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const numCols = sheet.getLastColumn();
  const values = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
  
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][colIndex] || '').trim() === pjNumber) {
      return {
        rowIndex: i + 2,
        values: values[i]
      };
    }
  }
  return null;
}

function rowToIndexProject_(row) {
  return {
    pj_number: row[0],
    project_name: row[1],
    project_type: row[2],
    category: row[3],
    term: dateToTerm_(row[4]), // 日付文字列を「○○期」に変換
    client_name: row[5],
    summary: row[6],
    updated_at: row[7],
    registered_by: row[8],
    registered_date: row[9]
  };
}

function rowToDetailProject_(row) {
  let historyLog = [];
  try {
    historyLog = JSON.parse(row[6] || '[]');
  } catch (e) {
    historyLog = [];
  }

  return {
    pj_number: row[0],
    background: row[1],
    purpose: row[2],
    implementation: row[3],
    deliverables: row[4],
    reference_files: row[5] || '',
    history_log: historyLog
  };
}

function validateProject_(data) {
  const errors = {};

  const pjNumber = data.pj_number || data.pjNumber;
  if (!pjNumber || String(pjNumber).trim() === '') {
    errors.pj_number = 'PJ番号は必須です';
  }

  const projectName = data.project_name || data.projectName;
  if (!projectName || String(projectName).trim() === '') {
    errors.project_name = 'プロジェクト名は必須です';
  }

  const projectType = data.project_type || data.projectType;
  if (!projectType || String(projectType).trim() === '') {
    errors.project_type = 'プロジェクトタイプは必須です';
  }

  const category = data.category;
  if (!category || String(category).trim() === '') {
    errors.category = 'カテゴリーは必須です';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

function isAuthorized_(params, e) {
  if (!TOKEN) return true;
  const token = String((params && params.token) || '').trim();
  if (token && token === TOKEN) return true;

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

function formatDate_(date, pattern) {
  const tz = Session.getScriptTimeZone() || 'Asia/Tokyo';
  return Utilities.formatDate(date, tz, pattern);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
