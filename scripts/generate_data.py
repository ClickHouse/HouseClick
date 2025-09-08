import csv
import math
import random
from datetime import timedelta, date
import clickhouse_connect
import numpy as numpy
import os
import openai
import requests
from pathlib import Path

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.absolute()

client = clickhouse_connect.get_client(host=os.getenv("CLICKHOUSE_HOST", "sql-clickhouse.clickhouse.com"),
                                       port=int(os.getenv("CLICKHOUSE_PORT", 443)),
                                       username=os.getenv("CLICKHOUSE_USER", "demo"),
                                       password=os.getenv("CLICKHOUSE_PASSWORD", ""),
                                       interface=os.getenv("CLICKHOUSE_PROTO", "https"),
                                       secure=True)
openai.api_key = os.getenv("OPENAI_API_KEY")
max_variance = 0.05
new_percent = 0.05
num_properties = int(os.getenv("NUMBER_LISTINGS", 50))
offset = int(os.getenv("OFFSET", 0))

def random_date(end_date, num_days=90):
    start_date = end_date - timedelta(days=num_days)
    random_days = random.randrange(num_days)
    return start_date + timedelta(days=random_days)


fields = ['date', 'addr1', 'addr2', 'street', 'locality', 'town', 'district', 'county', 'postcode1', 'postcode2',
          'type', 'duration', 'is_new', 'price']


def num_bedrooms(house_type, price, area):
    num = 2
    if house_type == "flat":
        if area == "LONDON":
            mean = price / 200000
        else:
            mean = price / 100000
        mean = round(mean)
        mean = 1 if mean < 1 else mean
        num = round(numpy.random.exponential(mean))
    elif house_type == "terraced":
        if area == "LONDON":
            mean = price / 200000
        else:
            mean = price / 90000
        mean = round(mean)
        mean = 1 if mean < 1 else mean
        num = round(numpy.random.exponential(mean))
    elif house_type == "semi-detached":
        if area == "LONDON":
            mean = price / 250000
        else:
            mean = price / 125000
        mean = round(mean)
        mean = 1 if mean < 1 else mean
        num = round(numpy.random.exponential(mean))
    elif house_type == "detached":
        if area == "LONDON":
            mean = price / 300000
        else:
            mean = price / 150000
        mean = round(mean)
        mean = 1 if mean < 1 else mean
        num = round(numpy.random.exponential(mean))
    return 1 if num <= 0 else num

def num_bathrooms(num_bedrooms, house_type, price, area):
    base_num = max(1, math.floor(num_bedrooms / 2))
    price_divisors = {
        'flat': {'LONDON': 200000, 'OTHER': 100000},
        'terraced': {'LONDON': 200000, 'OTHER': 90000},
        'semi-detached': {'LONDON': 250000, 'OTHER': 125000},
        'detached': {'LONDON': 300000, 'OTHER': 150000}
    }
    area_key = 'LONDON' if area == 'LONDON' else 'OTHER'
    divisor = price_divisors.get(house_type, {}).get(area_key, 150000)
    price_factor = price / divisor
    bedroom_factor = num_bedrooms * 0.3
    mean = max(1, round(price_factor + bedroom_factor))
    raw_num = round(numpy.random.exponential(mean))
    final_num = max(base_num, raw_num)
    # For expensive properties, ensure at least 2 bathrooms
    if price > 1000000:
        final_num = max(2, final_num)
    if house_type == 'flat':
        final_num = min(final_num, num_bedrooms + 1)
    else:
        final_num = min(final_num, num_bedrooms * 2)
    
    return final_num

def calculate_square_meters(num_bedrooms, num_bathrooms, house_type, price, area):
    base_sizes = {
        'flat': 45,
        'terraced': 80,
        'semi-detached': 100,
        'detached': 150
    }
    base_size = base_sizes.get(house_type, 90)
    area_factor = 0.8 if area == 'LONDON' else 1.0
    bedroom_space = num_bedrooms * numpy.random.uniform(15, 25)
    bathroom_space = num_bathrooms * numpy.random.uniform(5, 8)
    price_per_sqm = {
        'flat': {'LONDON': 10000, 'OTHER': 3500},
        'terraced': {'LONDON': 8000, 'OTHER': 2800},
        'semi-detached': {'LONDON': 7000, 'OTHER': 2500},
        'detached': {'LONDON': 6000, 'OTHER': 2200}
    }
    area_key = 'LONDON' if area == 'LONDON' else 'OTHER'
    sqm_price = price_per_sqm.get(house_type, {}).get(area_key, 3000)
    price_contribution = (price / sqm_price) * area_factor
    random_factor = numpy.random.uniform(0.9, 1.1)
    square_meters = (base_size + bedroom_space + bathroom_space + price_contribution) * random_factor
    return int(round(square_meters))


