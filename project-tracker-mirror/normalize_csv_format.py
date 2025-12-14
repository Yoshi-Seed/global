#!/usr/bin/env python3
"""
Normalize CSV format to prevent Excel display issues.

Issues to fix:
1. Commas in specialty field (ID 364: "PCP,循環器内科")
2. Embedded newlines in target conditions (IDs 366, 367, 368, 372, 373)

Solutions:
1. Replace commas with fullwidth comma (，) in specialty field
2. Replace newlines with fullwidth semicolon (；) in all text fields
"""
import csv
import re

def normalize_field(field_value):
    """Normalize a field by replacing problematic characters."""
    if not field_value:
        return field_value
    
    # Replace embedded newlines (CR, LF, or CRLF) with fullwidth semicolon
    normalized = field_value.replace('\r\n', '；')
    normalized = normalized.replace('\r', '；')
    normalized = normalized.replace('\n', '；')
    
    # Remove multiple consecutive semicolons
    normalized = re.sub(r'；+', '；', normalized)
    
    # Remove leading/trailing semicolons
    normalized = normalized.strip('；')
    
    return normalized

def normalize_specialty(specialty_value):
    """Normalize specialty field by replacing commas with fullwidth comma."""
    if not specialty_value:
        return specialty_value
    
    # First normalize newlines
    normalized = normalize_field(specialty_value)
    
    # Replace comma with fullwidth comma for better Excel compatibility
    normalized = normalized.replace(',', '，')
    
    return normalized

# Read CSV
with open('seed_planning_data.csv', 'r', encoding='utf-8', newline='') as f:
    reader = csv.reader(f)
    header = next(reader)
    rows = list(reader)

print(f"Original row count: {len(rows)}")
print("\nNormalizing problematic fields...")

changes_made = []

for i, row in enumerate(rows):
    if len(row) < 20:
        continue
    
    row_id = row[0]
    changed = False
    
    # Normalize specialty field (column 8, index 7)
    original_specialty = row[7]
    if ',' in original_specialty or '\n' in original_specialty or '\r' in original_specialty:
        row[7] = normalize_specialty(original_specialty)
        if row[7] != original_specialty:
            changes_made.append(f"ID {row_id}: Specialty '{original_specialty}' → '{row[7]}'")
            changed = True
    
    # Normalize all text fields for embedded newlines
    for col_idx in range(len(row)):
        # Skip ID and numeric fields
        if col_idx in [0, 8]:  # id, 実績数
            continue
        
        original_value = row[col_idx]
        if '\n' in original_value or '\r' in original_value:
            row[col_idx] = normalize_field(original_value)
            if row[col_idx] != original_value:
                col_name = header[col_idx] if col_idx < len(header) else f"col{col_idx+1}"
                # Only show first change per row to avoid spam
                if not changed:
                    preview = original_value.replace('\n', '\\n').replace('\r', '\\r')[:60]
                    changes_made.append(f"ID {row_id}: {col_name} field normalized (had newlines)")
                    changed = True

# Write normalized CSV
with open('seed_planning_data.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f, lineterminator='\r\n')
    writer.writerow(header)
    writer.writerows(rows)

print(f"\n✅ CSV normalized successfully!")
print(f"   Total changes: {len(changes_made)}")
print(f"\nChanges made:")
for change in changes_made:
    print(f"   {change}")

print(f"\n📋 Summary:")
print(f"   - Commas in specialty fields replaced with fullwidth comma (，)")
print(f"   - Newlines in all fields replaced with fullwidth semicolon (；)")
print(f"   - Excel display should now work correctly")
