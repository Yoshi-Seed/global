# CSVフォーマットガイド

## 概要

このドキュメントでは、`seed_planning_data.csv` のフォーマット仕様と、Excel表示問題を防ぐための正規化ルールについて説明します。

## 問題の背景

CSVファイルに以下のような文字が含まれていると、一部のExcelバージョンや環境で表示が崩れる問題がありました：

### 発生した問題

1. **専門フィールドのカンマ**
   - 例：`PCP,循環器内科`
   - CSV仕様上は正しくクォートされているが、Excelで行が折り返される
   - 影響：ID 364

2. **対象条件フィールドの改行**
   - 複数行のテキストが改行（`\r\n`）を含んでいた
   - CSV仕様上は正しくクォートされているが、Excelで複数行に分割表示される
   - 影響：ID 366, 367, 368, 372, 373

## 解決策

### 1. フィールド正規化ルール

すべてのテキストフィールドに対して以下の正規化を適用：

#### 改行の置換
```
\r\n → ；（全角セミコロン）
\r   → ；
\n   → ；
```

#### 専門フィールド専用：カンマの置換
```
, → ，（全角カンマ）
```

#### 連続文字の削除
```
；；； → ；
```

#### 前後のトリミング
```
；テキスト；；； → テキスト
```

### 2. 実装箇所

#### A. 既存データの修正
**スクリプト**: `normalize_csv_format.py`

```bash
# 実行方法
python3 normalize_csv_format.py
```

このスクリプトは：
- CSVファイル全体を読み込み
- すべてのフィールドを正規化
- 同じファイルに上書き保存（CRLF行末）

#### B. 新規登録の自動正規化
**場所**: `workers/add-project.js`

**関数**:
```javascript
// 汎用フィールド正規化（改行のみ）
function normalizeField(value)

// 専門フィールド正規化（改行とカンマ）
function normalizeSpecialty(value)
```

これにより、フォームから登録されるすべての新規データが自動的に正規化されます。

## CSVファイル仕様

### 基本情報
- **エンコーディング**: UTF-8
- **行末**: CRLF（`\r\n`）
- **区切り文字**: カンマ（`,`）
- **クォート**: すべてのフィールドがダブルクォート（`"`）で囲まれている
- **クォートのエスケープ**: `"` → `""`

### 列構造（20列）

| 列番号 | フィールド名 | データ型 | 正規化 |
|--------|-------------|---------|--------|
| 1 | id | 数値 | なし |
| 2 | registrationId | 文字列 | なし |
| 3 | 疾患名 | 文字列 | あり |
| 4 | 疾患略語 | 文字列 | あり |
| 5 | 手法 | 文字列 | あり |
| 6 | 調査種別 | 文字列 | あり |
| 7 | 対象者種別 | 文字列 | あり |
| 8 | **専門** | 文字列 | **あり（カンマも）** |
| 9 | 実績数 | 数値 | なし |
| 10 | 問合せのみ | TRUE/FALSE | なし |
| 11 | 対象条件 | 文字列 | あり |
| 12 | 薬剤 | 文字列 | あり |
| 13 | リクルート実施 | 文字列 | あり |
| 14 | モデレーター | 文字列 | あり |
| 15 | クライアント | 文字列 | あり |
| 16 | エンドクライアント | 文字列 | あり |
| 17 | PJ番号 | 文字列 | あり |
| 18 | 実施年月 | 文字列 | あり |
| 19 | 登録担当 | 文字列 | あり |
| 20 | 登録日 | 日付 (YYYY-MM-DD) | なし |

## メンテナンス

### 新しい問題が発生した場合

1. **問題の特定**
   ```bash
   python3 << 'EOF'
   import csv
   
   with open('seed_planning_data.csv', 'r', encoding='utf-8', newline='') as f:
       reader = csv.reader(f)
       header = next(reader)
       rows = list(reader)
   
   # 問題のあるフィールドを探す
   for row in rows:
       for i, field in enumerate(row):
           if '\n' in field or '\r' in field:
               print(f"ID {row[0]}: Column {i+1} has newlines")
           if ',' in field and i == 7:  # 専門フィールド
               print(f"ID {row[0]}: Specialty has comma")
   EOF
   ```

2. **正規化スクリプトの実行**
   ```bash
   python3 normalize_csv_format.py
   ```

3. **検証**
   ```bash
   # 問題がないことを確認
   python3 -c "import csv; f=open('seed_planning_data.csv','r',encoding='utf-8',newline=''); r=csv.reader(f); print(f'Rows: {len(list(r))-1}')"
   ```

4. **コミット**
   ```bash
   git add seed_planning_data.csv
   git commit -m "fix(csv): normalize problematic fields"
   git push origin main
   ```

## ベストプラクティス

### フォーム入力時
- 専門フィールドで複数の専門を入力する場合：
  - ✅ 推奨：`PCP；循環器内科` または `PCP 循環器内科`
  - ❌ 避ける：`PCP,循環器内科`

- 対象条件で複数の条件を入力する場合：
  - ✅ 推奨：箇条書きを全角セミコロン（；）で区切る
  - ❌ 避ける：改行（Enter）で区切る

### CSV編集時
- Excel で直接編集する場合、保存後に必ず以下を確認：
  1. エンコーディングがUTF-8であること
  2. 行末がCRLFであること
  3. 正規化スクリプトを実行すること

## トラブルシューティング

### 問題：Excelで特定の行が折り返される

**原因**: フィールド内にカンマまたは改行が含まれている

**解決方法**:
```bash
python3 normalize_csv_format.py
```

### 問題：新規登録時に改行やカンマが保存される

**原因**: Workerの正規化関数が正しく動作していない

**確認方法**:
1. `workers/add-project.js` で `normalizeField()` と `normalizeSpecialty()` が定義されているか確認
2. `generateCSVRow()` でこれらの関数が呼ばれているか確認

### 問題：ID が重複している

**解決方法**:
```bash
python3 fix_csv_blanks.py  # 重複削除とID再採番
```

## 変更履歴

### 2025-10-25
- CSV正規化機能を実装
- 問題のある6エントリを修正（ID 364, 366, 367, 368, 372, 373）
- Workerに自動正規化機能を追加
- このドキュメントを作成

## 参考資料

- [RFC 4180: CSV仕様](https://datatracker.ietf.org/doc/html/rfc4180)
- [Python csv モジュールドキュメント](https://docs.python.org/3/library/csv.html)