def get_description(query):
    
    print('description', query)
    response = openai.ChatCompletion.create(
        model="gpt-4.1-mini",
        messages=[{"role": "system", "content": "You are a helpful assistant, generating data for a real estate website."},
                  {"role": "user", "content": f"""
                  Generate a compelling real estate listing for a  {query}
                  Maximum words is 200, make sure to finish the description with a call to action.

The listing should include:

1. An attention-grabbing title that highlights a unique feature or selling point (avoid simply stating the number of bedrooms and property type)

2. A detailed description that:
   - Describes the property's character and ambiance
   - Mentions the layout and key rooms
   - Highlights at least 2-3 standout features (like period details, modern renovations, garden features, etc.)
   - References the local area and amenities (schools, transport, parks, etc.)
   - Incorporates subtle luxury language without being overly promotional
   
3. Use British English terminology and phrasing appropriate for UK real estate.

 Don't use bold or italics. Don't repeat the title."""}],
        temperature=0.6,
        max_tokens=150,
        top_p=1,
        frequency_penalty=0.5,
        presence_penalty=0.2,
    )
    return response.choices[0].message.content


def get_title(query):
    print('title', query)
    response = openai.ChatCompletion.create(
        model="gpt-4.1-mini",
        messages=[{"role": "system", "content": "You are a helpful assistant, generating data for a real estate website."},
                  {"role": "user", "content": f"""Write a short title to sell a {query}. - Create an attention-grabbing title (6-8 words) that:
  - Highlights ONE distinctive feature (garden views, period charm, contemporary design, etc.)
  - Mentions the location but avoids repeating the exact formula "{rooms}-bedroom {house_type} in {town}"
  - Optionally includes a benefit to potential buyers (e.g., "perfect for families," "ideal investment")
  - Varies structure between listings (some can start with adjectives, others with features, etc.). 
   Maximum characters is 60.
  """}],
        temperature=0.8,
        max_tokens=60,
        top_p=1,
        frequency_penalty=1,
        presence_penalty=0.2,
    )
    return response.choices[0].message.content

def get_features(query):
    response = openai.ChatCompletion.create(
        model="gpt-4.1-mini",
        messages=[{"role": "system", "content": "You are a helpful assistant, generating data for a real estate website."},
                  {"role": "user", "content": f"""Write me a list of basic characteristics to sell a {query}. 
                            
                            The characteristics should be from that list: construction year, renovation year, terrace type, orientation, garden, parking, heating, appliances, lighting, energy efficiency. Don't use them all, just pick a random 4 or 5. Give me just the bullet points list, no intro. 
                            Here is an example: 
                            Built in 1945
                            Renovated in 2010
                            Electric heating
                            Large terrace 
                            Orientation: north-east.  """}],
        temperature=0.6,
        max_tokens=200,
        top_p=1,
        frequency_penalty=0.5,
        presence_penalty=0.2,
    )
    return response.choices[0].message.content

def get_inside_images(title, description, price):
    response = openai.Image.create(
        model="dall-e-3",
        # style='natural',
        prompt=f"""Generate a photo for a fake real estate website listing. No text on the photo.
        This is the title : {title} 
        Description: {description} and price: {price} of the listing.
        Use the description to generate a picture that corresponds to the property, especially make sure the photo is in line with the price of the property, title and location. 
        We want one photo of the inside of the property. 
        The photo should have realistic details, proper perspective, and architectural accuracy.
        Capture the living room.
        Important, just a photo of a room, not a collage of multiple rooms. No writing, no text, no distortions.""",
        # prompt=f"Generate images of a {description}. This is for a fake real-estate website demo. I need 4 images total, two for the outside and two for the inside of the house. The images should be realistic and high quality.",
        n=1,  # Number of images to generate
        size="1024x1024",  # Image dimensions
    )
    print(response)
    return response.data[0].url

