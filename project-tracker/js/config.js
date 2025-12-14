/**
 * プロジェクトトラッカー（Mirror） - 共通設定
 * 
 * ✅ Cloudflare Worker/GitHub PR方式 → ✅ Google Apps Script（Webアプリ）＋Google Sheets方式
 * 
 * 使い方:
 * 1) Google Apps Script をウェブアプリとしてデプロイ
 * 2) 表示された URL を GAS_CONFIG.URL に貼り付け
 * 3) 必要なら TOKEN も設定（GAS側と同じ値）
 */

const GAS_CONFIG = {
  // 例: "https://script.google.com/macros/s/XXXX/exec"
  URL: "https://script.google.com/macros/s/AKfycbxptce9pO1HdTCNjCfRI5btJ0X7zAtxy4hh68w3TyfVC-5sdzHIsMfT6bcfvAXGA7XL/exec",

  // 任意: 簡易トークン（GAS側の TOKEN と一致させる）
  TOKEN: "yoshi-pt-2025-secret",

  // キャッシュ設定（クライアント側）
  CACHE_TTL_MS: 60000,
};

function buildUrl_(baseUrl, params = {}) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

// フロント側API
const API = {
  // action:
  // - list: 一覧取得
  // - add: 新規登録
  // - delete: 削除（本体シートから削除）
  // - delete_request: 削除依頼（別シートに記録）※必要なら
  getUrl(action) {
    if (!GAS_CONFIG.URL) return '';
    return buildUrl_(GAS_CONFIG.URL, {
      action,
      token: GAS_CONFIG.TOKEN || undefined,
    });
  },

  getDataUrl() {
    return this.getUrl('list');
  },

  getSubmitUrl() {
    return this.getUrl('add');
  },

  getDeleteUrl() {
    return this.getUrl('delete');
  },

  // 互換用（必要なら削除依頼ログを残す）
  getDeleteRequestUrl() {
    return this.getUrl('delete_request');
  },
};
