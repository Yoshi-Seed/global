/**
 * Seed Planning Project Management System - Frontend Configuration
 * 
 * Google Apps Script のウェブアプリURLとトークンを設定します。
 */

const GAS_CONFIG = {
  // ✅ GAS ウェブアプリのURL
  URL: "https://script.google.com/macros/s/AKfycbxC6kTVyDOY4DbyLnra4w6Fj6Fes7GsI0MIwAHOZaTMUkn_LTdR5QwYMYnYYTwogKxB0g/exec",
  
  // 🔐 トークン（GAS側のTOKENと一致させる。空文字の場合はトークンチェックなし）
  TOKEN: "",
  
  // ⏱️ キャッシュ有効期限（ミリ秒）
  CACHE_TTL_MS: 60000,  // 60秒
  
  // 🔄 リトライ設定
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
};

// デバッグモード（開発時のみtrueに設定）
const DEBUG_MODE = false;

// ログ出力ヘルパー
function log(...args) {
  if (DEBUG_MODE) {
    console.log('[SeedPlanning]', ...args);
  }
}

function logError(...args) {
  console.error('[SeedPlanning Error]', ...args);
}
