# Cloudflare Worker デプロイメントチェックリスト

## 現在の状況

✅ **完了済み**
- CSV列数不一致問題の修正完了
- `seed_planning_data.csv` の正規化（全425行が12列、RFC 4180準拠）
- `workers/add-project.js` の更新（全フィールドを引用符で囲む）
- 変更をmainブランチにコミット・プッシュ済み（コミット: `7b9a721`）

⏳ **保留中**
- Cloudflare Worker の本番環境へのデプロイ

## デプロイ手順

### 1. 環境変数の設定

```bash
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token-here"
```

**トークンの取得方法:**
1. Cloudflare ダッシュボードにログイン
2. プロフィール → API Tokens
3. "Create Token" → "Edit Cloudflare Workers" テンプレートを使用
4. 必要な権限: `Workers Scripts:Edit`

### 2. Wrangler でデプロイ

```bash
cd /home/user/webapp/project-tracker
npx wrangler deploy workers/add-project.js
```

### 3. デプロイ確認

デプロイ後、以下を確認してください：

```bash
# デプロイされたWorkerのURL表示
npx wrangler deployments list
```

### 4. 動作テスト

新規プロジェクト登録フォームから以下のテストデータで送信：

```json
{
  "diseaseName": "Test, Disease",
  "diseaseAbbr": "TD",
  "method": "アンケート, 調査",
  "surveyType": "定量",
  "targetType": "患者",
  "specialty": "内科, 外科",
  "recruitCount": 5,
  "targetConditions": "特になし",
  "drug": "なし",
  "recruitCompany": "テスト会社",
  "client": "Test \"Client\" Name"
}
```

### 5. 検証ポイント

生成されたPRで以下を確認：

✅ CSV行が12列すべてに引用符が付いている
```csv
"Test, Disease","TD","アンケート, 調査","定量","患者","内科, 外科","5","特になし","なし","テスト会社","Test ""Client"" Name","2025-01-15"
```

✅ GitHubのCSVプレビューでエラーが出ない
```
https://github.com/Yoshi-Seed/global/blob/your-pr-branch/project-tracker/seed_planning_data.csv
```

✅ カンマを含む値が正しく1つのセルとして表示される

## トラブルシューティング

### デプロイエラーが発生した場合

```bash
# Wranglerのバージョン確認
npx wrangler --version

# ログイン状態の確認
npx wrangler whoami

# 再ログイン
npx wrangler login
```

### Worker が動作しない場合

1. Cloudflare ダッシュボードで Worker のログを確認
2. `wrangler tail` でリアルタイムログを表示：
   ```bash
   npx wrangler tail
   ```

## 変更内容の詳細

### 修正前のコード（問題あり）

```javascript
function escapeCSV(field) {
  // 条件付きクオート - カンマ/改行/引用符がある場合のみ
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;  // ← 問題: クオートなしで返す
}

function generateCSVRow(data) {
  const fields = [
    escapeCSV(data.diseaseName || ''),
    // ...
    data.recruitCount || '0',  // ← クオートなし
    // ...
  ];
  return fields.join(',');
}
```

### 修正後のコード（RFC 4180準拠）

```javascript
function generateCSVRow(data) {
  const registeredDate = data.createdAt 
    ? new Date(data.createdAt).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];
  
  const fields = [
    data.diseaseName || '',
    data.diseaseAbbr || '',
    data.method || '',
    data.surveyType || '',
    data.targetType || '',
    data.specialty || '',
    String(data.recruitCount || '0'),
    data.targetConditions || '',
    data.drug || '',
    data.recruitCompany || '',
    data.client || '',
    registeredDate,
  ];
  
  // 全フィールドを必ずクオート - RFC 4180準拠
  return fields.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
}
```

**変更のポイント:**
- `escapeCSV()` 関数を削除
- すべてのフィールドを必ず `"` で囲む
- 内部の `"` は `""` にエスケープ
- カンマの有無に関わらず一貫した形式

## 参考資料

- [RFC 4180 - CSV標準仕様](https://www.rfc-editor.org/rfc/rfc4180)
- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers/)
- 詳細な修正履歴: `CSV_COLUMN_MISMATCH_FIX.md`

---

**作成日**: 2025-10-21  
**最終更新**: 2025-10-21  
**関連コミット**: `7b9a721`
