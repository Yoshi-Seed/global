# Vercel 緊急対応ガイド

## 現在の状況

Vercelデプロイで "An unexpected error happened" が発生しています。

**エラーコミット**: c470d4d  
**修正コミット**: 
- fe31f13: `.vercelignore` 追加
- e329489: Vercel設定改善

---

## すでに実施した対策

### ✅ 1. `.vercelignore` でproject-trackerを除外
```
project-tracker
*.md
node_modules
```

### ✅ 2. `vercel.json` を version 2 に更新
```json
{
  "version": 2,
  "buildCommand": null,
  "outputDirectory": ".",
  "framework": null
}
```

### ✅ 3. `package.json` から engines を削除
Node.jsバージョンの自動検出を使用。

---

## 次のステップ

### 方法1: Vercelダッシュボードで手動再デプロイ（推奨）

最新のコミット（e329489）を強制的にデプロイ：

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard
   - **Yoshi's projects** → **feasibility-bot**

2. **最新デプロイメントを選択**
   - **Deployments** タブ
   - 最新のコミット `e329489` を探す

3. **再デプロイを実行**
   - 右上の **...** メニュー → **Redeploy**
   - **Use existing Build Cache** のチェックを**外す**
   - **Redeploy** をクリック

**メリット**:
- ビルドキャッシュをクリアして再実行
- 内部エラーが一時的な問題だった場合に解決

---

### 方法2: ダミーコミットでデプロイトリガー

空のコミットを作成して新規デプロイをトリガー：

```bash
cd /home/user/webapp
git commit --allow-empty -m "chore: Vercel デプロイをトリガー"
git push origin main
```

**メリット**:
- 新しいビルドIDで再試行
- ダッシュボードにアクセス不要

---

### 方法3: Vercel Production Branchを一時的に変更

エラーループを止めるための緊急措置：

1. **Settings** → **Git**
2. **Production Branch** を `main` から別のブランチ（例: `production`）に変更
3. エラーメールが停止
4. 問題解決後、`main` に戻す

**メリット**:
- エラーメールスパムを即座に停止
- 落ち着いて問題を調査できる

---

### 方法4: Vercel サポートに問い合わせ

"unexpected error" はVercelの内部エラーのため、サポートが必要な場合があります。

**問い合わせ先**: https://vercel.com/help

**含めるべき情報**:
- プロジェクト名: `feasibility-bot`
- デプロイID（失敗したデプロイメントのURL）
- エラーメッセージ: "An unexpected error happened when running this build"
- 発生時刻: 約2時間前から連続発生

**テンプレート**:
```
Subject: Unexpected build error for feasibility-bot project

Hi Vercel Support,

I'm experiencing continuous build failures for my project "feasibility-bot" 
with the error "An unexpected error happened when running this build."

Project: feasibility-bot (Yoshi's projects)
Failing commit: c470d4d
Error started: ~2 hours ago
Frequency: Every push to main branch

I have already tried:
1. Adding .vercelignore to exclude large directories
2. Updating vercel.json to version 2 spec
3. Removing engines field from package.json

The project is a simple static HTML site (index.html) and should not 
require any build process.

Could you please investigate this issue?

Thank you,
Yoshi
```

---

## デバッグ情報

### プロジェクト構造
```
/home/user/webapp/
├── index.html (11KB, 194行) ✅
├── package.json ✅
├── vercel.json ✅
├── .vercelignore ✅
├── README.md
└── project-tracker/ (除外済み)
    └── seed_planning_data.csv (117KB)
```

### 現在の設定
- **Framework**: None (静的HTML)
- **Build Command**: なし
- **Output Directory**: `.`
- **Node Version**: 自動検出

---

## 予想される原因

### 1. Vercelの一時的な内部エラー
**可能性**: 高  
**対策**: 再デプロイまたは待機

### 2. ビルドキャッシュの破損
**可能性**: 中  
**対策**: キャッシュなしで再デプロイ

### 3. 大きなCSVファイルの影響（修正済み）
**可能性**: 低（.vercelignoreで除外済み）  
**対策**: 既に実施済み

### 4. vercel.json の設定ミス（修正済み）
**可能性**: 低（version 2に更新済み）  
**対策**: 既に実施済み

---

## チェックリスト

最新のデプロイが成功するまで確認：

- [ ] Vercelダッシュボードで最新コミット（e329489）が表示される
- [ ] デプロイステータスが "Building" → "Ready" になる
- [ ] エラーメールが届かなくなる
- [ ] 本番URL（feasibility-bot.vercel.app など）にアクセスできる

---

## 成功の確認方法

### 1. Vercelダッシュボード
- **Status**: Ready (緑チェックマーク)
- **Duration**: 10〜30秒程度
- **Domains**: アクティブでアクセス可能

### 2. ブラウザでアクセス
```
https://feasibility-bot-git-main-yoshis-projects-540c5912.vercel.app
```

### 3. デプロイログ
```
Cloning repository...
Analyzing source code...
Installing dependencies...
Deploying...
✓ Build Completed
```

---

## タイムライン

| 時刻 | イベント | 対応 |
|------|---------|------|
| 2h前 | c470d4dデプロイ失敗 | エラーメール受信 |
| 13分前 | Vercel内部エラー | ステータス確認 |
| 現在 | 修正コミットe329489プッシュ | 新規デプロイ待機 |
| +5分 | 新規デプロイ開始予定 | 自動トリガー |
| +10分 | デプロイ完了予定 | 成功確認 |

---

## まとめ

✅ **実施済み対策**:
1. `.vercelignore` でproject-tracker除外
2. `vercel.json` をversion 2に更新
3. `package.json` のengines削除

⏳ **待機中**:
- 最新コミット（e329489）の自動デプロイ

🔴 **エスカレーション条件**:
- 30分以内にデプロイが成功しない
- 同じエラーが再発する
- → Vercelサポートに問い合わせ

---

このガイドに従って対応してください。問題が解決しない場合は、Vercel側の一時的な障害の可能性があるため、サポートへの問い合わせを推奨します。
