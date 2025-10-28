/**
 * Cloudflare Worker: プロジェクト追加API
 * GitHub REST APIを使用してCSVに追記し、PRを作成
 */

// CORS対応
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// キャッシュTTL（秒）
const CACHE_TTL = 300; // 5分

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // OPTIONSリクエスト（CORS preflight）
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ルーティング
    if (url.pathname === '/data' && request.method === 'GET') {
      return handleGetData(request, env, ctx);
    }
    
    if (request.method === 'POST') {
      return handlePostProject(request, env);
    }

    if (request.method === 'DELETE') {
      return handleDeleteRequest(request, env);
    }

    // その他のメソッド・パスは405
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

/**
 * GET /data - GitHub mainブランチのCSVデータを取得（キャッシュ付き）
 */
async function handleGetData(request, env, ctx) {
  const GITHUB_OWNER = env.GITHUB_OWNER || 'Yoshi-Seed';
  const GITHUB_REPO = env.GITHUB_REPO || 'global';
  const CSV_PATH = env.CSV_PATH || 'project-tracker/seed_planning_data.csv';
  
  // GitHub RawコンテンツURL（Public リポジトリの場合）
  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${CSV_PATH}`;
  
  // キャッシュキー
  const cacheKey = new Request(rawUrl, { method: 'GET' });
  const cache = caches.default;
  
  // キャッシュチェック
  let response = await cache.match(cacheKey);
  
  if (!response) {
    // キャッシュミス: GitHubから取得
    response = await fetch(rawUrl);
    
    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch CSV from GitHub',
        status: response.status 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // レスポンスをクローンしてキャッシュに保存
    const csvText = await response.text();
    
    // キャッシュ可能なレスポンスを作成
    response = new Response(csvText, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': `public, max-age=${CACHE_TTL}`,
      },
    });
    
    // キャッシュに保存（非同期）
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }
  
  return response;
}

/**
 * POST / - プロジェクト追加（PR作成）
 */
async function handlePostProject(request, env) {

  try {
    // リクエストボディを取得
    const projectData = await request.json();

    // バリデーション
    const validation = validateProject(projectData);
    if (!validation.valid) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed', 
        details: validation.errors 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GitHub API設定
    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    const GITHUB_OWNER = env.GITHUB_OWNER || 'Yoshi-Seed';
    const GITHUB_REPO = env.GITHUB_REPO || 'global';
    const CSV_PATH = env.CSV_PATH || 'project-tracker/seed_planning_data.csv';

    // タイムスタンプとブランチ名生成（ミリ秒 + ランダム値で一意性を確保）
    const timestamp = Date.now(); // Unix timestamp in milliseconds
    const randomSuffix = Math.random().toString(36).substring(2, 8); // 6文字のランダム文字列
    const branchName = `pr/add-record-${timestamp}-${randomSuffix}`;
    
    // ISO形式のタイムスタンプ
    const isoTimestamp = new Date(timestamp).toISOString();

    // GitHub REST APIでPR作成フロー実行
    const result = await createGitHubPR({
      token: GITHUB_TOKEN,
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      csvPath: CSV_PATH,
      branchName,
      projectData: {
        ...projectData,
        createdAt: isoTimestamp,
      },
    });

    // 成功レスポンス
    return new Response(JSON.stringify({
      success: true,
      prUrl: result.prUrl,
      prNumber: result.prNumber,
      message: 'PRを作成しました',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

/**
 * プロジェクトデータのバリデーション
 */
function validateProject(data) {
  const errors = {};

  // 必須項目チェック
  if (!data.diseaseName || data.diseaseName.trim() === '') {
    errors.diseaseName = '疾患名は必須です';
  }

  if (!data.method || data.method.trim() === '') {
    errors.method = '手法は必須です';
  }

  if (!data.surveyType || data.surveyType.trim() === '') {
    errors.surveyType = '調査種別は必須です';
  }

  if (!data.targetType || data.targetType.trim() === '') {
    errors.targetType = '対象者種別は必須です';
  }

  // 対象者種別の列挙チェック
  const validTargetTypes = ['医師', '患者', '介護者', '医師・患者', 'KOL', '看護師', '薬剤師'];
  if (data.targetType && !validTargetTypes.includes(data.targetType)) {
    errors.targetType = '対象者種別が不正です';
  }

  // 実績数のチェック
  if (!data.recruitCount) {
    errors.recruitCount = '実績数は必須です';
  } else {
    const count = parseInt(data.recruitCount, 10);
    if (isNaN(count) || count < 0) {
      errors.recruitCount = '実績数は0以上の整数で入力してください';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * GitHub REST APIでPRを作成
 */
async function createGitHubPR({ token, owner, repo, csvPath, branchName, projectData }) {
  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Cloudflare-Worker-Project-Tracker',
  };

  // 1. mainブランチの最新SHA取得
  const refResponse = await fetch(`${apiBase}/git/refs/heads/main`, { headers });
  
  if (!refResponse.ok) {
    let errorData;
    try {
      errorData = await refResponse.json();
    } catch (e) {
      errorData = { message: refResponse.statusText };
    }
    throw new Error(`Failed to fetch main branch ref (${refResponse.status}): ${errorData.message || refResponse.statusText}`);
  }
  
  const refData = await refResponse.json();
  
  if (!refData || !refData.object || !refData.object.sha) {
    throw new Error(`Invalid main branch ref data: ${JSON.stringify(refData)}`);
  }
  
  const mainSha = refData.object.sha;

  // 2. 新しいブランチ作成
  const createBranchResponse = await fetch(`${apiBase}/git/refs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: mainSha,
    }),
  });
  
  if (!createBranchResponse.ok) {
    let errorData;
    try {
      errorData = await createBranchResponse.json();
    } catch (e) {
      errorData = { message: createBranchResponse.statusText };
    }
    throw new Error(`Failed to create branch ${branchName} (${createBranchResponse.status}): ${errorData.message || createBranchResponse.statusText}`);
  }

  // 3. 既存のCSVファイル取得
  const fileResponse = await fetch(`${apiBase}/contents/${csvPath}?ref=main`, { headers });
  
  if (!fileResponse.ok) {
    let errorData;
    try {
      errorData = await fileResponse.json();
    } catch (e) {
      errorData = { message: fileResponse.statusText };
    }
    throw new Error(`Failed to fetch CSV file (${fileResponse.status}): ${errorData.message || fileResponse.statusText}. Path: ${csvPath}`);
  }
  
  let fileData;
  try {
    fileData = await fileResponse.json();
  } catch (e) {
    throw new Error(`Failed to parse GitHub API response: ${e.message}`);
  }
  
  if (!fileData) {
    throw new Error(`GitHub API returned undefined fileData. Response status: ${fileResponse.status}`);
  }
  
  if (!fileData.content) {
    throw new Error(`CSV file content is empty or undefined. FileData keys: ${Object.keys(fileData).join(', ')}`);
  }
  
  if (!fileData.sha) {
    throw new Error(`CSV file SHA is missing. FileData keys: ${Object.keys(fileData).join(', ')}`);
  }
  
  const currentContent = base64DecodeUTF8(fileData.content.replace(/\n/g, '')); // Base64デコード（UTF-8対応）
  const currentSha = fileData.sha;

  // 4. 既存CSVから最大IDを取得して新IDを採番
  const maxId = getMaxIdFromCSV(currentContent);
  const newId = maxId + 1;
  
  // デバッグログ
  console.log(`[ID Generation] Max ID found: ${maxId}, New ID: ${newId}`);
  
  // 4.5. registrationIdを生成（YYYYMMDD-XXXX形式、日付ごとの連番）
  const registrationId = generateRegistrationId(currentContent, projectData.createdAt);
  
  // 4.6. registrationIDの重複チェック（念のため）
  if (registrationIdExists(currentContent, registrationId)) {
    throw new Error(`Registration ID ${registrationId} already exists. This may be caused by concurrent requests. Please retry.`);
  }
  
  // 5. CSV行を生成
  const newRow = generateCSVRow(projectData, newId, registrationId);
  const updatedContent = currentContent.trim() + '\n' + newRow;

  // 6. CSVファイルを更新（新しいブランチにコミット）
  const updateFileResponse = await fetch(`${apiBase}/contents/${csvPath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Add project: ${projectData.diseaseName}`,
      content: base64EncodeUTF8(updatedContent), // Base64エンコード（UTF-8対応）
      sha: currentSha,
      branch: branchName,
    }),
  });
  
  if (!updateFileResponse.ok) {
    let errorData;
    try {
      errorData = await updateFileResponse.json();
    } catch (e) {
      errorData = { message: updateFileResponse.statusText };
    }
    throw new Error(`Failed to update CSV file (${updateFileResponse.status}): ${errorData.message || updateFileResponse.statusText}`);
  }

  // 7. PR作成
  const prResponse = await fetch(`${apiBase}/pulls`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: `新規案件追加: ${projectData.diseaseName}`,
      head: branchName,
      base: 'main',
      body: generatePRBody(projectData),
    }),
  });

  if (!prResponse.ok) {
    let errorData;
    try {
      errorData = await prResponse.json();
    } catch (e) {
      errorData = { message: prResponse.statusText };
    }
    throw new Error(`Failed to create PR (${prResponse.status}): ${errorData.message || prResponse.statusText}`);
  }

  const prData = await prResponse.json();

  return {
    prUrl: prData.html_url,
    prNumber: prData.number,
  };
}

