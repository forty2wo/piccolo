#!/usr/bin/env python3
"""Second pass: remove all remaining garbage SKUs from Opificio Ceramico."""
import json
import os

JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "lib", "products-data.json")

with open(JSON_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

removed = 0
for item in data:
    skus = item.get("skus", [])
    if not skus:
        continue
    
    clean = []
    for s in skus:
        cn = s.get("colorName", "").strip()
        sz = s.get("size", "").strip()
        
        # Skip if no size AND colorName looks like garbage
        if not sz:
            # If colorName is a phone/fax/address/company info, skip
            if any(kw in cn for kw in ["+39", "Modena", "Via San", "Italy", "Reg.", "Patent", "data ", "con numero"]):
                continue
            # If colorName is too short or meaningless
            if len(cn) < 3:
                continue
            # If it's clearly not a color name
            if cn.startswith("F ") or cn.startswith("F. ") or cn.startswith("T ") or cn.startswith("T. "):
                continue
            # Skip if no meaningful info at all
            if not cn:
                continue
        
        clean.append(s)
    
    diff = len(skus) - len(clean)
    if diff > 0:
        removed += diff
        item["skus"] = clean

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Removed {removed} more garbage SKUs")

# Final report
series_with_skus = 0
total_skus = 0
for item in data:
    skus = item.get("skus", [])
    if skus:
        series_with_skus += 1
        total_skus += len(skus)
        
print(f"Final: {series_with_skus} series with SKUs, {total_skus} total SKUs")

# Show series WITHOUT any SKUs
no_skus = [item["collection"] for item in data if not item.get("skus")]
print(f"Series without SKUs ({len(no_skus)}): {', '.join(no_skus)}")
