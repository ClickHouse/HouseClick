import csv
import math
import random
from datetime import timedelta, date
import clickhouse_connect
import numpy as numpy
import os
import openai

from images import Bing

client = clickhouse_connect.get_client(host=os.getenv("CLICKHOUSE_HOST", "localhost"),
                                       port=int(os.getenv("CLICKHOUSE_PORT", 8123)),
                                       username=os.getenv("CLICKHOUSE_USER", "default"),
                                       password=os.getenv("CLICKHOUSE_PASSWORD", ""),
                                       interface=os.getenv("CLICKHOUSE_PROTO", "http"))
openai.api_key = os.getenv("OPENAI_API_KEY")
max_variance = 0.05
new_percent = 0.05
num_properties = 1000


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


def get_description(query):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Write a short description to sell a {query}",
        temperature=0.4,
        max_tokens=300,
        top_p=1,
        frequency_penalty=0.5,
        presence_penalty=0.2,
    )
    return response.choices[0].text


def get_title(query):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Write a short title to sell a {query}",
        temperature=0.4,
        max_tokens=150,
        top_p=1,
        frequency_penalty=1,
        presence_penalty=0.2
    )
    return response.choices[0].text


def get_features(query):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Write me a list of features to sell a {query}",
        temperature=0.4,
        max_tokens=400,
        top_p=1,
        frequency_penalty=0.5,
        presence_penalty=0.2
    )
    return response.choices[0].text


c = 0
with open('house_prices.csv', 'w') as house_price_file:
    csvwriter = csv.writer(house_price_file)
    csvwriter.writerow(['id'] + fields + ['rooms', 'title', 'description', 'features', 'urls', 'sold', 'sold_date'])
    for i in range(num_properties):
        # select address at random (with postcode)
        result = client.query(f"select {','.join(fields)} FROM uk_price_paid WHERE postcode1 != '' AND postcode2 != '' "
                              f"AND type != 'other' ORDER BY rand() DESC LIMIT 1")
        house = result.first_row
        # find avg increase since last time sold for area
        stats = client.query(f"SELECT round(median(price)) FROM uk_price_paid WHERE postcode1 = '{house[8]}' "
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
            query = f"{rooms}-bedroom {house_type} {'' if house_type == 'flat' else 'house'} in {town}, {house[6]}, UK for {f'£{price:,}'}"
            bing = Bing(query, 3, 10, verbose=False, filter='+filterui:imagesize-custom_300_300')
            description = get_description(query).strip()
            features = get_features(query).strip()
            t_query = f"{rooms}-bedroom {house_type} {'' if house_type == 'flat' else 'house'} in {town}, {house[6]}, UK'"
            title = get_title(t_query).strip()
            images = bing.get_links()
            sold = False if random.random() < 0.8 else True
            sold_date = ''
            if sold:
                sold_date = random_date(date.today(), num_days=7)
            row = [c, date, house[1], house[2], house[3], house[4], house[5], house[6], house[7], house[8], house[9],
                   house_type, house[11], is_new, price, rooms, title, description, features, ",".join(images), sold,
                   sold_date]
            c += 1
            print(f"generated property - {c}")
            csvwriter.writerows([row])

