# プロジェクト履歴管理システム - デプロイ手順

このドキュメントでは、GitHub PR自動作成機能を含む完全なシステムのデプロイ手順を説明します。

## アーキテクチャ

```
ブラウザ (register.html)
    ↓ POST JSON
Cloudflare Worker (add-project.js)
    ↓ GitHub REST API
GitHub Repository
    ├─ 新ブランチ作成
    ├─ CSV追記コミット
    └─ PR作成
```

## 前提条件

- GitHub アカウント
- Cloudflare アカウント（無料プランでOK）
- Node.js がインストールされていること（Wrangler CLIのため）

---

## Step 1: GitHub Personal Access Token の作成

1. **GitHubにログイン**

2. **Settings → Developer settings → Personal access tokens → Tokens (classic)**

3. **「Generate new token (classic)」をクリック**

4. **トークン設定:**
   - Note: `Project Tracker API`
   - Expiration: 適切な期限を選択（90 days推奨）
   - Scopes: 
     - ✅ `repo` (Full control of private repositories)

5. **トークンをコピーして安全な場所に保存**

---

## Step 2: Cloudflare Worker のデプロイ

### 2-1. Wrangler CLIのインストール

```bash
npm install -g wrangler
```

### 2-2. Cloudflareにログイン

```bash
wrangler login
```

ブラウザが開くのでログインします。

### 2-3. Worker ディレクトリに移動

```bash
cd project-tracker/workers
```

### 2-4. 環境変数（シークレット）の設定

```bash
# GitHub Personal Access Token
wrangler secret put GITHUB_TOKEN
# プロンプトで先ほどコピーしたトークンを貼り付け

# GitHubオーナー名
wrangler secret put GITHUB_OWNER
# 入力: Yoshi-Seed

# GitHubリポジトリ名
wrangler secret put GITHUB_REPO
# 入力: global
```

### 2-5. Worker をデプロイ

```bash
wrangler deploy
```

デプロイに成功すると、URLが表示されます:

```
Published project-tracker-api
  https://project-tracker-api.your-subdomain.workers.dev
```

このURLをコピーしておきます。

---

## Step 3: register.html の API エンドポイント設定

### 3-1. register.html を編集

`register.html` の中の以下の行を探します:

```javascript
const API_ENDPOINT = 'https://project-tracker-api.your-subdomain.workers.dev';
```

### 3-2. Worker URLに置き換え

Step 2-5 でコピーしたURLに変更します:

```javascript
const API_ENDPOINT = 'https://project-tracker-api.your-actual-subdomain.workers.dev';
```

### 3-3. 変更をコミット・プッシュ

```bash
git add register.html
git commit -m "feat: Cloudflare Worker APIエンドポイントを設定"
git push origin main
```

---

## Step 4: 動作確認

### 4-1. GitHub Pages で register.html を開く

https://yoshi-seed.github.io/global/project-tracker/register.html

### 4-2. フォームに入力

- 疾患名: テスト疾患
- 手法: テスト手法
- 調査種別: 定性
- 対象者種別: 医師
- 実績数: 10
- あなたの名前: テストユーザー

### 4-3. 「この内容でPRを作る」をクリック

1〜2秒後に以下のメッセージが表示されるはずです:

```
✓ PRを作成しました！
  GitHubでPRを確認する →
```

### 4-4. PRを確認

リンクをクリックすると、GitHubのPRページが開きます:

https://github.com/Yoshi-Seed/global/pull/XXX

PRの内容を確認し、問題なければ「Merge pull request」でマージします。

---

## トラブルシューティング

### エラー: "Validation failed"

**原因:** 必須項目が入力されていない、または不正な値

**対処法:** エラーメッセージに従って入力内容を修正

---

### エラー: "Internal server error"

**原因1:** GitHub tokenの権限不足

**対処法:** 
```bash
wrangler secret put GITHUB_TOKEN
# 正しいトークンを再入力
```

**原因2:** リポジトリ名やオーナー名が間違っている

**対処法:**
```bash
wrangler secret put GITHUB_OWNER
# 正しいオーナー名を入力

wrangler secret put GITHUB_REPO
# 正しいリポジトリ名を入力
```

---

### エラー: "通信エラーが発生しました"

**原因:** Worker URLが間違っている、またはWorkerがデプロイされていない

**対処法:**
1. Worker が正しくデプロイされているか確認:
   ```bash
   wrangler tail
   ```
2. `register.html` の `API_ENDPOINT` が正しいか確認

---

### Worker のログを確認

```bash
cd project-tracker/workers
wrangler tail
```

リアルタイムでログが表示されます。

---

## セキュリティ上の注意

### GitHub Token の管理

- **Cloudflare Worker の環境変数に保存**されており、ブラウザには露出しません
- トークンは定期的にローテーションすることを推奨
- 使用しなくなったトークンは削除してください

### CORS設定

- Worker は `Access-Control-Allow-Origin: *` を設定しています
- 本番環境では、特定のドメインのみ許可することを検討してください:
  ```javascript
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://yoshi-seed.github.io',
    // ...
  };
  ```

---

## コスト

### Cloudflare Workers 無料プラン

- **リクエスト数:** 100,000 リクエスト/日（無料）
- **CPU時間:** 10ms/リクエスト（無料範囲内）

通常の使用では無料プランで十分です。

---

## 次のステップ

### オプション: GitHub OAuth認証

現在は誰でもPRを作成できますが、GitHub OAuth認証を追加することで:
- 実際のGitHubユーザー名でPRを作成
- 登録者の追跡が容易

実装方法は別途ドキュメント化可能です。

### オプション: Slack通知

PR作成時にSlackに通知を送ることができます。

### オプション: 自動マージ

CI/CDでバリデーションを通過したPRを自動的にマージすることも可能です。
