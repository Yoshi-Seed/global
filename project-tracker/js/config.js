/**
 * プロジェクトトラッカー - 共通設定
 * Cloudflare Worker API エンドポイント
 */

// Cloudflare Worker API Base URL
const API_CONFIG = {
  BASE_URL: 'https://project-tracker-api.y-honda.workers.dev',
  
  // エンドポイント
  ENDPOINTS: {
    DATA: '/data',           // GET: GitHub main CSVを取得
    SUBMIT: '/',             // POST: PR作成
  },
  
  // キャッシュ設定
  CACHE: {
    TTL: 60000,              // 1分（ミリ秒）
  },
};

// 便利な関数
const API = {
  // データ取得URL
  getDataUrl() {
    return API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DATA;
  },
  
  // PR作成URL
  getSubmitUrl() {
    return API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SUBMIT;
  },
};
