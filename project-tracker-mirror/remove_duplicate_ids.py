#!/usr/bin/env python3
"""
重複IDデータを削除するスクリプト

削除対象ID: 208, 356, 358
(これらのIDは374と同じデータの重複エントリー)

理由: 
- ID 374 のデータと同一内容のため不要
- ID は連番である必要がなく、最大値のみが重要
- Worker は getMaxIdFromCSV() で最大ID+1を生成するため影響なし
"""

import csv
import sys
from pathlib import Path

# 削除対象のID
DUPLICATE_IDS = ["208", "356", "358"]

def remove_duplicate_ids(input_file, output_file):
    """重複IDを削除"""
    removed_count = 0
    kept_count = 0
    
    with open(input_file, 'r', encoding='utf-8-sig', newline='') as infile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        
        rows_to_keep = []
        
        for row in reader:
            row_id = row.get('id', '').strip().strip('"')
            
            if row_id in DUPLICATE_IDS:
                print(f"❌ 削除: ID {row_id} - {row.get('疾患名', '')} ({row.get('registrationId', '')})")
                removed_count += 1
            else:
                rows_to_keep.append(row)
                kept_count += 1
        
        # 出力
        with open(output_file, 'w', encoding='utf-8', newline='') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows_to_keep)
    
    print(f"\n✅ 完了:")
    print(f"   - 削除: {removed_count} 件")
    print(f"   - 保持: {kept_count} 件")
    print(f"   - 出力: {output_file}")
    
    return removed_count, kept_count

def main():
    input_file = Path('seed_planning_data.csv')
    backup_file = Path('seed_planning_data.backup.csv')
    output_file = Path('seed_planning_data.csv')
    
    if not input_file.exists():
        print(f"❌ エラー: {input_file} が見つかりません")
        sys.exit(1)
    
    # バックアップ作成
    import shutil
    shutil.copy2(input_file, backup_file)
    print(f"📁 バックアップ作成: {backup_file}")
    
    # 重複削除
    print(f"\n🔍 重複ID削除処理開始...")
    remove_duplicate_ids(input_file, output_file)
    
    print(f"\n💾 バックアップは {backup_file} に保存されています")

if __name__ == "__main__":
    main()
