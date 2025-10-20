# Vercel ビルドエラー - 最終解決策

## 🚨 緊急: Vercelダッシュボードで手動設定が必要

ProductionとPreview両方のデプロイが失敗している場合、**Vercelダッシュボードでの手動設定変更**が必要です。

---

## 即座に実施すべき対策

### ステップ1: Vercelダッシュボードにアクセス

1. https://vercel.com/dashboard にログイン
2. **Yoshi's projects** → **feasibility-bot** を選択

---

### ステップ2: Build & Development Settings を変更

1. **Settings** タブをクリック
2. 左サイドバーの **Build & Development Settings** を選択

#### ⚙️ 設定内容:

**Framework Preset**:
```
Other
```

**Build Command** (Override):
```
(空欄のまま)
```
または明示的に無効化：
```
echo "No build needed"
```

**Output Directory** (Override):
```
.
```

**Install Command** (Override):
```
(空欄のまま)
```
または：
```
echo "No dependencies"
```

**Root Directory**:
```
(空欄 - ルートディレクトリのまま)
```

#### 🔴 重要: "Override" チェックボックスを有効化

各設定項目の **"Override"** チェックボックスに**チェックを入れる**必要があります。

---

### ステップ3: Environment Variables を確認

1. **Settings** → **Environment Variables**
2. 不要な変数があれば削除
3. 特に `VERCEL_FORCE_NO_BUILD_CACHE` を追加：

**Key**: `VERCEL_FORCE_NO_BUILD_CACHE`  
**Value**: `1`  
**Environment**: Production, Preview, Development すべて選択

---

### ステップ4: Ignored Build Step を設定（オプション）

エラーが続く場合、特定のパスでビルドをスキップ：

1. **Settings** → **Git**
2. **Ignored Build Step** セクションで **Edit** をクリック
3. 以下のコマンドを入力：

```bash
#!/bin/bash
# project-trackerの変更のみの場合はビルドスキップ
if [ "$VERCEL_GIT_COMMIT_REF" = "main" ]; then
  git diff HEAD^ HEAD --quiet -- project-tracker/
else
  exit 1
fi
```

または、シンプルに：
```bash
exit 0
```
これにより**すべてのビルドをスキップ**（最終手段）

---

### ステップ5: 手動デプロイを実行

設定変更後：

1. **Deployments** タブに移動
2. 最新のコミットを選択
3. 右上の **...** メニュー → **Redeploy**
4. **✅ Use existing Build Cache** のチェックを**外す**
5. **Redeploy** をクリック

---

## 代替案: CLI経由でデプロイ

ダッシュボードでの設定が難しい場合、CLI経由で直接デプロイ：

### 前提条件
```bash
npm install -g vercel
```

### ログイン
```bash
vercel login
```

### デプロイ実行
```bash
cd /home/user/webapp
vercel --prod --yes
```

### ビルドをスキップしてデプロイ
```bash
cd /home/user/webapp
vercel --prod --yes --no-build
```

---

## トラブルシューティング: エラーログの確認方法

### Vercelダッシュボード
1. **Deployments** → 失敗したデプロイメントをクリック
2. **Build Logs** タブを開く
3. エラーメッセージの詳細を確認

### よくあるエラーと解決策

#### エラー1: "Error: No Output Directory named..."
**原因**: Output Directoryの設定ミス  
**解決**: Settings で Output Directory を `.` に設定

#### エラー2: "Error: Command failed with exit code 1"
**原因**: ビルドコマンドの実行エラー  
**解決**: Build Command を空欄または `echo "No build needed"` に設定

#### エラー3: "Error: Build exceeded maximum duration of 45s"
**原因**: ビルドタイムアウト  
**解決**: ビルドを無効化（静的サイトなのでビルド不要）

#### エラー4: "Unexpected error" (内部エラー)
**原因**: Vercelの一時的な障害  
**解決**: 
1. 30分待って再試行
2. Vercelサポートに問い合わせ: https://vercel.com/help

---

## 最終手段: プロジェクトを再作成

すべての対策が失敗した場合：

### ステップ1: 既存プロジェクトを削除
1. Settings → **Advanced** → **Delete Project**
2. プロジェクト名を入力して削除確認

### ステップ2: 新規プロジェクト作成
1. ダッシュボードで **Add New** → **Project**
2. GitHubリポジトリ `Yoshi-Seed/global` を選択
3. 以下の設定でインポート：
   - **Project Name**: `feasibility-bot`
   - **Framework**: `Other`
   - **Root Directory**: `/` (空欄)
   - **Build Command**: (空欄)
   - **Output Directory**: `.`

---

## Vercel サポートへの問い合わせテンプレート

エラーが解決しない場合、以下のテンプレートを使用：

```
Subject: Critical deployment failures for feasibility-bot project

Hi Vercel Support,

Our project "feasibility-bot" is experiencing continuous deployment failures 
for both Production and Preview environments.

Project Details:
- Project Name: feasibility-bot
- Team: Yoshi's projects
- Repository: github.com/Yoshi-Seed/global
- Error: "An unexpected error happened when running this build"
- Frequency: Every deployment since [2時間前]

Project Type:
- Static HTML site (index.html)
- Contains Vercel Serverless Functions in /api directory
- No build process required

Steps Already Taken:
1. Added .vercelignore to exclude large directories (project-tracker/)
2. Updated vercel.json to specify functions and rewrites
3. Removed engines field from package.json
4. Attempted manual redeploys without build cache
5. Verified all configuration settings in dashboard

The deployments fail within 40 seconds with no specific error logs 
visible in the Build Logs tab.

Could you please:
1. Check if there's an internal issue affecting our project
2. Review our build logs for any hidden errors
3. Suggest next steps to resolve this issue

Project is currently down and affecting our production users.

Urgency: High

Thank you,
Yoshi
```

---

## チェックリスト

デプロイが成功するまで確認：

- [ ] Vercel Settings で Build Command を空欄に設定
- [ ] Output Directory を `.` に設定
- [ ] Override チェックボックスを有効化
- [ ] ビルドキャッシュなしで再デプロイ
- [ ] Environment Variables を確認
- [ ] 最新デプロイのステータスが "Ready" になる
- [ ] エラーメールが停止

---

## 成功の兆候

✅ **デプロイ成功**:
- Status: Ready (緑チェックマーク)
- Duration: 10〜30秒
- Build Logs に "Build Completed" 表示
- ドメインにアクセス可能

✅ **エラーメール停止**:
- 次のプッシュからエラーメールなし

---

このガイドに従っても解決しない場合は、Vercelサポートへの問い合わせが必要です。
