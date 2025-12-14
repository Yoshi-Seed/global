/**
 * ID抽出ロジックのテストスクリプト
 */

function getMaxIdFromCSV(csvContent) {
  let maxId = 0;
  
  // 方法1: 各行の先頭からIDを抽出（ダブルクォート対応）
  const idPattern = /(?:^|\n)"?(\d+)"?,/g;
  let match;
  
  while ((match = idPattern.exec(csvContent)) !== null) {
    const id = parseInt(match[1], 10);
    if (!isNaN(id) && id > maxId) {
      maxId = id;
    }
  }
  
  // 方法2（バックアップ）: 行ベースでチェック
  if (maxId === 0) {
    const lines = csvContent.trim().split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const lineMatch = line.match(/^"?(\d+)"?,/);
      if (lineMatch) {
        const id = parseInt(lineMatch[1], 10);
        if (!isNaN(id) && id > maxId) {
          maxId = id;
        }
      }
    }
  }
  
  return maxId;
}

// テストケース
const testCases = [
  {
    name: "ダブルクォートなし",
    csv: `id,name,value
1,test1,100
2,test2,200
374,test374,300`,
    expected: 374
  },
  {
    name: "ダブルクォート付き",
    csv: `id,name,value
"1","test1","100"
"2","test2","200"
"374","test374","300"`,
    expected: 374
  },
  {
    name: "混在（レガシー + 新規）",
    csv: `id,name,value
1,test1,100
2,test2,200
374,test374,300
"375","test375","400"
"376","test376","500"`,
    expected: 376
  },
  {
    name: "埋め込み改行あり",
    csv: `id,name,value
1,test1,100
2,"test
with
newlines",200
374,test374,300`,
    expected: 374
  },
  {
    name: "ダブルクォート付き + 埋め込み改行",
    csv: `id,name,value
"1","test1","100"
"2","test
with
newlines","200"
"374","test374","300"
"375","test
with
newlines","400"`,
    expected: 375
  }
];

console.log("=== ID抽出ロジック テスト ===\n");

testCases.forEach(testCase => {
  const result = getMaxIdFromCSV(testCase.csv);
  const status = result === testCase.expected ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} ${testCase.name}: Expected ${testCase.expected}, Got ${result}`);
});

console.log("\n=== 実際のCSVファイルでテスト ===");
const fs = require('fs');
const actualCsv = fs.readFileSync('seed_planning_data.csv', 'utf-8');
const actualMaxId = getMaxIdFromCSV(actualCsv);
console.log(`実際のCSVから取得したMax ID: ${actualMaxId}`);
console.log(`次に割り当てるID: ${actualMaxId + 1}`);
