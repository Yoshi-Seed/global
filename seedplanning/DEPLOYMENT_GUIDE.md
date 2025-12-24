# 🚀 Seed Planning プロジェクト管理システム - デプロイメントガイド

## 📋 目次

1. [概要](#概要)
2. [GAS（Google Apps Script）の更新デプロイ](#gas-google-apps-scriptの更新デプロイ)
3. [動作確認](#動作確認)
4. [トラブルシューティング](#トラブルシューティング)

---

## 概要

このガイドは、**日付→期の自動変換機能**を含む最新のGASコードをGoogleスプレッドシートに反映させるための手順を説明します。

### 更新内容

- ✅ **日付→期の自動変換機能**を追加（`dateToTerm_()` 関数）
- ✅ フロントエンド側の変換ロジックも実装済み（`projects.js`）
- ✅ テストページ作成済み（`test_term_conversion.html`）
- ✅ ドキュメント整備済み（`TERM_CONVERSION.md`, `SCHEMA.md`）

---

## GAS（Google Apps Script）の更新デプロイ

### ステップ1: Google Sheetsを開く

1. 以下のURLにアクセス:
   ```
   https://docs.google.com/spreadsheets/d/1dObSMppCo8ZXI9BoX63Xx-DZIBQ6voDBMJiPWU68i8I/edit
   ```

2. 上部メニューから **[拡張機能] → [Apps Script]** をクリック

### ステップ2: コードを更新

1. Apps Scriptエディタが開きます
2. 左側のファイル一覧から `Code.gs` を選択
3. **既存のコードをすべて削除**
4. `/seedplanning/gas/Code.gs` の内容を **すべてコピー＆ペースト**

   ```bash
   # ローカルでコピーするコマンド（参考）
   cat /home/user/webapp/seedplanning/gas/Code.gs | pbcopy
   ```

5. 保存アイコン（💾）をクリック、またはCtrl+S（Cmd+S）で保存

### ステップ3: 新しいデプロイメントを作成

#### 3-1. 既存のデプロイメントを無効化（推奨）

1. 右上の **[デプロイ]** → **[デプロイを管理]** をクリック
2. 既存のデプロイメントの右側にある **[アーカイブ]** をクリック
3. 確認ダイアログで **[OK]** をクリック

#### 3-2. 新しいデプロイメントを作成

1. 右上の **[デプロイ]** → **[新しいデプロイ]** をクリック
2. **種類の選択** で「歯車アイコン⚙️」→ **[ウェブアプリ]** を選択
3. 以下の設定を行う:
   - **説明**: `Seed Planning GAS v2 - Date to Term Conversion` （任意）
   - **次のユーザーとして実行**: **自分** を選択
   - **アクセスできるユーザー**: **全員** を選択

4. **[デプロイ]** をクリック
5. 認証ダイアログが表示される場合:
   - **[アクセスを承認]** をクリック
   - Googleアカウントを選択
   - 「このアプリは確認されていません」が表示された場合:
     - **[詳細]** → **[(安全ではないページに移動)]** をクリック
   - **[許可]** をクリック

6. **新しいウェブアプリのURL**が表示されます:
   ```
   https://script.google.com/macros/s/XXXXXXXX.../exec
   ```
   - ⚠️ **このURLをコピーしてください**（次のステップで使用します）

### ステップ4: フロントエンドの設定ファイルを更新（URLが変わった場合のみ）

**注意**: 既存のデプロイメントURLと同じ場合は、この手順は不要です。

もしURLが変わった場合:

1. `/seedplanning/js/config.js` を開く
2. `GAS_WEB_APP_URL` を新しいURLに更新:

   ```javascript
   const GAS_CONFIG = {
     // 新しいURLに変更
     GAS_WEB_APP_URL: 'https://script.google.com/macros/s/新しいID.../exec',
     TOKEN: '',
     TIMEOUT: 30000
   };
   ```

3. ファイルを保存

---

## 動作確認

### 1. GAS ヘルスチェック

ブラウザまたはcurlで以下のURLにアクセス:

```bash
curl -L "https://script.google.com/macros/s/AKfycbxC6kTVyDOY4DbyLnra4w6Fj6Fes7GsI0MIwAHOZaTMUkn_LTdR5QwYMYnYYTwogKxB0g/exec?action=health"
```

**期待される出力:**
```json
{
  "success": true,
  "ok": true,
  "version": "seedplanning-gas-v1"
}
```

### 2. 日付→期の変換確認

プロジェクト一覧APIで`term`フィールドを確認:

```bash
curl -L "https://script.google.com/macros/s/AKfycbxC6kTVyDOY4DbyLnra4w6Fj6Fes7GsI0MIwAHOZaTMUkn_LTdR5QwYMYnYYTwogKxB0g/exec?action=list" | grep -o '"term":"[^"]*"' | head -5
```

**期待される出力（変換後）:**
```
"term":"43期"
"term":"44期"
"term":"43期"
...
```

**NG例（変換前 - 再デプロイが必要）:**
```
"term":"2025-12-22T02:03:00.000Z"
"term":"2025-12-19T04:22:00.000Z"
...
```

### 3. フロントエンドで確認

プロジェクト一覧ページにアクセス:

```
https://8000-itup028mvtxj8wwferhun-c07dda5e.sandbox.novita.ai/projects.html
```

**確認ポイント:**
- 「実施期」カラムに「43期」「44期」などの形式で表示されているか
- 日付の生データ（`2025-12-22`など）が表示されていないか

### 4. 変換ロジックのテスト

テストページで詳細な変換ロジックを検証:

```
https://8000-itup028mvtxj8wwferhun-c07dda5e.sandbox.novita.ai/test_term_conversion.html
```

**確認ポイント:**
- すべてのテストケースが ✅ PASS になっているか
- 43期、44期、45期などの変換が正しく動作しているか

---

## トラブルシューティング

### 問題1: `term`フィールドが日付のまま表示される

**原因**: GASスクリプトが古いバージョンのまま

**解決策**:
1. [ステップ3: 新しいデプロイメントを作成](#ステップ3-新しいデプロイメントを作成) を再度実行
2. ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
3. 動作確認を再実行

### 問題2: "Moved Temporarily" や "Redirecting..." が表示される

**原因**: 古いデプロイメントURLを使用している

**解決策**:
- `curl -L` （`-L`オプション追加）でリダイレクトを追跡
- または、最新のデプロイメントURLを確認して使用

### 問題3: "Unauthorized" エラー

**原因**: GASのアクセス権限が正しく設定されていない

**解決策**:
1. Apps Scriptエディタで **[デプロイ]** → **[デプロイを管理]** を開く
2. デプロイメントの **[編集]** をクリック
3. **[アクセスできるユーザー]** が **[全員]** になっているか確認
4. 変更がある場合は保存して再デプロイ

### 問題4: フロントエンドで変換されない

**原因1**: バックエンド（GAS）がまだ変換していない
- → [問題1](#問題1-termフィールドが日付のまま表示される) を確認

**原因2**: フロントエンドのJSファイルが古い
- → ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
- → デベロッパーツール（F12）→ Console でエラーを確認

---

## デプロイ完了後のチェックリスト

- [ ] GASヘルスチェックが成功する
- [ ] API経由で取得した`term`が「○○期」の形式になっている
- [ ] プロジェクト一覧ページで「実施期」が正しく表示される
- [ ] テストページですべてのテストケースが合格する
- [ ] フィルター機能で「43期」「44期」などで絞り込みができる

---

## 参考資料

- **システム概要**: [`README.md`](./README.md)
- **GASセットアップガイド**: [`gas/README_GAS_SETUP.md`](./gas/README_GAS_SETUP.md)
- **データスキーマ**: [`gas/SCHEMA.md`](./gas/SCHEMA.md)
- **期変換機能の詳細**: [`TERM_CONVERSION.md`](./TERM_CONVERSION.md)
- **Google Sheets**: https://docs.google.com/spreadsheets/d/1dObSMppCo8ZXI9BoX63Xx-DZIBQ6voDBMJiPWU68i8I/edit

---

## サポート

問題が解決しない場合は、以下の情報を添えてお問い合わせください:

1. エラーメッセージ（スクリーンショット）
2. 使用しているブラウザとバージョン
3. 実行したステップ
4. 期待される動作と実際の動作
