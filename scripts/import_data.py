import csv
import os
from datetime import datetime
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_PRIVATE_KEY")
print(key)
supabase: Client = create_client(url, key)

file = "house_prices.csv"

with open(file, 'r') as house_prices_file:
    reader = csv.DictReader(house_prices_file)
    for row in reader:
        if row['sold'] == 'False':
            row['sold_date'] = datetime.fromtimestamp(0).strftime('%Y-%m-%d')
        print(f"loading row {row['id']}")
        row["urls"] = row["urls"].split(",")
        data, count = supabase.table('uk_house_listings').insert(row).execute()
