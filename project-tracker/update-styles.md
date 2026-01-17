# スタイル更新ガイド

## Phase 1完了: 基盤整備

### ✅ 実装済み内容

#### 1. CSS変数とクラスの追加
- **ファイル**: `css/style-2026.css`
  - Seed Planningブランドカラー（#1F7A85）をCSS変数化
  - 新しいユーティリティクラスを追加:
    - `.bg-sp-primary`: SP プライマリ背景色
    - `.text-sp-primary`: SP プライマリテキスト色
    - `.border-sp-primary`: SP プライマリボーダー
    - `.bg-sp-gradient`: SP グラデーション背景
    - `.bg-sp-secondary`: SP セカンダリ背景

#### 2. 共通コンポーネントCSS
- **ファイル**: `css/components.css`
  - 再利用可能なコンポーネントスタイル
  - ナビゲーション、カード、バッジ、フォーム、テーブル等

#### 3. 共通ユーティリティ関数
- **ファイル**: `js/utils.js`
  - 重複していた関数を統合:
    - `truncate()`: テキスト切り詰め
    - `escapeCSVField()`: CSVエスケープ
    - `formatDateString()`: 日付フォーマット
    - `getTargetTypeBadgeClass()`: バッジクラス取得
  - 新規追加:
    - デバウンス、スロットル
    - ストレージ操作
    - バリデーション関数

#### 4. 専門科データ統一
- **ファイル**: `js/data/specialties-master.js`
  - 重複定義を排除した統一マスター
  - 完全なデータ定義（日英、略語、カテゴリー）
  - 検索インデックス機能
  - オートコンプリート対応

---

## 📝 HTMLファイル更新手順

### Step 1: CSSファイルの読み込み追加

各HTMLファイルの`<head>`セクションに以下を追加:

```html
<!-- 既存のTailwind CSSの後に追加 -->
<link rel="stylesheet" href="css/style-2026.css">
<link rel="stylesheet" href="css/components.css">
```

### Step 2: インラインスタイルの置き換え

#### Before (インラインスタイル):
```html
<a href="index.html" style="background-color: #1F7A85;">ホーム</a>
```

#### After (CSSクラス):
```html
<a href="index.html" class="bg-sp-primary">ホーム</a>
```

### Step 3: JavaScript関数の更新

#### Before (重複定義):
```javascript
function truncate(text, length) {
  // 各ファイルで個別定義
}
```

#### After (共通ユーティリティ使用):
```html
<script src="js/utils.js"></script>
<script>
  // ProjectUtils.truncate() を使用
  const shortened = ProjectUtils.truncate(longText, 100);
  
  // または後方互換性のため
  const shortened = truncate(longText, 100);
</script>
```

### Step 4: 専門科データの更新

#### Before (複数ファイルで定義):
```javascript
// register.html内
const SPECIALTIES_MASTER = [...];

// specialties.js内
const SPECIALTY_DATA = [...];

// specialty-groups.js内
const SPECIALTY_GROUPS = {...};
```

#### After (統一マスター使用):
```html
<script src="js/data/specialties-master.js"></script>
<script>
  // 統一された関数を使用
  const specialty = SpecialtyMaster.findSpecialtyByName('内科');
  const categories = SpecialtyMaster.getCategories();
  const autocompleteData = SpecialtyMaster.getAutocompleteData();
</script>
```

---

## 🔄 変更対象ファイルと置換内容

### 1. index.html
- [ ] CSS読み込み追加
- [ ] `style="background-color: #1F7A85"` → `class="bg-sp-primary"`
- [ ] `truncate()` 関数削除 → `js/utils.js` 使用
- [ ] `getTargetTypeBadgeClass()` 関数削除

### 2. projects.html
- [ ] CSS読み込み追加
- [ ] インラインスタイル置換（47箇所）
- [ ] 重複関数削除（5個以上）
- [ ] 専門科データ参照を統一

### 3. register.html
- [ ] CSS読み込み追加
- [ ] `SPECIALTIES_MASTER` を新マスターに置換
- [ ] フォームスタイルをコンポーネントクラスに

### 4. import.html
- [ ] CSS読み込み追加
- [ ] ローディングアニメーション色の置換
- [ ] グラフ色を CSS変数参照に

### 5. links.html / links-test.html
- [ ] CSS読み込み追加
- [ ] ナビゲーションボタンのスタイル統一

---

## 🚀 次のステップ（Phase 2以降）

### Phase 2: JavaScriptモジュール化
- projects.html の1000行超のスクリプトを分割
- フィルタリング、ページネーション、モーダルの独立モジュール化

### Phase 3: HTMLテンプレート化
- ナビゲーションバーの共通化（250行×5ファイル削減）
- Web Components または include方式の実装

### Phase 4: バリデーション統一
- FormValidator クラスの実装
- エラーメッセージの一元管理

---

## 📊 改善効果（Phase 1完了時点）

| 項目 | 改善前 | 改善後 | 効果 |
|------|--------|--------|------|
| 色定義の重複 | 50箇所以上 | CSS変数1箇所 | **-98%** |
| ユーティリティ関数重複 | 5ファイル | 1ファイル | **-80%** |
| 専門科データ定義 | 3箇所 | 1箇所 | **-67%** |
| 保守性 | 個別更新必要 | 一元管理 | **大幅向上** |

---

## ⚠️ 注意事項

1. **段階的移行**: すべてを一度に変更せず、ファイルごとに確認しながら進める
2. **後方互換性**: 既存コードが動作するよう、グローバル関数は維持
3. **テスト確認**: 各ファイル更新後、以下を確認:
   - 新規登録機能
   - 検索・フィルタリング
   - CSVエクスポート/インポート
   - モバイル表示

4. **バックアップ**: 更新前に必ず現在の状態をバックアップ