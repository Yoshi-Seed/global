#!/usr/bin/env python3
"""
Fix CSV blank line issue by removing duplicate IDs and renumbering sequentially.

Problem: CSV has 375 rows with duplicate ID 374, should be 373 unique entries.
Solution: Remove duplicates (keeping the most recent by registration ID), then renumber 1-373.
"""
import csv
from datetime import datetime

# Read CSV with proper handling
rows = []
with open('seed_planning_data.csv', 'r', encoding='utf-8', newline='') as f:
    reader = csv.reader(f)
    header = next(reader)
    rows = list(reader)

print(f"Original row count: {len(rows)}")

# Remove rows with duplicate IDs, keeping the one with latest registrationId
seen_ids = {}
unique_rows = []

for row in rows:
    if len(row) == 0:
        continue  # Skip completely empty rows
    
    row_id = row[0].strip()
    if not row_id:
        continue  # Skip rows with empty ID
    
    reg_id = row[1].strip() if len(row) > 1 else ''
    
    if row_id in seen_ids:
        # Duplicate found - keep the one with later registration ID
        existing_row = seen_ids[row_id]
        existing_reg_id = existing_row[1].strip() if len(existing_row) > 1 else ''
        
        # Compare registration IDs (format: YYYYMMDD-XXXX)
        if reg_id > existing_reg_id:
            # Replace with newer entry
            print(f"Duplicate ID {row_id}: Keeping newer entry (RegID: {reg_id} over {existing_reg_id})")
            # Remove old entry from unique_rows
            unique_rows = [r for r in unique_rows if r[0].strip() != row_id]
            seen_ids[row_id] = row
            unique_rows.append(row)
        else:
            print(f"Duplicate ID {row_id}: Keeping existing entry (RegID: {existing_reg_id} over {reg_id})")
    else:
        seen_ids[row_id] = row
        unique_rows.append(row)

print(f"After removing duplicates: {len(unique_rows)} rows")

# Now renumber all IDs sequentially from 1
for i, row in enumerate(unique_rows, start=1):
    if len(row) > 0:
        row[0] = str(i)

print(f"Renumbered rows 1-{len(unique_rows)}")

# Write back to CSV with proper CRLF line endings
with open('seed_planning_data.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f, lineterminator='\r\n')
    writer.writerow(header)
    writer.writerows(unique_rows)

print(f"\n✅ CSV fixed successfully!")
print(f"   Final row count: {len(unique_rows)}")
print(f"   IDs renumbered: 1-{len(unique_rows)}")
