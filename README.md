# Feasibility Bot Yoshi - カスタムGPT統合チャット

## プロジェクト概要
- **名称**: Feasibility Bot Yoshi (カスタムGPT統合版)
- **元GPT**: `g-67a5c17ce5d88191b275abfab5b29db8-feasibility-bot-yoshi`
- **目的**: 医療系マーケットリサーチのフィージビリティスタディ専門チャット
- **特徴**: OpenAI Assistants APIによるカスタムGPT機能の完全再現

## 🌐 アクセスURL
- **GitHubリポジトリ**: https://github.com/Yoshi-Seed/global
- **Vercelデプロイ準備完了**: 🚀 デプロイ手順は下記参照
- **開発環境**: https://3000-i4g36odu0vp1yp88nd5yg-6532622b.e2b.dev

## 🏗️ アーキテクチャ

### フロントエンド
- **技術**: HTML + Tailwind CSS + Vanilla JavaScript
- **機能**: チャットUI、同意チェック、リアルタイムレスポンス表示
- **ファイル**: `/public/static/chat.js`

### バックエンド（中継サーバー）
- **技術**: Hono + Cloudflare Workers
- **エンドポイント**: 
  - `POST /api/chat` - メイン会話API
  - `GET /api/health` - ヘルスチェック
- **APIキー管理**: サーバーサイドでのみ保持（フロントに露出なし）

### AI モデル
- **使用技術**: OpenAI Assistants API + GPT-4o-mini
- **機能**: カスタムGPT機能完全再現、継続会話対応、専門知識統合
- **専門性**: 医療系マーケットリサーチのフィージビリティスタディに特化

## 🔒 セキュリティ実装

### 1. APIキー保護
- サーバーサイド（`/api/chat`）でのみAPIキー保持
- 環境変数 `OPENAI_API_KEY` 使用
- フロントエンドには一切露出なし

### 2. レート制限
- IP単位で 1分間10リクエスト制限
- メモリベース制限（本格運用時はRedis等推奨）

### 3. コンテンツフィルタリング
```javascript
緊急キーワード検出: ['救急', '緊急', '意識不明', '呼吸停止', '心停止']
→ 119番案内

医療助言キーワード検出: ['診断', '治療法', '薬の処方', '手術']
→ 医療従事者相談案内
```

### 4. PII対策
- 会話ログ24時間自動削除設定
- 個人情報の永続化なし

## 🏥 医療系配慮

### 1. 免責表現
- システムプロンプトに医学的助言の制限を明記
- 全回答に免責文自動追加

### 2. 同意チェック
- 利用前の注意事項表示・同意必須
- 医療助言不可の明確化

### 3. トリアージ機能
- 緊急時自動検出・案内
- 不適切な医療相談の自動遮断

## 📊 データ設計
```javascript
// 会話データ構造
{
  conversationId: "conv_timestamp_random",
  messages: [
    { role: "user", content: "ユーザーメッセージ" },
    { role: "assistant", content: "AI回答" }
  ],
  timestamp: "ISO文字列",
  ttl: "24時間後削除"
}

// レート制限データ
Map<IP, { count: number, resetTime: timestamp }>
```

## 🚀 使い方

### ユーザー向け
1. サイトにアクセス
2. 注意事項に同意してチェック  
3. チャット入力欄にメッセージを入力
4. フィージビリティスタディに関する専門的な質問をする
   - 研究計画の実現可能性評価
   - 規制要件（FDA、EMA、PMDA）の確認  
   - 被験者募集戦略・サイト選定
   - 予算・タイムライン策定
   - リスク評価・緩和策提案

### 開発者向けAPI利用
```javascript
// 基本的な会話API呼び出し
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "質問内容",
    conversationId: "会話ID（オプション）"
  })
})
```

## 🔧 技術仕様
- **Platform**: Vercel (Node.js Serverless Functions)
- **Framework**: Pure JavaScript (Vercel Functions)
- **Frontend**: Vanilla JS + Tailwind CSS + HTML
- **AI**: OpenAI Assistants API + GPT-4o-mini
- **API Routes**: `/api/chat`, `/api/health`
- **Deployment**: Vercel

## 🚀 Vercelデプロイ手順

### 1. Vercelアカウント準備
1. https://vercel.com にアクセス
2. 「Continue with GitHub」でログイン
3. GitHubアカウントで認証完了

### 2. プロジェクトインポート
1. Vercelダッシュボードで「New Project」クリック
2. 「Import Git Repository」から `Yoshi-Seed/global` を選択
3. プロジェクト名: `feasibility-bot-yoshi` 
4. Framework: **Other** を選択
5. Root Directory: **そのまま**（空欄）

### 3. 環境変数設定（重要）
**Environment Variables** セクションで以下を設定：
```
Name: OPENAI_API_KEY
Value: [あなたのOpenAI APIキー]
```

### 4. デプロイ実行
1. 「Deploy」ボタンをクリック
2. 数分でデプロイ完了
3. 生成されたURL（例：https://feasibility-bot-yoshi.vercel.app）でアクセス

## 📈 デプロイメント
- **ステータス**: 🚀 Vercel デプロイ準備完了
- **GitHub**: ✅ プッシュ完了
- **最終更新**: 2025-09-14

## 🤖 カスタムGPT統合仕様

### Assistants API活用
- **スレッド管理**: 会話コンテキスト維持
- **カスタム指示**: Feasibility Bot Yoshi専用プロンプト
- **専門知識**: 医療研究フィージビリティスタディ特化

### 機能差分（元GPTとの違い）
- **会話継続**: スレッドベース会話で文脈保持強化
- **セキュリティ**: 追加のレート制限・フィルタリング
- **医療配慮**: 日本の医療規制に特化した安全性対策

## 🔄 今後の推奨改善点

### 即座対応可能
1. **OpenAI API Key設定**: `.dev.vars`ファイルに実際のAPIキーを設定
2. **Assistant ID固定化**: 既存Assistantの再利用設定
3. **本格運用準備**: Cloudflare Pages本番デプロイ

### 将来的改善
1. **永続化ストレージ**: Cloudflare D1/KVでの会話履歴管理
2. **認証システム**: ユーザー管理・アクセス制御
3. **RAG機能**: 社内文書・FAQ検索連携
4. **監査ログ**: 詳細アクセスログ・利用統計

## ⚠️ 注意事項
- 現在は開発環境のため、実際のOpenAI APIキーは未設定
- 本格運用時はCloudflare SecretsでのAPIキー管理が必要
- 医療情報の取り扱いには十分な注意が必要