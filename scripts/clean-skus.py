#!/usr/bin/env python3
"""Clean up garbage SKU data and build interactive SKU selector."""
import json
import os

JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "lib", "products-data.json")

with open(JSON_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# Clean garbage SKUs
cleaned = 0
for item in data:
    skus = item.get("skus", [])
    if not skus:
        continue
    
    original_count = len(skus)
    # Filter out garbage SKUs
    good_skus = []
    for s in skus:
        cn = s.get("colorName", "")
        sz = s.get("size", "")
        # Skip if colorName is too long (garbage text)
        if len(cn) > 30:
            continue
        # Skip if colorName contains address/company info
        if any(kw in cn for kw in ["Modena", "Patent", "Via San", "Italy", "Reg. Imp", "TECHNOLOGY"]):
            continue
        # Skip if colorName is installation instructions
        if any(kw in cn for kw in ["laying", "surface", "infiltration", "adhesives", "water"]):
            continue
        # Skip if colorName is a percentage of finishing text
        if "finitura" in cn.lower() or "hologram" in cn.lower():
            continue
        # Skip if colorName looks like a size list (contains multiple size patterns)
        if cn.count("X") > 2 and "Mosaic" not in cn:
            continue
        good_skus.append(s)
    
    # Only keep SKUs that have either a meaningful size or meaningful colorName
    meaningful = []
    for s in good_skus:
        cn = s.get("colorName", "").strip()
        sz = s.get("size", "").strip()
        if not cn and not sz:
            continue
        # Skip pure inch conversions (e.g. colorName = '24"X48"' when size already has '60X120')
        if sz and cn and cn.replace('"','').replace(' ','').replace('X','x') in sz.replace(' ','').replace('X','x'):
            # It's just the inch conversion - keep but we'll display size only
            meaningful.append(s)
        else:
            meaningful.append(s)
    
    if len(meaningful) != original_count:
        item["skus"] = meaningful
        cleaned += original_count - len(meaningful)

# Also update CartItem type to support selectedSku
# We'll handle that in the component files

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Removed {cleaned} garbage SKUs")

# Verify
for item in data:
    skus = item.get("skus", [])
    if skus:
        print(f"  {item['collection']}: {len(skus)} SKUs")
        for s in skus[:3]:
            print(f"    {s.get('skuCode','')} | {s.get('size','')} | {s.get('colorName','')}")
        if len(skus) > 3:
            print(f"    ... +{len(skus)-3} more")
