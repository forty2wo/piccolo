#!/usr/bin/env python3
"""Restore Opificio Ceramico images in products-data.json from git history."""
import json
import os
import re

JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "lib", "products-data.json")
OLD_TS = "/tmp/old-bp.ts"

# Read the old brand-products.ts from git history (already extracted)
with open(OLD_TS, 'r') as f:
    content = f.read()

# Extract Opificio image data from old TS file
# Pattern: split by "collection": and find Opificio blocks
parts = content.split('"collection":')
old_images = {}  # slug -> {image, images}

for part in parts[1:]:
    col_match = re.match(r'\s*"([^"]*)"', part)
    if not col_match:
        continue
    collection_slug = col_match.group(1)
    
    if 'Opificio Ceramico' not in part[:500]:
        continue
    
    block = part[:3000]
    img_match = re.search(r'"images":\s*\[([^\]]*)\]', block)
    images = []
    if img_match:
        images = re.findall(r'"([^"]+)"', img_match.group(1))
    
    cover_match = re.search(r'"image":\s*"([^"]*)"', block)
    cover = cover_match.group(1) if cover_match else ""
    
    old_images[collection_slug] = {"image": cover, "images": images}

print(f"Extracted {len(old_images)} Opificio series from old TS:")
for slug, data in sorted(old_images.items()):
    print(f"  {slug}: {len(data['images'])} images")

# Now update the JSON
with open(JSON_PATH, 'r', encoding='utf-8') as f:
    products = json.load(f)

# The JSON uses collection names like "Biolith", "Beat", etc. (not slugs)
# The old TS used slugs like "opificio-biolith", "opificio-beat", etc.
# Need to map slug -> collection name

# Build mapping from slug to collection name using the old TS
# Also extract the "name" field
slug_to_name = {}
for part in parts[1:]:
    col_match = re.match(r'\s*"([^"]*)"', part)
    if not col_match:
        continue
    slug = col_match.group(1)
    
    if 'Opificio Ceramico' not in part[:500]:
        continue
    
    name_match = re.search(r'"name":\s*"([^"]*)"', part[:500])
    if name_match:
        slug_to_name[slug] = name_match.group(1)

print(f"\nSlug to name mapping:")
for slug, name in sorted(slug_to_name.items()):
    print(f"  {slug} -> {name}")

# Update JSON
updated = 0
for item in products:
    if item.get('brand') != 'Opificio Ceramico':
        continue
    
    collection_name = item.get('collection', '')
    
    # Find matching slug
    for slug, name in slug_to_name.items():
        if name == collection_name or slug.replace('opificio-', '').replace('-', '') == collection_name.lower().replace(' ', '').replace('-', ''):
            old_data = old_images.get(slug, {})
            old_imgs = old_data.get('images', [])
            if old_imgs and len(item.get('images', [])) < len(old_imgs):
                old_count = len(item.get('images', []))
                item['images'] = old_imgs
                if old_data.get('image') and not item.get('image'):
                    item['image'] = old_data['image']
                print(f"\n  Updated {collection_name}: {old_count} -> {len(old_imgs)} images")
                updated += 1
            break

# Also check for series that didn't have a slug match
# The old TS had 11 Opificio series, but JSON has 16
# Missing from old TS: Biolith, Polignano, Repetit, Sanremo, Venezia_Cromie
# These 5 were added later but may not have been in the b7d84fe commit

with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\nUpdated {updated} series")
print(f"Total Opificio images now: {sum(len(item.get('images',[])) for item in products if item.get('brand') == 'Opificio Ceramico')}")
