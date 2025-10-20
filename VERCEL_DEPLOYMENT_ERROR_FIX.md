# Vercel デプロイメントエラー修正ガイド

## 問題の症状

`feasibility-bot` プロジェクトが連続してVercelデプロイに失敗し、エラーメールが届く。

```
There was an error deploying feasibility-bot to the production environment
```

---

## 考えられる原因

### 1. ルートディレクトリの競合
リポジトリに複数のプロジェクトが存在：
- ルート: `feasibility-bot` (FAQ サイト)
- `project-tracker/`: プロジェクトトラッカー

Vercelがどちらをデプロイすべきか混乱している可能性。

### 2. CSVファイルのサイズ
`project-tracker/seed_planning_data.csv` (117KB) が静的ファイルとして大きすぎる可能性。

### 3. ビルド設定の問題
`vercel.json` の設定が現在のプロジェクト構造と一致していない。

### 4. 最近のコミットの影響
CSVファイルの改行コード変換により、Git diffが大きくなりVercelのビルドプロセスに影響。

---

## 解決方法

### 方法1: Vercel ダッシュボードで設定確認（推奨）

#### ステップ1: Vercel ダッシュボードにアクセス
1. https://vercel.com/dashboard にログイン
2. **Yoshi's projects** → **feasibility-bot** を選択

#### ステップ2: デプロイメントログを確認
1. **Deployments** タブをクリック
2. 最新の失敗したデプロイメントを選択
3. **Build Logs** を確認して具体的なエラーメッセージを探す

**よくあるエラー:**
- `Error: No such file or directory`
- `Build exceeded maximum duration`
- `Static file size limit exceeded`

#### ステップ3: プロジェクト設定を確認・修正
1. **Settings** → **General** をクリック
2. 以下を確認：

**Root Directory**: 
- **現在**: `/` または未設定
- **推奨**: `/` (ルートでOK、project-trackerは静的ファイルとして扱う)

**Framework Preset**:
- **推奨**: `Other` または `Static HTML`

**Build Command**:
- **推奨**: 空欄（静的サイトなのでビルド不要）

**Output Directory**:
- **推奨**: `.` (ルートディレクトリ)

**Node.js Version**:
- **推奨**: `18.x` (package.jsonで指定済み)

---

### 方法2: .vercelignore で project-tracker を除外

`project-tracker` がデプロイに含まれないようにする（メインサイトと分離）。

#### ファイルを作成: `.vercelignore`
```
# project-tracker を Vercel デプロイから除外
project-tracker/
```

**メリット**:
- メインサイト (`feasibility-bot`) のデプロイが軽量化
- CSVファイルなどの大きなファイルがデプロイに含まれない

**デメリット**:
- project-tracker を Vercel でホストする場合は別のプロジェクトとして設定が必要

---

### 方法3: vercel.json を更新

現在の `vercel.json` を改善し、静的ファイルの扱いを明示。

#### 更新内容:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/project-tracker/(.*)",
      "dest": "/project-tracker/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**説明**:
- `builds`: 静的ビルドを明示
- `routes`: project-tracker へのルーティングを追加

---

### 方法4: CSVファイルを外部ストレージに移動（長期的解決策）

`seed_planning_data.csv` をGitリポジトリから除外し、外部ストレージ（GitHub Raw URL、AWS S3、Cloudflare R2など）に配置。

#### ステップ1: `.gitignore` に追加
```
project-tracker/seed_planning_data.csv
```

#### ステップ2: Worker API で外部URLから取得
```javascript
// add-project.js
const CSV_URL = env.CSV_URL || 'https://raw.githubusercontent.com/Yoshi-Seed/global/main/project-tracker/seed_planning_data.csv';
```

**メリット**:
- Gitリポジトリが軽量化
- デプロイが高速化
- CSVファイルの更新がリポジトリコミット不要

---

## 推奨アクション（優先度順）

### 🔴 優先度1: Vercel ダッシュボードで確認（即座に対応）
1. Vercelダッシュボードにログイン
2. 失敗したデプロイメントのログを確認
3. 具体的なエラーメッセージをコピー

### 🟡 優先度2: .vercelignore 追加（簡単な修正）
```bash
cd /home/user/webapp
echo "project-tracker/" > .vercelignore
git add .vercelignore
git commit -m "fix: project-trackerをVercelデプロイから除外"
git push origin main
```

### 🟢 優先度3: vercel.json 更新（必要に応じて）
- デプロイログを確認してから判断
- ルーティングの問題がある場合のみ実施

### 🔵 優先度4: CSVを外部化（長期的改善）
- システムが安定してから実施
- 現時点では必須ではない

---

## デバッグ手順

### 1. ローカルでVercelビルドをテスト
```bash
cd /home/user/webapp
npx vercel build
```

### 2. エラーログを確認
Vercel CLIでローカルテストしてエラーを特定。

### 3. デプロイを手動実行
```bash
cd /home/user/webapp
npx vercel --prod
```

ターミナルに表示されるエラーメッセージから原因を特定。

---

## トラブルシューティング Q&A

### Q1: エラーメールが止まらない
**A**: デプロイの自動トリガーを一時停止
1. Vercel Dashboard → Settings → Git
2. **Production Branch** を無効化（一時的に）
3. エラー修正後、再度有効化

### Q2: project-trackerも別途デプロイしたい
**A**: Vercelで新しいプロジェクトを作成
1. 新規プロジェクト作成
2. Root Directory: `project-tracker`
3. Framework: `Other` (静的HTML)

### Q3: CSVファイルが見つからないエラー
**A**: Worker APIのパス設定を確認
```javascript
// add-project.js で相対パスを使用
const CSV_PATH = 'project-tracker/seed_planning_data.csv';
```

---

## 次のステップ

1. **Vercel ダッシュボードでエラーログを確認**
2. エラーメッセージをこのドキュメントと照合
3. 該当する解決方法を実施
4. デプロイが成功したら、エラーメールが停止

---

## 参考リンク

- [Vercel Documentation - Build Configuration](https://vercel.com/docs/concepts/projects/build-configuration)
- [Vercel Documentation - .vercelignore](https://vercel.com/docs/concepts/projects/project-configuration#vercelignore)
- [Vercel Documentation - Troubleshooting](https://vercel.com/docs/concepts/deployments/troubleshoot-a-build)

---

## サポート

Vercelのエラーログの内容を共有いただければ、より具体的な解決策を提案できます。
