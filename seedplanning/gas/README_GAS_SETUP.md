# Google Apps Script セットアップガイド

## 1. スプレッドシートの確認

以下のスプレッドシートを使用します：
- **URL**: https://docs.google.com/spreadsheets/d/1dObSMppCo8ZXI9BoX63Xx-DZIBQ6voDBMJiPWU68i8I/edit
- **シート構成**:
  - `projects_index`: 一覧・検索用の軽量データ
  - `projects_detail`: 詳細ページ用の重量データ

## 2. Apps Script の作成

1. スプレッドシートを開く
2. メニューから **拡張機能 → Apps Script** を選択
3. 新しいプロジェクトが開いたら、`Code.gs` の内容を全て削除
4. `/seedplanning/gas/Code.gs` の内容を全てコピー＆ペースト
5. **保存**（Ctrl+S または File → Save）

## 3. トークン設定（オプション・推奨）

セキュリティを強化する場合、`Code.gs` の以下の行を編集：

```javascript
const TOKEN = '';  // ← ここに任意の文字列を設定
```

例:
```javascript
const TOKEN = 'your-secret-token-2024';
```

このトークンは、後でフロント側の `js/config.js` でも同じ値を設定します。

## 4. ウェブアプリとしてデプロイ

1. Apps Script 画面右上の **デプロイ** ボタンをクリック
2. **新しいデプロイ** を選択
3. デプロイの種類:
   - 歯車アイコン（⚙️）をクリック → **ウェブアプリ** を選択
4. 設定:
   - **説明**: `seedplanning-api-v1`（任意）
   - **次のユーザーとして実行**: **自分**
   - **アクセスできるユーザー**: 
     - 社内限定の場合: **組織内のユーザーのみ**（推奨）
     - 外部公開する場合: **全員（匿名ユーザーを含む）**
5. **デプロイ** をクリック
6. 権限の承認:
   - 初回デプロイ時に承認が必要です
   - **権限を確認** → Googleアカウントでログイン → **許可**
7. **デプロイ完了**
   - **ウェブアプリのURL** が表示されます（例: `https://script.google.com/macros/s/XXXXXXXX/exec`）
   - このURLをコピーしてください

## 5. フロント側の設定

`/seedplanning/js/config.js` を作成・編集：

```javascript
const GAS_CONFIG = {
  URL: "https://script.google.com/macros/s/XXXXXXXX/exec",  // ← デプロイしたURL
  TOKEN: "",  // ← Code.gs で設定した TOKEN と同じ値
  CACHE_TTL_MS: 60000,  // キャッシュ有効期限（60秒）
};
```

## 6. 動作確認

### ヘルスチェック

ブラウザで以下のURLにアクセス：
```
https://script.google.com/macros/s/XXXXXXXX/exec?action=health
```

正常な場合のレスポンス：
```json
{
  "success": true,
  "ok": true,
  "version": "seedplanning-gas-v1"
}
```

### 一覧取得テスト

```
https://script.google.com/macros/s/XXXXXXXX/exec?action=list
```

正常な場合のレスポンス：
```json
{
  "success": true,
  "projects": [],
  "count": 0,
  "filters": {...},
  "updatedAt": "2024-12-24T12:34:56.789Z"
}
```

## 7. API エンドポイント一覧

### GET リクエスト

| エンドポイント | 説明 | パラメータ例 |
|---------------|------|------------|
| `?action=health` | ヘルスチェック | なし |
| `?action=list` | 一覧取得（全件） | なし |
| `?action=list&type=公的` | タイプで絞り込み | `type=公的` or `type=民間` |
| `?action=list&category=ヘルスケア` | カテゴリーで絞り込み | `category=ヘルスケア` |
| `?action=list&term=44期` | 実施期で絞り込み | `term=40期` ~ `term=44期` |
| `?action=list&client=社協` | クライアント名で検索 | `client=社協` |
| `?action=list&q=運営` | フリーワード検索 | `q=運営` |
| `?action=detail&pj=Z04012101` | 詳細取得 | `pj=Z04012101` |

### POST リクエスト

| エンドポイント | 説明 | ボディデータ |
|---------------|------|-----------|
| `?action=add` | 新規登録 | JSON形式（後述） |
| `?action=update&pj=Z04012101` | 更新 | JSON形式（後述） |
| `?action=delete_request` | 削除依頼 | `{pj_number, reason, ...}` |
| `?action=delete&pj=Z04012101` | 削除実行（TOKEN必須） | `{pj_number, reason, password}` |

## 8. トラブルシューティング

### エラー: "Unauthorized"
- `TOKEN` 設定を確認
- フロント側の `GAS_CONFIG.TOKEN` と GAS側の `TOKEN` が一致しているか確認

### エラー: "Unknown action: XXX"
- URLパラメータ `?action=` が正しいか確認
- 大文字小文字は区別されません（自動的に小文字に変換）

### データが取得できない
1. スプレッドシートのシート名を確認:
   - `projects_index`
   - `projects_detail`
2. シートが空の場合、ヘッダー行が自動作成されます
3. ブラウザの開発者ツールでネットワークタブを確認

## 9. セキュリティ推奨事項

1. **TOKEN を必ず設定**（更新・削除を保護）
2. **アクセス範囲を限定**（組織内のみに設定）
3. **削除は慎重に**（`delete_request` を使用して管理者承認フローを推奨）
4. **定期的にログシートを確認**（`delete_logs`, `delete_requests`）

## 10. 次のステップ

GAS のデプロイが完了したら：
1. `/seedplanning/js/config.js` にURL・TOKENを設定
2. `/seedplanning/projects.html` で一覧画面を実装
3. `/seedplanning/project.html` で詳細画面を実装
4. `/seedplanning/register.html` で登録画面を実装
