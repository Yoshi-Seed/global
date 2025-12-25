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

/**
 * ========================================
 * データ集計・フィルタリング設定
 * ========================================
 * 
 * ダッシュボードの集計時に使用する除外ルールとキーワードを定義
 * 登録時に正規化されたデータを前提に、集計ロジックを簡素化
 */

const AGGREGATION_CONFIG = {
  /**
   * 診療科フィールドの除外値（完全一致）
   * 
   * 対象者タイプや調査手法など、診療科として扱うべきでない値を列挙
   * register.html のマスタ管理により、新規登録時にはこれらの値は入らないが、
   * 過去のレガシーデータや手動インポートデータの除外に使用
   */
  EXACT_EXCLUDE_VALUES: [
    '医師', '患者', '介護者', 'KOL', '看護師', 
    '定性', '定量', '薬剤師', 'その他', '家族'
  ],

  /**
   * 診療科として認識するキーワード（部分一致）
   * 
   * 「○○科」「○○医」など、診療科名に含まれる典型的なキーワード
   * マスタ管理されたデータでは不要だが、レガシーデータの救済に使用
   * 
   * 注意: 登録時にマスタから選択されたデータは、このフィルタリングなしで
   *       正しく集計されることを前提とする
   */
  SPECIALTY_KEYWORDS: [
    '内科', '外科', '科医', '医', '専門医',
    '腫瘍', '循環器', '消化器', '呼吸器', '神経', '精神', 
    '小児', '産婦人科', '整形', '皮膚', '泌尿器', '眼科', 
    '耳鼻', '麻酔', '放射線', '救急', '総合', 'リウマチ', 
    '腎臓', '血液', '内分泌', '糖尿病', '乳腺', '心臓', 
    '脳神経', 'リハビリ', '病理', 'アレルギー', '代謝',
    '肝臓', '甲状腺', '診療'
  ],

  /**
   * フィールドごとの集計フィルタ基準
   * 
   * ノイズ抑制のため、各フィールドに応じた最小件数を設定
   * - specialty (診療科): prev >= 1 OR curr >= 1 (データが少ないため緩い基準)
   * - diseaseName (疾患): prev >= 1 OR curr >= 1 (同上)
   * - client (クライアント): prev >= 2 OR curr >= 3 (中程度の基準)
   * - default (その他): prev >= 5 OR curr >= 8 (厳しい基準)
   */
  FILTER_THRESHOLDS: {
    specialty: { prev: 1, curr: 1 },
    diseaseName: { prev: 1, curr: 1 },
    client: { prev: 2, curr: 3 },
    default: { prev: 5, curr: 8 }
  },

  /**
   * 今後の改善方向性
   * 
   * 1. マスタ管理の徹底:
   *    - register.html の診療科マスタを拡充
   *    - 既存データの正規化スクリプト作成
   * 
   * 2. フィルタリングロジックの段階的削減:
   *    - データが完全に正規化されたら SPECIALTY_KEYWORDS を削除可能
   *    - EXACT_EXCLUDE_VALUES も最小限に縮小
   * 
   * 3. 動的マスタ管理:
   *    - Google Sheets から診療科マスタを取得
   *    - データとマスタの一元管理
   */
};

// グローバルに公開
window.AGGREGATION_CONFIG = AGGREGATION_CONFIG;
