# 重複プロジェクト表示問題 - 調査報告書

## 🔴 問題の概要

`projects.html` で同じプロジェクトが複数回表示される問題が発生しています。

### 報告された症状
- **No.426** (登録ID: 20251105-0007) が5回表示
- **No.425** (登録ID: 20251105-0006) が5回表示
- **No.424** (登録ID: 20251105-0005) が5回表示

スクリーンショット確認: 各プロジェクトが同じ内容で複数回繰り返し表示されている

## 🔍 原因調査

### 1. CSVファイルの確認
```bash
# 登録IDの重複チェック
awk -F',' 'NR>1 {print $2}' seed_planning_data.csv | sort | uniq -c | sort -rn
```

**結果**: 
- 該当の登録ID（20251105-0007, 20251105-0006, 20251105-0005）はCSV内に **1回ずつしか存在しない**
- CSVファイル内のID列も重複なし
- 合計468レコード（ヘッダー除く）

### 2. CSV内容の確認
```csv
Line 415: "424","20251105-0005","肥満症","Obesity",...
Line 416: "425","20251105-0006","肥満症","Obesity",...
Line 417: "426","20251105-0007","肥満症","Obesity",...
```

**結果**: 
- 各レコードは1回ずつのみ存在
- ID、登録ID、内容すべて正常

### 3. APIコードの確認

`js/api.js` の `parseCSV()` 関数:
```javascript
return dataLines.map((line, index) => {
  const fields = this.parseCSVLine(line.trim());
  const id = parseInt(fields[0]) || (index + 1);  // ← IDは各行から取得
  // ...
}).filter(project => project.diseaseName); // 空行を除外
```

**結果**: 
- APIのパースロジックは正常
- 各行は1回ずつ処理される
- IDは重複しないはず

### 4. レンダリングロジックの確認

`projects.html` の `renderProjectTable()` 関数:
```javascript
function renderProjectTable(projects) {
  const tbody = document.getElementById('projectTableBody');
  tbody.innerHTML = '';  // ← 既存要素をクリア
  
  projects.forEach((project, index) => {
    const row = document.createElement('tr');
    // ... 行を作成
    tbody.appendChild(row);  // ← 1行ずつ追加
  });
}
```

**結果**: 
- レンダリングロジックも正常
- `innerHTML = ''` で既存要素をクリア
- `forEach` で1回ずつ処理

### 5. ページネーションロジックの確認

`renderWithPagination()` 関数:
```javascript
function renderWithPagination(sorted) {
  let displayProjects;
  
  if (!isSearching) {
    displayProjects = paginate(sorted, currentPage, pageSize);  // ← 100件ずつ
  } else {
    displayProjects = sorted;  // ← または全件
  }
  
  renderProjectTable(displayProjects);  // ← 1回だけ呼び出し
}
```

**結果**: 
- ページネーションロジックも正常
- `renderProjectTable` は1回だけ呼び出される

## 🎯 考えられる原因

### 仮説1: APIが同じデータを複数回返している ❌
- CSVには重複なし
- APIのパースロジックも正常
- **可能性低い**

### 仮説2: レンダリングが複数回実行されている ❌
- `tbody.innerHTML = ''` で毎回クリア
- `renderProjectTable` は1回だけ呼ばれる
- **可能性低い**

### 仮説3: 配列内に同じオブジェクトが複数回含まれている ⚠️
- `allProjects` 配列に同じプロジェクトが複数回追加されている可能性
- フィルタリングやソート時に重複が発生している可能性
- **可能性高い**

### 仮説4: APIキャッシュの問題 ⚠️
- 複数回のAPI呼び出しで配列が累積している可能性
- キャッシュのクリア漏れ
- **要確認**

### 仮説5: ブラウザキャッシュまたは古いコードの実行 ⚠️
- ユーザーのブラウザが古いバージョンのコードを実行している
- スーパーリロード (Ctrl+Shift+R) で解決する可能性
- **要ユーザー確認**

## 🔧 実装した修正

### 1. 重複検出とデバッグログ追加

`init()` 関数に重複検出ロジックを追加:
```javascript
async function init() {
  allProjects = await api.getAllProjects();
  
  // デバッグ: 重複チェック
  console.log(`📊 Total projects loaded: ${allProjects.length}`);
  const allIds = allProjects.map(p => p.id);
  const uniqueIds = [...new Set(allIds)];
  
  if (allIds.length !== uniqueIds.length) {
    console.error(`❌ データに重複あり！ Total: ${allIds.length}, Unique: ${uniqueIds.length}`);
    const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
    console.error('重複ID:', duplicates);
    
    // 自動修正: 重複を削除
    const seen = new Set();
    allProjects = allProjects.filter(p => {
      if (seen.has(p.id)) {
        console.warn(`🔧 重複削除: ID ${p.id} - ${p.diseaseName}`);
        return false;
      }
      seen.add(p.id);
      return true;
    });
    console.log(`✅ 重複削除後: ${allProjects.length} projects`);
  } else {
    console.log(`✅ データに重複なし`);
  }
  
  // 以降の処理...
}
```

### 2. レンダリング時の重複検出

`renderWithPagination()` 関数に重複検出ロジックを追加:
```javascript
function renderWithPagination(sorted) {
  // ... displayProjects を決定
  
  // デバッグ: 重複チェック
  const ids = displayProjects.map(p => p.id);
  const uniqueIds = [...new Set(ids)];
  if (ids.length !== uniqueIds.length) {
    console.warn(`⚠️ 重複検出！ Total: ${ids.length}, Unique: ${uniqueIds.length}`);
    console.warn('重複ID:', ids.filter((id, index) => ids.indexOf(id) !== index));
  }
  
  // レンダリング
  if (currentView === 'card') {
    renderProjectCards(displayProjects);
  } else {
    renderProjectTable(displayProjects);
  }
}
```

