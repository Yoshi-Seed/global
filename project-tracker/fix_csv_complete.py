#!/usr/bin/env python3
"""
CSVファイルの完全修正スクリプト
- 全行を12列に統一
- RFC 4180準拠の引用符処理（全フィールドをクォート）
- 改行コードをLFに統一
"""
import csv
import sys

input_file = 'seed_planning_data.csv'
output_file = 'seed_planning_data_fixed.csv'

# UTF-8でCSVを読み込み
with open(input_file, 'r', encoding='utf-8') as infile:
    # CRLF/LF両対応で読み込み
    content = infile.read()
    # CRLFをLFに統一
    content = content.replace('\r\n', '\n').replace('\r', '\n')
    
    # 文字列からCSVをパース
    reader = csv.reader(content.splitlines())
    rows = list(reader)

print(f"Total rows read: {len(rows)}")
print(f"Header: {rows[0]}")

# ヘッダーを確認・修正
header = rows[0]
expected_columns = [
    '疾患名', '疾患略語', '手法', '調査種別', '対象者種別', 
    '専門', '実績数', '対象条件', '薬剤', 'リクルート実施', 
    'クライアント', '登録日'
]

# ヘッダーが正しいか確認
if len(header) < 12:
    print(f"Warning: Header has {len(header)} columns, expected 12. Fixing...")
    header = expected_columns
    rows[0] = header
elif header != expected_columns:
    print(f"Warning: Header mismatch. Using expected header.")
    rows[0] = expected_columns

# データ行を処理
fixed_rows = [header]
errors = []

for idx, row in enumerate(rows[1:], start=2):
    # 12列に満たない行は空文字列で埋める
    while len(row) < 12:
        row.append('')
    
    # 12列より多い行はエラーとして記録し、最初の12列のみを使用
    if len(row) > 12:
        errors.append(f"Row {idx}: has {len(row)} columns (trimmed to 12)")
        row = row[:12]
    
    fixed_rows.append(row)

# エラーがあれば表示
if errors:
    print(f"\n⚠️  Found {len(errors)} rows with column count issues:")
    for error in errors[:10]:  # 最初の10個のみ表示
        print(f"  - {error}")
    if len(errors) > 10:
        print(f"  ... and {len(errors) - 10} more")

# 全フィールドを引用符で囲んで書き出し（LF改行）
with open(output_file, 'w', encoding='utf-8', newline='') as outfile:
    writer = csv.writer(outfile, quoting=csv.QUOTE_ALL, lineterminator='\n')
    writer.writerows(fixed_rows)

print(f"\n✅ Fixed CSV written to {output_file}")
print(f"Total rows: {len(fixed_rows)} (including header)")
print(f"All rows now have exactly 12 columns")
print(f"Line ending: LF (\\n)")
print(f"Quoting: RFC 4180 compliant (all fields quoted)")

# 検証
with open(output_file, 'r', encoding='utf-8') as verify:
    verify_reader = csv.reader(verify)
    verify_rows = list(verify_reader)
    
    print(f"\n🔍 Verification:")
    all_correct = True
    for idx, row in enumerate(verify_rows):
        if len(row) != 12:
            print(f"  ❌ Row {idx + 1}: {len(row)} columns")
            all_correct = False
    
    if all_correct:
        print(f"  ✅ All {len(verify_rows)} rows have exactly 12 columns")
    
    # CRLFがないか確認
    with open(output_file, 'rb') as binary_check:
        binary_content = binary_check.read()
        if b'\r\n' in binary_content:
            print(f"  ❌ CRLF found in file")
        elif b'\r' in binary_content:
            print(f"  ❌ CR found in file")
        else:
            print(f"  ✅ Line endings are LF only")