/**
 * CSVから最大IDを取得
 * ダブルクォート付き・なし両方に対応
 * 埋め込み改行にも対応
 */
function getMaxIdFromCSV(csvContent) {
  // より堅牢な方法：行の先頭のIDフィールドのみを抽出
  // 改行を含むフィールドがあっても、行の開始位置にあるIDは確実に取得できる
  
  let maxId = 0;
  
  // 方法1: 各行の先頭からIDを抽出（ダブルクォート対応）
  // 行の開始（^または\n）+ オプショナルなダブルクォート + 数字 + オプショナルなダブルクォート + カンマ
  const idPattern = /(?:^|\n)"?(\d+)"?,/g;
  let match;
  
  while ((match = idPattern.exec(csvContent)) !== null) {
    const id = parseInt(match[1], 10);
    if (!isNaN(id) && id > maxId) {
      maxId = id;
    }
  }
  
  // 方法2（バックアップ）: 行ベースでチェック
  // 方法1で見つからない場合のフォールバック
  if (maxId === 0) {
    const lines = csvContent.trim().split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // CSVの最初のカラム（id）を取得
      // ダブルクォートあり: "123",...
      // ダブルクォートなし: 123,...
      const lineMatch = line.match(/^"?(\d+)"?,/);
      if (lineMatch) {
        const id = parseInt(lineMatch[1], 10);
        if (!isNaN(id) && id > maxId) {
          maxId = id;
        }
      }
    }
  }
  
  return maxId;
}

