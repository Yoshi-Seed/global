# project-tracker-mirror（Google Sheets版）

現行 `/project-tracker/` の見た目・画面構成をそのままに、
**データの読み書きだけを Google Sheets（GAS Webアプリ）に切り替えた**ミラーです。

## 1) フロント側の設定（必須）

`/project-tracker-mirror/js/config.js` を開いて、以下を設定します。

- `GAS_CONFIG.URL` : Apps Script を「ウェブアプリ」としてデプロイしたURL
- `GAS_CONFIG.TOKEN` : 任意（使う場合はGAS側の `TOKEN` と一致させる）

```js
const GAS_CONFIG = {
  URL: "https://script.google.com/macros/s/XXXXXXXX/exec",
  TOKEN: "",
  CACHE_TTL_MS: 60000,
};
```

## 2) Google Apps Script（GAS）の作成

スプレッドシート（project-tracker-data）を開き、
**拡張機能 → Apps Script** でスクリプトを作成します。

このフォルダの `gas/Code.gs` をそのまま貼り付けて保存します。

### トークンを使う場合

`gas/Code.gs` の `TOKEN` を設定し、フロント側 `GAS_CONFIG.TOKEN` と同じ値にします。

## 3) GASのデプロイ（ウェブアプリ）

Apps Script 画面で **デプロイ → 新しいデプロイ → 種類: ウェブアプリ**

- 実行ユーザー: 自分
- アクセスできるユーザー: **全員（匿名ユーザーを含む）**（または運用方針に合わせて）

デプロイ後に表示されるURLを `GAS_CONFIG.URL` に貼り付ければOKです。

## 4) 動作確認

1. `/project-tracker-mirror/projects.html` で一覧が見える（GAS URL未設定なら `data/projects.json` にフォールバック）
2. `/project-tracker-mirror/register.html` から登録 → スプレッドシートに1行追記される
3. `/project-tracker-mirror/projects.html` の削除依頼 → `delete_requests` シートに1行追記される

---

## 補足

- 本ミラーは「一覧取得」は **GASが全件JSONを返して、検索・絞り込みはフロント側JSで実施**（最短構成）
- 件数が増えたら `gas/Code.gs` の doGet を拡張して `?q=` 等でサーバ側フィルタに移行できます
