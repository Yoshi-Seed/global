# 🚀 クイックセットアップ - GitHub認証エラー修正

## エラー内容
```
Failed to fetch main branch ref (401): Bad credentials
```

## 原因
Cloudflare WorkerにGitHubトークンが設定されていません。

## 修正方法（5分）

### 📋 必要なもの
- GitHub Personal Access Token（下記で作成）

---

## ステップ1: GitHubトークンを作成（2分）

1. **GitHubトークン作成ページを開く**
   ```
   https://github.com/settings/tokens
   ```

2. **"Generate new token" → "Generate new token (classic)"** をクリック

3. **設定**
   - Note: `project-tracker-api`
   - Expiration: `90 days` または `No expiration`
   - Scopes: ✅ **repo** にチェック（これだけでOK）

4. **"Generate token"** をクリック

5. **トークンをコピー**（重要！後で見れません）
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## ステップ2: Cloudflareにシークレットを設定（3分）

### 方法A: 自動スクリプト（簡単）

```bash
cd project-tracker/workers
export CLOUDFLARE_API_TOKEN="-py_z4cC0Guh_kmsPlpfrkD2m7YsUeTL5UDhGKel"
./setup-secrets.sh
```

GitHubトークンを貼り付けてEnter → 完了！

---

### 方法B: 手動コマンド（確実）

```bash
cd project-tracker/workers
export CLOUDFLARE_API_TOKEN="-py_z4cC0Guh_kmsPlpfrkD2m7YsUeTL5UDhGKel"

# 1. GitHub Token
wrangler secret put GITHUB_TOKEN
# → GitHubトークンを貼り付けてEnter

# 2. GitHub Owner
wrangler secret put GITHUB_OWNER
# → 入力: Yoshi-Seed

# 3. GitHub Repo  
wrangler secret put GITHUB_REPO
# → 入力: global

# 4. CSV Path
wrangler secret put CSV_PATH
# → 入力: project-tracker/seed_planning_data.csv
```

---

### 方法C: Cloudflare Dashboard（GUIで設定）

1. https://dash.cloudflare.com/ にログイン
2. **Workers & Pages** → **project-tracker-api**
3. **Settings** タブ → **Variables**
4. **Add variable** で以下を追加（Typeは"Secret"を選択）：

| Name | Value |
|------|-------|
| GITHUB_TOKEN | `ghp_your_token_here` |
| GITHUB_OWNER | `Yoshi-Seed` |
| GITHUB_REPO | `global` |
| CSV_PATH | `project-tracker/seed_planning_data.csv` |

5. **Save** をクリック

---

## ステップ3: 確認（1分）

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

✅ 4つのシークレットが表示されればOK！

---

## ステップ4: 登録フォームでテスト

1. `register.html` を開く
2. プロジェクト情報を入力
3. 「この内容でPRを作る」をクリック
4. ✅ PRリンクが表示されれば成功！

---

## トラブルシューティング

### エラーが続く場合

#### ケース1: 401 Bad credentials（認証エラー）
**原因**: トークンが無効
**解決**: 
- GitHubで新しいトークンを作成
- `repo` スコープがチェックされているか確認
- Organization の SSO 承認が必要な場合は承認

#### ケース2: 404 Not Found（ファイルが見つからない）
**原因**: CSV パスが間違っている
**解決**:
```bash
wrangler secret put CSV_PATH
# 入力: project-tracker/seed_planning_data.csv
```

#### ケース3: 403 Forbidden（権限不足）
**原因**: トークンの権限不足
**解決**:
- GitHubトークンの `repo` スコープを確認
- リポジトリへのアクセス権限を確認

---

## 診断ツール

問題を特定するには：

```bash
cd project-tracker/workers
export GITHUB_TOKEN="your_github_token"
node test-github-api.js
```

このスクリプトが問題箇所を教えてくれます。

---

## まとめ

1. ✅ GitHubトークンを作成（`repo` スコープ）
2. ✅ Cloudflareにシークレットを設定（4つ）
3. ✅ シークレット一覧で確認
4. ✅ 登録フォームでテスト

**所要時間**: 約5分

設定後は、登録フォームから自動的にPRが作成されるようになります！🎉