/**
 * registrationIdを生成（YYYYMMDD-XXXX形式、日付ごとの連番）
 */
function generateRegistrationId(csvContent, createdAt) {
  const date = createdAt ? new Date(createdAt) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // 同じ日付のregistrationIDを全て取得して最大連番を見つける
  const lines = csvContent.trim().split('\n');
  let maxSeq = 0;
  const prefix = `${dateStr}-`;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSVの2列目（registrationId）を取得
    // フォーマット: "id","registrationId",...
    const match = line.match(/^"?\d+"?\s*,\s*"?([^",]+)"?/);
    if (match && match[1].startsWith(prefix)) {
      // YYYYMMDD-XXXX から XXXX部分を抽出
      const parts = match[1].split('-');
      if (parts.length === 2) {
        const seq = parseInt(parts[1], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  }
  
  // 次の連番を生成
  const newSeq = maxSeq + 1;
  const seqStr = String(newSeq).padStart(4, '0');
  
  return `${dateStr}-${seqStr}`;
}

/**
 * registrationIDが既に存在するかチェック
 */
function registrationIdExists(csvContent, registrationId) {
  const lines = csvContent.trim().split('\n');
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSVの2列目（registrationId）を取得
    const match = line.match(/^"?\d+"?\s*,\s*"?([^",]+)"?/);
    if (match && match[1] === registrationId) {
      return true;
    }
  }
  
  return false;
}

/**
 * フィールド値を正規化してExcel表示問題を防ぐ
 */
function normalizeField(value) {
  if (!value) return value;
  
  let normalized = String(value);
  
  // 改行文字を全角セミコロンに置換（Excel表示問題を防ぐ）
  normalized = normalized.replace(/\r\n/g, '；');
  normalized = normalized.replace(/\r/g, '；');
  normalized = normalized.replace(/\n/g, '；');
  
  // 連続する全角セミコロンを1つに
  normalized = normalized.replace(/；+/g, '；');
  
  // 先頭・末尾の全角セミコロンを削除
  normalized = normalized.replace(/^；+|；+$/g, '');
  
  return normalized;
}

/**
 * 専門フィールドを正規化（カンマも置換）
 */
function normalizeSpecialty(value) {
  if (!value) return value;
  
  let normalized = normalizeField(value);
  
  // カンマを全角カンマに置換（Excel表示問題を防ぐ）
  normalized = normalized.replace(/,/g, '，');
  
  return normalized;
}

/**
 * CSV行を生成
 */
