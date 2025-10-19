# Project Tracker API - Cloudflare Worker

このWorkerは、新規プロジェクトをGitHub経由で追加するためのAPIエンドポイントを提供します。

## セットアップ

### 1. Wrangler CLIのインストール

```bash
npm install -g wrangler
```

### 2. Cloudflareにログイン

```bash
wrangler login
```

### 3. 環境変数の設定

GitHub Personal Access Tokenを設定します（repo権限が必要）:

```bash
wrangler secret put GITHUB_TOKEN
# プロンプトでトークンを入力

wrangler secret put GITHUB_OWNER
# 入力: Yoshi-Seed

wrangler secret put GITHUB_REPO
# 入力: global
```

### 4. デプロイ

```bash
cd workers
wrangler deploy
```

デプロイ後、URLが表示されます（例: `https://project-tracker-api.your-subdomain.workers.dev`）

## APIエンドポイント

### POST /

新規プロジェクトを追加し、PRを作成します。

**リクエストボディ（JSON）:**

```json
{
  "diseaseName": "アルツハイマー型認知症",
  "diseaseAbbr": "AD",
  "method": "IDI",
  "surveyType": "定性",
  "targetType": "医師",
  "specialty": "脳神経内科",
  "recruitCount": 50,
  "targetConditions": "専門医資格保有",
  "drug": "ドネペジル",
  "recruitCompany": "SEED PLANNING",
  "client": "製薬会社A",
  "createdBy": "山田太郎"
}
```

**レスポンス（成功）:**

```json
{
  "success": true,
  "prUrl": "https://github.com/Yoshi-Seed/global/pull/123",
  "prNumber": 123,
  "message": "PRを作成しました"
}
```

**レスポンス（バリデーションエラー）:**

```json
{
  "error": "Validation failed",
  "details": {
    "diseaseName": "疾患名は必須です",
    "recruitCount": "実績数は0以上の整数で入力してください"
  }
}
```

## GitHub Personal Access Token の作成方法

1. GitHubにログイン
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. "Generate new token (classic)" をクリック
4. 以下の権限を選択:
   - `repo` (Full control of private repositories)
5. トークンを生成してコピー
6. `wrangler secret put GITHUB_TOKEN` でトークンを設定

## セキュリティ

- GitHub tokenは環境変数として安全に保存されます
- CORSヘッダーが設定されており、ブラウザから直接呼び出せます
- バリデーションによりデータの整合性を保証します

## トラブルシューティング

### デプロイエラー

```bash
# ログを確認
wrangler tail

# 設定を確認
wrangler whoami
```

### API呼び出しエラー

- GitHub tokenの権限を確認
- リポジトリ名とオーナー名が正しいか確認
- CSVファイルのパスが正しいか確認
