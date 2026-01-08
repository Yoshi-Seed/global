#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Convert Japan_All_Patient_Population.xlsx -> diseases.json
# Usage:
#   python scripts/convert_xlsx_to_json.py --xlsx Japan_All_Patient_Population.xlsx --out data/diseases.json

import argparse
import json
from pathlib import Path

import pandas as pd


def to_int(x):
    if pd.isna(x):
        return None
    try:
        return int(round(float(x)))
    except Exception:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--xlsx", required=True, help="Path to the Excel file")
    ap.add_argument("--out", required=True, help="Output JSON path")
    args = ap.parse_args()

    xlsx_path = Path(args.xlsx)
    out_path = Path(args.out)

    df = pd.read_excel(xlsx_path)

    required_cols = ["ICD10コード", "疾患名", "Disease", "総患者数（推定人）"]
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise SystemExit(f"Missing columns: {missing}")

    records = []
    for _, row in df.iterrows():
        rec = {
            "icd10": str(row["ICD10コード"]).strip(),
            "jp": str(row["疾患名"]).strip(),
            "en": str(row["Disease"]).strip(),
            "patients_estimated": to_int(row["総患者数（推定人）"]),
            "recruit_coef": None,
            "difficulty_coef": None,
            "social_coef": None,
            "sns_coef": None,
        }

        # Optional columns (if you fill them later)
        optional = [
            ("recruit_coef", "リクルート係数"),
            ("difficulty_coef", "難易度係数"),
            ("social_coef", "社会係数"),
            ("sns_coef", "SNS係数"),
        ]
        for key, col in optional:
            if col in df.columns and not pd.isna(row[col]):
                try:
                    rec[key] = float(row[col])
                except Exception:
                    rec[key] = None

        records.append(rec)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(records)} records -> {out_path}")


if __name__ == "__main__":
    main()
