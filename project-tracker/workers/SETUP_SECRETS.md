# Cloudflare Worker シークレット設定ガイド

## エラー: "Failed to fetch main branch ref (401): Bad credentials"

このエラーは、Cloudflare WorkerがGitHub APIにアクセスするための認証情報（GITHUB_TOKEN）が設定されていないか、無効なために発生しています。

## 解決方法

### ステップ1: GitHubパーソナルアクセストークンを作成

1. GitHubにログイン
2. https://github.com/settings/tokens にアクセス
3. "Generate new token" → "Generate new token (classic)" をクリック
4. トークン設定：
   - **Note**: `project-tracker-api` (識別用の名前)
   - **Expiration**: 90 days または No expiration (お好みで)
   - **Scopes**: 以下にチェック
     - ✅ `repo` (Full control of private repositories)
       - ✅ repo:status
       - ✅ repo_deployment
       - ✅ public_repo
       - ✅ repo:invite
       - ✅ security_events
5. "Generate token" をクリック
6. **トークンをコピー** (後で見れなくなるので注意！)
   - 例: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### ステップ2: Cloudflare Workerにシークレットを設定

#### 方法A: Wrangler CLI を使用（推奨）

```bash
# Cloudflare APIトークンを設定
export CLOUDFLARE_API_TOKEN="-py_z4cC0Guh_kmsPlpfrkD2m7YsUeTL5UDhGKel"

# Workers ディレクトリに移動
cd project-tracker/workers

# GitHub トークンを設定
wrangler secret put GITHUB_TOKEN
# プロンプトが表示されたら、GitHubトークンを貼り付けてEnter

# 他の環境変数も設定
wrangler secret put GITHUB_OWNER
# 入力: Yoshi-Seed

wrangler secret put GITHUB_REPO
# 入力: global

wrangler secret put CSV_PATH
# 入力: project-tracker/seed_planning_data.csv
```

#### 方法B: Cloudflare Dashboard を使用

1. https://dash.cloudflare.com/ にログイン
2. **Workers & Pages** をクリック
3. **project-tracker-api** を選択
4. **Settings** タブをクリック
5. **Variables** セクションを見つける
6. **Environment Variables** で以下を追加：

| Variable Name | Type | Value |
|--------------|------|-------|
| GITHUB_TOKEN | Secret | `ghp_your_github_token_here` |
| GITHUB_OWNER | Secret | `Yoshi-Seed` |
| GITHUB_REPO | Secret | `global` |
| CSV_PATH | Secret | `project-tracker/seed_planning_data.csv` |

7. **Save** をクリック

### ステップ3: 設定を確認

#### Wrangler CLIで確認
```bash
cd project-tracker/workers
wrangler secret list
```

**期待される出力**:
```
┌──────────────┬────────────────┐
│ Name         │ Type           │
├──────────────┼────────────────┤
│ GITHUB_TOKEN │ secret_text    │
│ GITHUB_OWNER │ secret_text    │
│ GITHUB_REPO  │ secret_text    │
│ CSV_PATH     │ secret_text    │
└──────────────┴────────────────┘
```

#### Cloudflare Dashboard で確認
1. Workers & Pages → project-tracker-api → Settings → Variables
2. Environment Variables セクションに4つの変数が表示されているか確認

### ステップ4: 登録フォームで再テスト

1. `register.html` を開く
2. プロジェクト情報を入力
3. 「この内容でPRを作る」をクリック
4. 成功すると、PRリンクが表示されます

## トラブルシューティング

### エラー: "401 Bad credentials" が続く場合

**原因1: トークンの権限不足**
- GitHubトークンの `repo` スコープが有効か確認
- トークンが `Yoshi-Seed/global` リポジトリにアクセスできるか確認

**原因2: トークンの有効期限切れ**
- GitHubで新しいトークンを作成
- Cloudflare Workerのシークレットを更新

**原因3: Organization の SSO が必要**
- GitHubのOrganizationで SSO を有効化している場合
- トークンに SSO 認証を追加: https://github.com/settings/tokens
- トークンの横にある "Configure SSO" をクリック
- `Yoshi-Seed` Organizationを承認

### エラー: "404 Not Found" の場合

**原因: CSV ファイルパスが間違っている**

```bash
# 正しいパスを確認
git ls-files | grep seed_planning_data.csv
# 出力: project-tracker/seed_planning_data.csv

# Cloudflare Worker の CSV_PATH を修正
wrangler secret put CSV_PATH
# 入力: project-tracker/seed_planning_data.csv
```

### エラー: "403 Forbidden" の場合

**原因: API レート制限**
- GitHubの API レート制限に達している
- 認証済みリクエストは 5000 req/hour まで可能
- しばらく待ってから再試行

### 診断スクリプトでテスト

```bash
cd project-tracker/workers
export GITHUB_TOKEN="your_github_token_here"
node test-github-api.js
```

このスクリプトは以下をテストします：
- ✅ GitHub認証
- ✅ リポジトリアクセス
- ✅ Main ブランチ参照
- ✅ CSV ファイルアクセス
- ✅ API レート制限

## 完了確認

すべて正しく設定されると：

1. ✅ `wrangler secret list` で4つのシークレットが表示される
2. ✅ 診断スクリプトですべてのテストがパス
3. ✅ 登録フォームからPRが作成できる
4. ✅ GitHubに新しいPRが表示される

## 次のステップ

設定完了後：
1. 登録フォームでテストプロジェクトを登録
2. PRが正常に作成されることを確認
3. GitHubでPRをマージ
4. `seed_planning_data.csv` が更新されることを確認

## サポート

設定後もエラーが続く場合：
1. エラーメッセージ全文をコピー
2. `wrangler secret list` の出力を確認
3. 診断スクリプトの出力を共有
4. GitHubトークンの権限スクリーンショット

---

**重要**: GitHubトークンは機密情報です。誰とも共有しないでください。
