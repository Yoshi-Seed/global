/**
 * Cloudflare Worker: プロジェクト追加API
 * GitHub REST APIを使用してCSVに追記し、PRを作成
 */

// CORS対応
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // OPTIONSリクエスト（CORS preflight）
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // POSTメソッドのみ許可
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
      const CSV_PATH = 'project-tracker/seed_planning_data.csv';

      // タイムスタンプとブランチ名生成
      const timestamp = new Date().toISOString();
      const branchName = `pr/add-record-${timestamp.replace(/[:.]/g, '-')}`;

      // GitHub REST APIでPR作成フロー実行
      const result = await createGitHubPR({
        token: GITHUB_TOKEN,
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        csvPath: CSV_PATH,
        branchName,
        projectData: {
          ...projectData,
          createdAt: timestamp,
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
};

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
  const refData = await refResponse.json();
  const mainSha = refData.object.sha;

  // 2. 新しいブランチ作成
  await fetch(`${apiBase}/git/refs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: mainSha,
    }),
  });

  // 3. 既存のCSVファイル取得
  const fileResponse = await fetch(`${apiBase}/contents/${csvPath}?ref=main`, { headers });
  const fileData = await fileResponse.json();
  const currentContent = atob(fileData.content); // Base64デコード
  const currentSha = fileData.sha;

  // 4. CSV行を生成
  const newRow = generateCSVRow(projectData);
  const updatedContent = currentContent.trim() + '\n' + newRow;

  // 5. CSVファイルを更新（新しいブランチにコミット）
  await fetch(`${apiBase}/contents/${csvPath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Add project: ${projectData.diseaseName}`,
      content: btoa(updatedContent), // Base64エンコード
      sha: currentSha,
      branch: branchName,
    }),
  });

  // 6. PR作成
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

  const prData = await prResponse.json();

  return {
    prUrl: prData.html_url,
    prNumber: prData.number,
  };
}

/**
 * CSV行を生成
 */
function generateCSVRow(data) {
  const fields = [
    escapeCSV(data.diseaseName || ''),
    escapeCSV(data.diseaseAbbr || ''),
    escapeCSV(data.method || ''),
    escapeCSV(data.surveyType || ''),
    escapeCSV(data.targetType || ''),
    escapeCSV(data.specialty || ''),
    data.recruitCount || '0',
    escapeCSV(data.targetConditions || ''),
    escapeCSV(data.drug || ''),
    escapeCSV(data.recruitCompany || ''),
    escapeCSV(data.client || ''),
  ];
  return fields.join(',');
}

/**
 * CSVフィールドのエスケープ
 */
function escapeCSV(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * PR本文を生成
 */
function generatePRBody(data) {
  return `## 新規案件追加

### 案件情報
- **疾患名:** ${data.diseaseName}
- **疾患略語:** ${data.diseaseAbbr || '-'}
- **手法:** ${data.method}
- **調査種別:** ${data.surveyType}
- **対象者種別:** ${data.targetType}
- **専門:** ${data.specialty || '-'}
- **実績数:** ${data.recruitCount}名
- **対象条件:** ${data.targetConditions || '-'}
- **薬剤:** ${data.drug || '-'}
- **リクルート実施:** ${data.recruitCompany || '-'}
- **クライアント:** ${data.client || '-'}

${data.createdBy ? `\n**登録者:** ${data.createdBy}` : ''}

**登録日時:** ${data.createdAt}

---
このPRは自動生成されました。内容を確認してマージしてください。
`;
}
