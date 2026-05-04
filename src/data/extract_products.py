import json

with open('products.json', 'r') as f:
    products = json.load(f)

# Products to exclude (already reviewed)
excluded = {
    'babyzen-yoyo2', 'cosco-scenera-next', 'guava-family-travel-crib',
    'ergobaby-omni-classic', 'hiccapop-omniboost', 'jl-childress-gate-check-bag',
    'munchkin-brica-car-seat-bag', 'cozyphones-kids-headphones',
    'hatch-go-sound-machine', 'munchkin-formula-dispenser', 'regalo-my-cot'
}

# Target uncovered categories
uncovered_cats = {
    'Packing & Organization', 'Travel Toys', 'Travel Bath & Hygiene',
    'Road Trip Gear', 'Travel Safety & Baby Proofing'
}

candidates = []

for prod_id, data in products.items():
    if prod_id in excluded:
        continue
    
    cat = data.get('category', '')
    price_str = data.get('priceHint', '$0')
    
    try:
        price_float = float(price_str.replace('$','').replace(',',''))
    except:
        price_float = 0
    
    entry = {
        'id': prod_id,
        'name': data.get('name', ''),
        'brand': data.get('brand', ''),
        'category': cat,
        'price': price_str,
        'price_float': price_float,
        'is_uncovered': cat in uncovered_cats
    }
    
    candidates.append(entry)

# Separate uncovered and covered
uncovered = [c for c in candidates if c['is_uncovered']]
covered = [c for c in candidates if not c['is_uncovered']]

# Sort by price (descending) within each group
uncovered_sorted = sorted(uncovered, key=lambda x: x['price_float'], reverse=True)
covered_sorted = sorted(covered, key=lambda x: x['price_float'], reverse=True)

# Select top 10
top_10 = uncovered_sorted[:10] if len(uncovered_sorted) >= 10 else uncovered_sorted + covered_sorted[:10-len(uncovered_sorted)]

print("TOP 10 CANDIDATES:\n")
for i, prod in enumerate(top_10, 1):
    print(f"{i}. ID: {prod['id']}")
    print(f"   Name: {prod['name']}")
    print(f"   Category: {prod['category']}")
    print(f"   Price: {prod['price']}")
    print(f"   Brand: {prod['brand']}")
    print()
