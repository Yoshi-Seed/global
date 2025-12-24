# Seed Planning プロジェクト管理システム

社内の複雑案件を効率的に管理・検索するためのシステムです。

## 🎯 システム概要

- **データベース**: Google Sheets（2シート構成）
- **バックエンド**: Google Apps Script（GAS）
- **フロントエンド**: 静的HTML + JavaScript（予定）
- **アーキテクチャ**: 一覧・詳細分離型（軽量・高速）

### 特徴

- ✅ **軽快な検索**: 一覧用シートで高速検索（プロジェクトタイプ、カテゴリー、実施期、クライアント名）
- ✅ **詳細な情報**: 詳細用シートで長文・Markdown対応（背景、目的、実施内容、成果物）
- ✅ **2段階表示**: 一覧で見つけて、クリックで詳細表示（UX最適化）
- ✅ **履歴管理**: 変更履歴を自動記録
- ✅ **セキュリティ**: トークン認証、削除依頼ログ

## 📂 ディレクトリ構成

```
/seedplanning/
├── index.html            # トップページ（予定）
├── projects.html         # 一覧・検索画面（予定）
├── project.html          # 詳細表示画面（予定）
├── register.html         # 新規登録画面（予定）
├── edit.html            # 編集画面（予定）
├── css/
│   └── style.css        # 共通スタイル（予定）
├── js/
│   ├── config.js        # GAS API URL + TOKEN（要作成）
│   ├── api.js           # API通信ラッパー（予定）
│   ├── projects.js      # 一覧画面ロジック（予定）
│   ├── project.js       # 詳細画面ロジック（予定）
│   └── register.js      # 登録画面ロジック（予定）
├── gas/
│   ├── Code.gs          # ✅ GAS スクリプト（作成済み）
│   ├── README_GAS_SETUP.md  # ✅ GAS セットアップ手順（作成済み）
│   └── SCHEMA.md        # ✅ データスキーマ定義（作成済み）
├── data/
│   └── sample.json      # ✅ サンプルデータ（作成済み）
└── README.md            # このファイル
```

## 🚀 セットアップ手順

### 1. Google Sheets の準備

スプレッドシートはすでに作成済みです：
- **URL**: https://docs.google.com/spreadsheets/d/1dObSMppCo8ZXI9BoX63Xx-DZIBQ6voDBMJiPWU68i8I/edit

シート構成：
- `projects_index`: 一覧・検索用（10列）
- `projects_detail`: 詳細用（8列）

### 2. Google Apps Script（GAS）のセットアップ

詳細は **`gas/README_GAS_SETUP.md`** を参照してください。

**クイックスタート**:
1. スプレッドシートを開く
2. メニュー → 拡張機能 → Apps Script
3. `gas/Code.gs` の内容を全てコピー＆ペースト
4. デプロイ → 新しいデプロイ → ウェブアプリ
5. デプロイしたURLをメモ

### 3. フロント側の設定

`js/config.js` を作成して、GAS の URL と TOKEN を設定します：

```javascript
const GAS_CONFIG = {
  URL: "https://script.google.com/macros/s/XXXXXXXX/exec",  // GAS URL
  TOKEN: "",  // セキュリティ強化する場合に設定
  CACHE_TTL_MS: 60000,  // キャッシュ有効期限（60秒）
};
```

## 📊 データスキーマ

詳細は **`gas/SCHEMA.md`** を参照してください。

### projects_index（一覧用）

| カラム | 説明 | 例 |
|-------|------|---|
| pj_number | PJ番号（主キー） | `Z04012101` |
| project_name | プロジェクト名 | `運営適正化委員会...` |
| project_type | タイプ | `公的` / `民間` |
| category | カテゴリー | `ヘルスケア` |
| term | 実施期 | `44期` |
| client_name | クライアント名 | `全国社会福祉協議会` |
| summary | 1行サマリー | `運営監視業務の実態把握...` |
| updated_at | 更新日時 | `2024-12-24T12:34:56Z` |
| registered_by | 登録担当者 | `山田花子` |
| registered_date | 登録日 | `2024-12-24` |

### projects_detail（詳細用）

| カラム | 説明 | フォーマット |
|-------|------|-----------|
| pj_number | PJ番号（主キー） | `Z04012101` |
| background | 背景・課題 | Markdown |
| purpose | 目的 | Markdown |
| implementation | 実施内容 | Markdown |
| deliverables | 成果物 | Markdown |
| reference_files | 参照ファイル | JSON配列 |
| notes | 備考 | テキスト |
| history_log | 変更履歴 | JSON配列 |

## 🔌 API エンドポイント

### GET リクエスト

