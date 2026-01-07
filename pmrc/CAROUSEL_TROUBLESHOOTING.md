# カルーセル問題のトラブルシューティング

## 📅 更新日: 2026-01-07 (2回目の修正)

## 🐛 発見した問題

### 問題1: overflow設定の誤り
**原因**: `.snapshots-viewport`を`overflow: hidden`にしてしまい、JavaScriptの`scrollLeft`操作ができなくなった

**修正内容**:
```css
/* Before (誤り) */
.snapshots-viewport{
  overflow: hidden;
}

/* After (修正) */
.snapshots-viewport{
  overflow-x: scroll;  /* スクロール可能にする */
  overflow-y: hidden;
  scroll-behavior: smooth;
}

/* スクロールバーだけ非表示にする */
.snapshots-viewport::-webkit-scrollbar{
  display: none;
}
```

### 問題2: 古い重複スタイルの残存
**発見**: 1295-1327行目に古い`.snapshots-track`と`.snapshot-card`スタイルが残っていた

**修正内容**: 古いスタイルを完全削除

---

## ✅ 実施した修正

### 1. CSSの修正
- ✅ `.snapshots-viewport`を`overflow-x: scroll`に変更
- ✅ スクロールバーを非表示にする設定を追加
- ✅ 古い重複スタイルを削除（33行分）

### 2. JavaScriptのデバッグログ追加
矢印ボタンとドットのクリックイベントにコンソールログを追加：
```javascript
console.log('Prev/Next button clicked');
console.log('Current scrollLeft:', viewport.scrollLeft);
console.log('Step:', getStep());
```

---

## 🔧 技術的な説明

### スクロール仕組み
```
[snapshots-viewport] ← overflow-x: scroll (スクロール可能)
  └─ [snapshots-track] ← display: flex (カードを横並び)
       ├─ [snapshot] カード1
       ├─ [snapshot] カード2
       └─ [snapshot] カード3...
```

### JavaScript操作
```javascript
// 矢印ボタン
viewport.scrollBy({ left: ±getStep(), behavior: 'smooth' });

// ドット
viewport.scrollTo({ left: getStep() * index, behavior: 'smooth' });
```

### スクロールバー非表示
```css
/* すべてのブラウザ対応 */
.snapshots-viewport::-webkit-scrollbar { display: none; }  /* Chrome, Safari */
.snapshots-viewport { 
  -ms-overflow-style: none;  /* IE, Edge */
  scrollbar-width: none;      /* Firefox */
}
```

---

## 🧪 テスト方法

### ブラウザコンソールで確認
1. F12でデベロッパーツールを開く
2. Consoleタブを選択
3. 矢印ボタンをクリック
4. 以下のログが表示されるはず：
   ```
   Carousel initialization
   Viewport: <div class="snapshots-viewport">
   Cards count: 6
   Initial scrollLeft: 0
   ```
5. 矢印/ドットをクリック
6. スクロール位置の変化を確認

### 目視確認
- [ ] 矢印ボタンをクリックするとカードがスライドする
- [ ] ドットをクリックするとそのページにジャンプする
- [ ] スクロールバーが見えない
- [ ] カードをドラッグできる（既存機能）

---

## 📝 変更ファイル

### 修正済み
- ✅ `pmrc/styles.css` - viewport overflow修正、古いスタイル削除
- ✅ `pmrc/index.html` - デバッグログ追加

### バックアップ
- 📄 `pmrc/index_backup.html` - 修正前のバックアップ

---

## 🚀 次回のテスト

### テストリンク
```
https://8080-ia83ycmocv1wp0e7re1az-8f57ffe2.sandbox.novita.ai/index.html
```

### 確認項目
1. **矢印ボタン**をクリック → カードがスライドする
2. **ドット**をクリック → そのページにジャンプする
3. **F12コンソール**を開いて → ログが表示される
4. **スクロールバー**が見えない

### もし動かない場合
コンソールログを確認して、以下の情報を共有してください：
- `Viewport scrollWidth` と `clientWidth` の値
- `Initial scrollLeft` の値
- ボタンクリック時のエラーメッセージ

---

## 💡 根本原因

最初の実装で`overflow: hidden`にしてしまったため、JavaScriptが`viewport.scrollLeft`を操作できなくなっていました。

正しくは：
- **viewport**: `overflow-x: scroll`（スクロール可能）
- **スクロールバー**: `::-webkit-scrollbar { display: none }`（見えないだけ）

これにより：
- ✅ JavaScriptのscroll操作が動作
- ✅ スクロールバーは表示されない
- ✅ ユーザーは矢印とドットだけで操作

---

**作成者**: Claude AI  
**更新日時**: 2026-01-07 02:03