function generateCSVRow(data, id, registrationId) {
  // 登録日（YYYY-MM-DD形式）
  const registeredDate = data.createdAt 
    ? new Date(data.createdAt).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];
  
  const fields = [
    String(id),              // 1列目: id
    registrationId,          // 2列目: registrationId
    normalizeField(data.diseaseName || ''),  // 3列目: 疾患名
    normalizeField(data.diseaseAbbr || ''),  // 4列目: 疾患略語
    normalizeField(data.method || ''),       // 5列目: 手法
    normalizeField(data.surveyType || ''),   // 6列目: 調査種別
    normalizeField(data.targetType || ''),   // 7列目: 対象者種別
    normalizeSpecialty(data.specialty || ''),    // 8列目: 専門（カンマも正規化）
    String(data.recruitCount || '0'), // 9列目: 実績数
    data.inquiryOnly ? 'TRUE' : 'FALSE', // 10列目: 問合せのみ
    normalizeField(data.targetConditions || ''), // 11列目: 対象条件
    normalizeField(data.drug || ''),         // 12列目: 薬剤
    normalizeField(data.recruitCompany || ''), // 13列目: リクルート実施
    normalizeField(data.moderator || ''),    // 14列目: モデレーター
    normalizeField(data.client || ''),       // 15列目: クライアント
    normalizeField(data.endClient || ''),    // 16列目: エンドクライアント
    normalizeField(data.projectNumber || ''), // 17列目: PJ番号
    normalizeField(data.implementationDate || ''), // 18列目: 実施年月
    normalizeField(data.registrant || ''),   // 19列目: 登録担当
    registeredDate,          // 20列目: 登録日
  ];
  
  // すべてのフィールドを引用符で囲み、内部の引用符をエスケープ
  return fields.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
}

/**
 * CSVフィールドのエスケープ（後方互換性のため保持、未使用）
 * @deprecated generateCSVRow で直接処理するため不要
 */
