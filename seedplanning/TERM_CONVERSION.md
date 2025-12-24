# 📅 実施期の自動変換機能

## 概要

Seed Planningプロジェクト管理システムでは、`term`（実施期）カラムに日付文字列を入力すると、自動的に「○○期」の形式に変換する機能を実装しています。

## 変換ルール

### 基準
- **43期** = 2025年3月～2026年2月
- **44期** = 2026年3月～2027年2月
- **45期** = 2027年3月～2028年2月
- （以下同様に、毎年3月が期の開始月）

### 変換ロジック

1. 入力された日付の **年** と **月** を取得
2. **3月以降**の日付なら、その年が期の開始年
3. **2月以前**の日付なら、前年の3月が期の開始年
4. 基準年（43期 = 2025年）からの差分を計算して期を決定

### 変換式

```
期 = 43 + (期開始年 - 2025)
```

ここで、**期開始年**は以下のように決定：
- `月 >= 3` なら、期開始年 = 入力年
- `月 < 3` なら、期開始年 = 入力年 - 1

## 変換例

### 43期（2025年3月～2026年2月）

| 入力日付 | 変換結果 | 説明 |
|---------|---------|------|
| `2025-03-01` | `43期` | 43期の開始日 |
| `2025-06-15` | `43期` | 43期の途中（6月） |
| `2025-12-31` | `43期` | 43期の年末 |
| `2026-01-15` | `43期` | 43期の終盤（1月） |
| `2026-02-28` | `43期` | 43期の最終日 |

### 44期（2026年3月～2027年2月）

| 入力日付 | 変換結果 | 説明 |
|---------|---------|------|
| `2026-03-01` | `44期` | 44期の開始日 |
| `2026-04-10` | `44期` | 44期の途中（4月） |
| `2026-12-25` | `44期` | 44期のクリスマス |
| `2027-02-28` | `44期` | 44期の最終日 |

### その他の期

| 入力日付 | 変換結果 | 説明 |
|---------|---------|------|
| `2022-03-01` | `40期` | 40期の開始日 |
| `2023-03-01` | `41期` | 41期の開始日 |
| `2024-03-01` | `42期` | 42期の開始日 |
| `2027-03-01` | `45期` | 45期の開始日 |

## 日付フォーマットのサポート

以下の日付フォーマットをサポートしています：

- `2025-06-15`（ISO 8601形式）
- `2025/06/15`（スラッシュ区切り）
- `2025-06-15T12:34:56Z`（ISO 8601タイムスタンプ）
- その他、JavaScriptの`Date`コンストラクタで認識可能な形式

## 特殊な処理

### すでに「○○期」の形式の場合

入力値がすでに `43期` のような「数字 + 期」の形式の場合、変換せずにそのまま保持されます。

```javascript
// 例
dateToTerm('43期')  // → '43期' （変換されない）
dateToTerm('44期')  // → '44期' （変換されない）
```

### 無効な日付の場合

日付として認識できない文字列の場合、元の値がそのまま保持されます。

```javascript
// 例
dateToTerm('invalid')  // → 'invalid' （変換されない）
dateToTerm('')         // → '' （空文字列のまま）
```

## 実装箇所

### バックエンド（Google Apps Script）

**ファイル:** `/seedplanning/gas/Code.gs`

```javascript
/**
 * 日付文字列から「期」に変換
 */
function dateToTerm_(dateInput) {
  if (!dateInput) return '';
  
  // すでに「○○期」の形式なら、そのまま返す
  if (typeof dateInput === 'string' && /^\d+期$/.test(dateInput.trim())) {
    return dateInput.trim();
  }

  try {
    let date;
    if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
      return String(dateInput);
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const BASE_TERM = 43;
    const BASE_START_YEAR = 2025;
    const BASE_START_MONTH = 3;

    let termStartYear;
    if (month >= BASE_START_MONTH) {
      termStartYear = year;
    } else {
      termStartYear = year - 1;
    }

    const yearDiff = termStartYear - BASE_START_YEAR;
    const term = BASE_TERM + yearDiff;

    return `${term}期`;
  } catch (error) {
    return String(dateInput);
  }
}
```