## 📝 検証手順

### ユーザー側で確認すべきこと

1. **ブラウザのスーパーリロード**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
   - これでブラウザキャッシュをクリア

2. **ブラウザのコンソールを開く**
   - Windows/Linux: `F12` または `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`
   - Console タブを選択

3. **ページをリロード**
   - コンソールに以下のようなログが表示されるはず:
     ```
     📊 Total projects loaded: 468
     ✅ データに重複なし
     ```
   - または、重複が検出された場合:
     ```
     📊 Total projects loaded: 936
     ❌ データに重複あり！ Total: 936, Unique: 468
     重複ID: [424, 425, 426, ...]
     🔧 重複削除: ID 424 - 肥満症
     🔧 重複削除: ID 425 - 肥満症
     ...
     ✅ 重複削除後: 468 projects
     ```

4. **問題が解決しているか確認**
   - No.426, 425, 424 が1回ずつしか表示されないことを確認
   - 他のプロジェクトも重複していないことを確認

### 開発者側での確認

1. **APIレスポンスの確認**
   ```javascript
   // ブラウザコンソールで実行
   const api = new ProjectAPI();
   const projects = await api.getAllProjects();
   console.log('Total:', projects.length);
   const ids = projects.map(p => p.id);
   const unique = [...new Set(ids)];
   console.log('Unique:', unique.length);
   console.log('Has duplicates:', ids.length !== unique.length);
   ```

2. **Cloudflare Worker のログ確認**
   - Worker側で複数回データを返していないか確認
   - キャッシュが正しく動作しているか確認

3. **ネットワークタブの確認**
   - DevTools > Network タブ
   - `/data` エンドポイントへのリクエストが複数回発生していないか
   - 各リクエストのレスポンスサイズが異常に大きくないか

## 🚀 デプロイ情報

- **Commit**: `ca412d7`
- **Branch**: `genspark_ai_developer`
- **Files Changed**: `projects.html`
- **Changes**: 
  - デバッグログ追加
  - 自動重複削除機能追加

## 📊 予想される結果

### Case 1: APIが重複データを返している場合
- コンソールに「データに重複あり！」と表示される
- 自動修正により重複が削除され、正常に表示される
- **根本原因**: API側（Worker または CSV読み込み）に問題

### Case 2: レンダリングが複数回実行されている場合
- コンソールに「重複検出！」と表示される（renderWithPagination内）
- displayProjects配列に同じIDが複数含まれる
- **根本原因**: フィルタリングまたはソートロジックに問題

### Case 3: ブラウザキャッシュの問題
- スーパーリロード後、問題が解決する
- コンソールに「データに重複なし」と表示される
- **根本原因**: 古いコードの実行

### Case 4: 実際には重複していない（表示の問題）
- コンソールに「データに重複なし」と表示される
- しかし画面上で重複が見える
- **根本原因**: CSSまたはDOM操作の問題

## 🔧 追加の修正案（必要に応じて実施）

### 1. APIキャッシュの強制クリア
```javascript
async function init() {
  allProjects = await api.getAllProjects(true);  // forceRefresh=true
  // ...
}
```

### 2. データ読み込み前に配列をクリア
```javascript
let allProjects = [];
let filteredProjects = [];

async function init() {
  // 明示的にクリア
  allProjects = [];
  filteredProjects = [];
  
  allProjects = await api.getAllProjects();
  // ...
}
```

### 3. Worker側のキャッシュ確認
Cloudflare Worker (`project-tracker-api.y-honda.workers.dev`) の実装確認:
- キャッシュが累積していないか
- 同じデータを複数回返していないか

### 4. CSV読み込みの改善
`js/api.js` の `parseCSV()` に重複除去を追加:
```javascript
parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  const dataLines = lines.slice(1);
  
  const projects = dataLines.map((line, index) => {
    // ... パース処理
  }).filter(project => project.diseaseName);
  
  // 重複除去
  const seen = new Set();
  return projects.filter(p => {
    if (seen.has(p.id)) {
      console.warn(`CSV parse: duplicate ID ${p.id} found and removed`);
      return false;
    }
    seen.add(p.id);
    return true;
  });
}
```

## 📞 次のステップ

1. ✅ **デバッグコードをデプロイ** - 完了
2. ⏳ **ユーザーに確認依頼**
   - ブラウザのスーパーリロード
   - コンソールログの確認
   - スクリーンショットの提供
3. ⏳ **ログの分析**
   - どのCase に該当するか判定
   - 根本原因の特定
4. ⏳ **根本的な修正の実施**
   - 特定された原因に応じた修正
   - 再テスト

## 📎 関連情報

- **CSV行数**: 469行（ヘッダー含む）= 468プロジェクト
- **該当プロジェクト**:
  - No.424 (Line 415): 20251105-0005, 肥満症, 循環器内科, 実績3
  - No.425 (Line 416): 20251105-0006, 肥満症, 内分泌代謝内科, 実績4
  - No.426 (Line 417): 20251105-0007, 肥満症, 消化器内科, 実績1
- **表示問題**: 各プロジェクトが5回ずつ表示される

---

**報告日**: 2025-11-09
**調査者**: Claude Code (AI Assistant)
**ステータス**: 🔍 調査中 - デバッグコード実装完了、ユーザー確認待ち