function escapeCSV(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * UTF-8文字列をBase64エンコード
 */
function base64EncodeUTF8(str) {
  // UTF-8バイト配列に変換
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(str);
  
  // バイト配列をバイナリ文字列に変換
  let binaryString = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  
  // Base64エンコード
  return btoa(binaryString);
}

/**
 * Base64をUTF-8文字列にデコード
 */
function base64DecodeUTF8(base64) {
  // Base64デコード
  const binaryString = atob(base64);
  
  // バイナリ文字列をバイト配列に変換
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  
  // UTF-8文字列にデコード
  const decoder = new TextDecoder();
  return decoder.decode(uint8Array);
}

/**
 * PR本文を生成
 */
function generatePRBody(data) {
  return `## 新規案件追加

### 基本情報
- **疾患名:** ${data.diseaseName}
- **疾患略語:** ${data.diseaseAbbr || '-'}
- **手法:** ${data.method}
- **調査種別:** ${data.surveyType}
- **対象者種別:** ${data.targetType}
- **専門:** ${data.specialty || '-'}
- **実績数:** ${data.recruitCount}名${data.inquiryOnly ? ' ⚠️ **問合せのみ（推定回収数）**' : ''}
- **対象条件:** ${data.targetConditions || '-'}
- **薬剤:** ${data.drug || '-'}

### プロジェクト情報
- **リクルート実施:** ${data.recruitCompany || '-'}
- **モデレーター:** ${data.moderator || '-'}
- **クライアント:** ${data.client || '-'}
- **エンドクライアント:** ${data.endClient || '-'}
- **PJ番号:** ${data.projectNumber || '-'}
- **実施年月:** ${data.implementationDate || '-'}
- **登録担当:** ${data.registrant || '-'}

${data.createdBy ? `\n**登録者:** ${data.createdBy}` : ''}

**登録日時:** ${data.createdAt}

---
このPRは自動生成されました。内容を確認してマージしてください。
`;
}

/**
 * DELETE リクエスト - 削除依頼PRを作成
 */
async function handleDeleteRequest(request, env) {
  try {
    const data = await request.json();
    
    // バリデーション
    if (!data.id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'データIDが指定されていません' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!data.reason || data.reason.trim() === '') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '削除理由を入力してください' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (data.password !== 'delete') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'パスワードが正しくありません' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GitHub設定
    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    const GITHUB_OWNER = env.GITHUB_OWNER || 'Yoshi-Seed';
    const GITHUB_REPO = env.GITHUB_REPO || 'global';
    const CSV_PATH = env.CSV_PATH || 'project-tracker/seed_planning_data.csv';
    
    if (!GITHUB_TOKEN) {
      throw new Error('GitHub token is not configured');
    }

    const headers = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Cloudflare-Worker',
    };

    // 1. main ブランチの最新SHAを取得
    const mainRefResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/main`,
      { headers }
    );
    
    if (!mainRefResponse.ok) {
      throw new Error(`Failed to get main branch: ${mainRefResponse.statusText}`);
    }

    const mainRef = await mainRefResponse.json();
    const mainSha = mainRef.object.sha;

    // 2. 現在のCSVファイルを取得
    const csvResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CSV_PATH}?ref=main`,
      { headers }
    );

    if (!csvResponse.ok) {
      throw new Error(`Failed to get CSV file: ${csvResponse.statusText}`);
    }

    const csvData = await csvResponse.json();
    const currentContent = base64DecodeUTF8(csvData.content);

    // 3. 指定されたIDの行を削除
    const lines = currentContent.split('\n');
    const headerLine = lines[0];
    let deletedLine = null;
    
    const updatedLines = lines.filter((line, index) => {
      if (index === 0) return true; // ヘッダー行は保持
      if (!line.trim()) return false; // 空行は削除
      
      // IDをチェック（引用符あり/なしに対応）
      const lineMatch = line.match(/^"?(\d+)"?,/);
      if (lineMatch && lineMatch[1] === String(data.id)) {
        deletedLine = line;
        return false; // この行を削除
      }
      return true;
    });

    if (!deletedLine) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: `ID ${data.id} のレコードが見つかりませんでした` 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const updatedContent = updatedLines.join('\n');

    // 4. 新しいブランチを作成
    const timestamp = Date.now();
    const branchName = `delete-request-${data.id}-${timestamp}`;
    
    const createBranchResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: mainSha,
        }),
      }
    );

    if (!createBranchResponse.ok) {
      throw new Error(`Failed to create branch: ${createBranchResponse.statusText}`);
    }

    // 5. 新しいブランチにCSVを更新
    const updateFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CSV_PATH}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `🗑️ 削除依頼: ID ${data.id} - ${data.projectInfo?.diseaseName || ''}`,
          content: base64EncodeUTF8(updatedContent),
          sha: csvData.sha,
          branch: branchName,
        }),
      }
    );

    if (!updateFileResponse.ok) {
      const errorText = await updateFileResponse.text();
      throw new Error(`Failed to update file: ${updateFileResponse.statusText} - ${errorText}`);
    }

    // 6. Pull Requestを作成
    const prTitle = `🗑️ 削除依頼: ID ${data.id} - ${data.projectInfo?.diseaseName || '不明'}`;
    const prBody = generateDeletePRBody(data);

    const createPRResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: prTitle,
          body: prBody,
          head: branchName,
          base: 'main',
        }),
      }
    );

    if (!createPRResponse.ok) {
      const errorText = await createPRResponse.text();
      throw new Error(`Failed to create PR: ${createPRResponse.statusText} - ${errorText}`);
    }

    const pr = await createPRResponse.json();
    console.log(`[削除依頼PR作成] PR #${pr.number}: ${pr.html_url}`);

    // 成功レスポンス
    return new Response(JSON.stringify({
      success: true,
      message: `削除依頼PRが作成されました (PR #${pr.number})`,
      prUrl: pr.html_url,
      prNumber: pr.number,
      branchName: branchName,
      deletedId: data.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[削除依頼エラー]', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || '削除依頼PRの作成に失敗しました',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

/**
 * 削除依頼PR用の本文を生成
 */
function generateDeletePRBody(data) {
  const projectInfo = data.projectInfo || {};
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return `## 🗑️ 削除依頼

### 削除対象
- **データID**: ${data.id}
- **登録ID**: ${projectInfo.registrationId || '-'}
- **疾患名**: ${projectInfo.diseaseName || '-'}
- **疾患略語**: ${projectInfo.diseaseAbbr || '-'}
- **対象者種別**: ${projectInfo.targetType || '-'}
- **実績数**: ${projectInfo.recruitCount || 0}名
- **クライアント**: ${projectInfo.client || '-'}

### 削除理由
\`\`\`
${data.reason}
\`\`\`

### 削除依頼日時
${timestamp}

---
⚠️ **注意**: この PR をマージすると、上記のレコードが CSV から完全に削除されます。

内容を確認の上、問題なければマージしてください。
削除をキャンセルする場合は、この PR をクローズしてください。

---
このPRは削除依頼システムにより自動生成されました。
`;
}