def get_inside_images_main(title, description, price):
    response = openai.Image.create(
        model="dall-e-3",
        # style='natural',
        prompt=f"""Generate a photo for a fake real estate website listing. No text on the photo.
        This is the title : {title} 
        Description: {description} and price: {price} of the listing.
        Use the description to generate a picture that corresponds to the property, especially make sure the photo is in line with the price of the property, title and location. 
        We want one photo of the inside of the property. 
        The photo should have realistic details, proper perspective, and architectural accuracy.
        Either capture the living room.
        Important, just a photo of a room, not a collage of multiple rooms. No writing, no text, no distortions.""",
        # prompt=f"Generate images of a {description}. This is for a fake real-estate website demo. I need 4 images total, two for the outside and two for the inside of the house. The images should be realistic and high quality.",
        n=1,  # Number of images to generate
        size="1024x1024",  # Image dimensions
    )
    print(response)
    return response.data[0].url

def get_outside_images(title, description, price):
    response = openai.Image.create(
        model="dall-e-3",
        # style='natural',
        prompt=f"""Generate a photo for a fake real estate website listing. No text on the photo.
        This is the title : {title} 
        Description: {description} and price: {price} of the listing.
        Use the description to generate a picture that corresponds to the property, especially make sure the photo is in line with the price of the property, title and location. 
        We want one image of the outside of the property.
        The image should have realistic details, proper perspective, and architectural accuracy.
        Show the property from a flattering angle with good landscaping and clear details.
        Just a photo of the property, not a collage. No writing, no text, no distortions.
        No watermarks, no text, no distortions.""",
        # prompt=f"Generate images of a {description}. This is for a fake real-estate website demo. I need 4 images total, two for the outside and two for the inside of the house. The images should be realistic and high quality.",
        n=1,  # Number of images to generate
        size="1024x1024",  # Image dimensions
    )
    print(response)
    return response.data[0].url

def save_image(url, path):
    try: 
        response = requests.get(url)
        with open(SCRIPT_DIR.parent / path, 'wb') as file:
            file.write(response.content)
    except Exception as e:
        print(f"Error saving image {url}: {e}")

c = offset
with open(SCRIPT_DIR.parent / "data" / "uk_house_listings.csv", 'w') as house_price_file:
    csvwriter = csv.writer(house_price_file)
    csvwriter.writerow(['id'] + fields + ['rooms', 'bathrooms', 'title', 'description', 'features', 'urls', 'sold', 'sold_date'])
    for i in range(num_properties):
        # select address at random (with postcode)
        result = client.query(f"select {','.join(fields)} FROM uk.uk_price_paid WHERE postcode1 != '' AND postcode2 != '' "
                              f"AND type != 'other' ORDER BY rand() DESC LIMIT 1")
        house = result.first_row
        # find avg increase since last time sold for area
        stats = client.query(f"SELECT round(median(price)) FROM uk.uk_price_paid WHERE postcode1 = '{house[8]}' "
                             f"AND duration = '{house[11]}' AND type='{house[10]}' AND date > '2022-01-01'")
        var = random.uniform(0, max_variance) * (1 if bool(random.getrandbits(1)) else -1)
        # increase price
        if not math.isnan(stats.first_row[0]):
            price = round(int(stats.first_row[0] * (1 + var)), -4)
            date = random_date(date.today())
            is_new = 1 if random.random() < new_percent else 0
            house_type = house[10]
            town = house[5]
            rooms = num_bedrooms(house_type, price, town)
            bathrooms = num_bathrooms(rooms, house_type, price, town)
            query = f"{rooms}-bedroom {house_type} {'' if house_type == 'flat' else 'house'} in {town}, {house[6]}, UK for {f'£{price:,}'}"
            description = get_description(query).strip()
            features = get_features(query).strip()
            t_query = f"{rooms}-bedroom {house_type} {'' if house_type == 'flat' else 'house'} in {town}, {house[6]}, UK'"
            title = get_title(description).strip()
            images = []
            images.append(get_outside_images(title, description, price))
            # Get 2 inside images
            images.append(get_inside_images_main(title,description, price))
            # images.append(get_inside_images(title, description, price))
            images_path = []
            for i in range(2):
                path = f"images/{c}_{i}.png"
                images_path.append("/" + path)
                save_image(images[i], path)
            sold = False if random.random() < 0.8 else True
            sold_date = ''
            if sold:
                sold_date = random_date(date.today(), num_days=7)
            row = [c, date, house[1], house[2], house[3], house[4], house[5], house[6], house[7], house[8], house[9],
                   house_type, house[11], is_new, price, rooms, bathrooms, title, description, features, ",".join(images_path), sold,
                   sold_date]
            c += 1
            print(f"generated property - {c}")
            csvwriter.writerows([row])