**適用箇所:**
- `rowToIndexProject_()` 関数内で、`term` フィールドを変換

### フロントエンド（JavaScript）

**ファイル:** `/seedplanning/js/projects.js`

```javascript
/**
 * 日付文字列から「期」に変換
 */
dateToTerm(dateInput) {
  if (!dateInput) return '';
  
  // すでに「○○期」の形式なら、そのまま返す
  if (typeof dateInput === 'string' && /^\d+期$/.test(dateInput.trim())) {
    return dateInput.trim();
  }

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return String(dateInput);
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const BASE_TERM = 43;
    const BASE_START_YEAR = 2025;
    const BASE_START_MONTH = 3;

    let termStartYear;
    if (month >= BASE_START_MONTH) {
      termStartYear = year;
    } else {
      termStartYear = year - 1;
    }

    const yearDiff = termStartYear - BASE_START_YEAR;
    const term = BASE_TERM + yearDiff;

    return `${term}期`;
  } catch (error) {
    return String(dateInput);
  }
}
```

**適用箇所:**
- `createProjectRow()` 関数内で、表示時に変換

## テスト

### テストページ

変換ロジックの正確性を検証するためのテストページを用意しています：

**URL:** `https://8000-itup028mvtxj8wwferhun-c07dda5e.sandbox.novita.ai/test_term_conversion.html`

**テスト内容:**
- 40期～45期の変換テスト（25件以上のテストケース）
- 期の開始日、途中、最終日のテスト
- すでに「○○期」の形式の場合のテスト
- 異なる日付フォーマットのテスト
- エッジケース（空文字列、無効な日付）のテスト

### テスト実行方法

1. ブラウザで `test_term_conversion.html` を開く
2. 自動的にすべてのテストケースが実行される
3. 結果がテーブル形式で表示される
4. 全テスト合格の場合、緑色の成功メッセージが表示される

## 使い方

### Google Sheetsでの入力

`projects_index` シートの `term` カラムに日付を入力すると、API経由で取得する際に自動的に「○○期」に変換されます。

**例:**

| pj_number | project_name | ... | term | ... |
|-----------|-------------|-----|------|-----|
| Z04012101 | サンプルプロジェクト | ... | `2025-06-15` | ... |

↓ API経由で取得すると

```json
{
  "pj_number": "Z04012101",
  "project_name": "サンプルプロジェクト",
  "term": "43期",
  ...
}
```

### フロントエンドでの表示

プロジェクト一覧ページ（`projects.html`）では、自動的に変換された「○○期」が表示されます。

### フィルター機能

一覧ページの「実施期」フィルターでは、変換後の「43期」「44期」などで絞り込みが可能です。

## 注意事項

1. **スプレッドシートの元データは変更されません**
   - 変換はAPI取得時・表示時のみ行われます
   - スプレッドシートには日付文字列がそのまま保存されます

2. **タイムゾーン**
   - 日付の変換は、JavaScriptの`Date`オブジェクトのタイムゾーン設定に依存します
   - 通常、ブラウザのタイムゾーンが使用されます

3. **期の範囲**
   - 現在の実装では、40期～50期程度を想定しています
   - それ以外の期も理論上は変換可能ですが、データの妥当性を確認してください

## 更新履歴

- **2024-12-24**: 初版作成、日付→期の自動変換機能を実装
  - GAS側（`Code.gs`）に `dateToTerm_()` 関数を追加
  - フロントエンド側（`projects.js`）に `dateToTerm()` メソッドを追加
  - テストページ（`test_term_conversion.html`）を追加
  - スキーマ定義（`SCHEMA.md`）を更新

## 関連ドキュメント

- [スキーマ定義（SCHEMA.md）](./gas/SCHEMA.md)
- [GASセットアップガイド（README_GAS_SETUP.md）](./gas/README_GAS_SETUP.md)
- [システム概要（README.md）](./README.md)
