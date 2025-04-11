import csv
import os
import psycopg
from datetime import datetime

# Load PostgreSQL connection details from environment variables
db_host = os.environ.get("POSTGRES_HOST", "localhost")
db_name = os.environ.get("POSTGRES_DB")
db_user = os.environ.get("POSTGRES_USER")
db_password = os.environ.get("POSTGRES_PASSWORD")

# Connect to PostgreSQL
conn = psycopg.connect(
    host=db_host,
    dbname=db_name,
    user=db_user,
    password=db_password
)

def import_listings():
    cursor = conn.cursor()
    file = "house_prices.csv"
    with open(file, 'r') as house_prices_file:
        reader = csv.DictReader(house_prices_file)
        for row in reader:
            # Ensure correct data formatting
            row['sold'] = row['sold'].lower() == 'true'  # Convert to boolean
            row['sold_date'] = row['sold_date'] if row['sold'] else datetime.fromtimestamp(0).strftime('%Y-%m-%d')

            print(f"loading row {row['id']}")

            # Convert "urls" field into PostgreSQL text array format
            urls = row["urls"].split(",") if row["urls"] else []

            insert_query = """
            INSERT INTO uk_house_listings 
            (id, date, addr1, addr2, street, locality, town, district, county, 
            postcode1, postcode2, type, duration, is_new, price, rooms, title, 
            description, urls, sold, sold_date, features) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                    %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            """

            cursor.execute(insert_query, (
                int(row['id']),
                row['date'],  # Ensure the date format in CSV is correct
                row['addr1'], row['addr2'], row['street'], row['locality'],
                row['town'], row['district'], row['county'],
                row['postcode1'], row['postcode2'], row['type'], row['duration'],
                int(row['is_new']) if row['is_new'] else None,  # Handle NULL values
                int(row['price']) if row['price'] else None,
                int(row['rooms']) if row['rooms'] else None,
                row['title'], row['description'],
                urls,  # Ensure the "urls" column in PostgreSQL is of type TEXT[]
                row['sold'],
                row['sold_date'],
                row['features']
            ))

    # Commit and close connection
    conn.commit()
    cursor.close()

def import_transactions(): 
    cursor = conn.cursor()
    
    file = "uk_price_paid.csv"
    batch_size = 100000  # Insert in batches of 10,000 rows
    total_rows = 0
    data_batch = []

    with open(file, 'r') as transactions_file:
        reader = csv.DictReader(transactions_file)
        for row in reader:
            data_batch.append((
                int(row['price']) if row['price'] else None,
                row['date'], row['postcode1'], row['postcode2'],
                row['type'], bool(int(row['is_new'])) if row['is_new'] else None,
                row['duration'], row['addr1'], row['addr2'], row['street'],
                row['locality'], row['town'], row['district'], row['county']
            ))

            if len(data_batch) >= batch_size:
                print(f"Loading batch of {len(data_batch)} rows")
                # Insert batch into the database
                cursor.executemany("""
                    INSERT INTO uk_price_paid (
                        price, date, postcode1, postcode2, type, is_new, duration, 
                        addr1, addr2, street, locality, town, district, county
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO NOTHING
                """, data_batch)
                conn.commit()  # Commit after each batch
                data_batch = []  # Clear batch
                total_rows += batch_size
                print(f"Total rows inserted so far: {total_rows}")


    # Final insert for remaining rows
    if data_batch:
        cursor.executemany("""
            INSERT INTO uk_price_paid (
                price, date, postcode1, postcode2, type, is_new, duration, 
                addr1, addr2, street, locality, town, district, county
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, data_batch)
        conn.commit()

    cursor.close()


# import_listings()
import_transactions()
conn.close()