| エンドポイント | 説明 |
|---------------|------|
| `?action=health` | ヘルスチェック |
| `?action=list` | 一覧取得（全件） |
| `?action=list&type=公的` | タイプで絞り込み |
| `?action=list&category=ヘルスケア` | カテゴリーで絞り込み |
| `?action=list&term=44期` | 実施期で絞り込み |
| `?action=list&client=社協` | クライアント名で検索 |
| `?action=list&q=運営` | フリーワード検索 |
| `?action=detail&pj=Z04012101` | 詳細取得 |

### POST リクエスト

| エンドポイント | 説明 |
|---------------|------|
| `?action=add` | 新規登録 |
| `?action=update&pj=Z04012101` | 更新 |
| `?action=delete_request` | 削除依頼記録 |
| `?action=delete&pj=Z04012101` | 削除実行（TOKEN必須） |

## 🎨 UI/UX 設計（予定）

### 一覧画面（projects.html）

```
┌─────────────────────────────────────┐
│ 🔍 絞り込み検索                      │
│ [タイプ▼] [カテゴリー▼] [実施期▼]   │
│ [クライアント検索] [フリーワード]     │
│ [検索]                               │
├─────────────────────────────────────┤
│ 📊 検索結果 (123件)                  │
│ ┌───────────────────────────────┐   │
│ │PJ番号 │プロジェクト名 │タイプ│期│  │
│ │Z04012101│運営適正化...│公的│44│   │
│ │       ↑クリックで詳細            │  │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 詳細画面（project.html）

```
┌─────────────────────────────────────┐
│ ← 一覧に戻る            [編集] [削除]│
│                                     │
│ 📄 PJ番号: Z04012101                │
│ プロジェクト名: 運営適正化委員会...  │
│ タイプ: 公的 / カテゴリー: ヘルスケア │
│                                     │
│ ▼ 背景・課題                         │
│   社会福祉法に基づき...              │
│                                     │
│ ▼ 目的                              │
│   各都道府県の運営適正化委員会...     │
│                                     │
│ ▼ 実施内容                          │
│   • プレヒアリング調査               │
│   • アンケート調査                   │
│                                     │
│ 📎 参照ファイル                      │
│   [事業計画書.pdf] [報告書.pdf]      │
└─────────────────────────────────────┘
```

## 🔒 セキュリティ

- **トークン認証**: 更新・削除は TOKEN 必須（推奨）
- **削除依頼ログ**: 即削除せず、依頼を記録（管理者承認フロー）
- **変更履歴**: 全ての変更を `history_log` に自動記録
- **削除ログ**: 削除時のスナップショットを `delete_logs` に保存

## 📝 次のステップ

### Phase 1: GAS 完了 ✅
- [x] `gas/Code.gs` 作成
- [x] `gas/README_GAS_SETUP.md` 作成
- [x] `gas/SCHEMA.md` 作成
- [x] `data/sample.json` 作成

### Phase 2: GAS デプロイ（次のタスク）
- [ ] GAS をスプレッドシートにデプロイ
- [ ] ヘルスチェックで動作確認
- [ ] サンプルデータを登録

### Phase 3: フロント基盤構築
- [ ] `js/config.js` 作成（GAS URL設定）
- [ ] `js/api.js` 作成（API通信ラッパー）
- [ ] `css/style.css` 作成（共通スタイル）

### Phase 4: 一覧画面実装
- [ ] `projects.html` 作成
- [ ] `js/projects.js` 作成
- [ ] 検索・絞り込み機能実装

### Phase 5: 詳細画面実装
- [ ] `project.html` 作成
- [ ] `js/project.js` 作成
- [ ] Markdown → HTML 変換（marked.js 導入）

### Phase 6: 登録・編集機能
- [ ] `register.html` 作成
- [ ] `edit.html` 作成
- [ ] バリデーション実装

## 🤝 参考システム

このシステムは `/project-tracker-mirror/` の設計思想を踏襲しています：
- Google Sheets をデータベースとして活用
- GAS で軽量なREST API を構築
- フロントは静的HTMLで高速表示
- セキュリティと監査ログの両立

## 📚 ドキュメント

- **GAS セットアップ**: `gas/README_GAS_SETUP.md`
- **データスキーマ**: `gas/SCHEMA.md`
- **サンプルデータ**: `data/sample.json`

## 💡 Tips

### Markdown の活用

長文フィールドは Markdown 形式で入力すると、見出し・箇条書き・リンクなどが使えます：

```markdown
## 大見出し
### 中見出し

- 箇条書き1
- 箇条書き2

**太字** / *斜体*

[リンク](https://example.com)
```

### 参照ファイルの登録

`reference_files` は JSON 配列で管理します：

```json
[
  {"label": "事業計画書", "url": "https://drive.google.com/..."},
  {"label": "報告書", "url": "https://..."}
]
```

### フィルタの組み合わせ

複数の条件で絞り込みが可能です：

```
?action=list&type=公的&category=ヘルスケア&term=44期
```

---

**バージョン**: 1.0.0  
**最終更新**: 2024-12-24  
**作成者**: Seed Planning開発チーム
