CREATE TABLE uk_house_listings
(
   id integer primary key,
   date Date,
   addr1 varchar(100),
   addr2 varchar(100),
   street varchar(60),
   locality varchar(35),
   town varchar(35),
   district varchar(40),
   county varchar(35),
   postcode1 varchar(8),
   postcode2 varchar(3),
   type varchar(13),
   duration varchar(9),
   is_new SMALLINT,
   price INTEGER,
   rooms SMALLINT,
   bathrooms SMALLINT,
   title text,
   description text,
   urls Text[],
   sold boolean,
   sold_date Date,
   features text
)

CREATE TABLE uk_house_dict_district
(
   id integer primary key,

   district varchar(40),
   count integer
);

CREATE TABLE uk_house_dict_town
(
   id integer primary key,
   district varchar(40),
   town varchar(35),
   count integer
);

CREATE TABLE uk_house_dict_postcode
(
   id integer primary key,
   town varchar(35),
   district varchar(40),
   postcode1 varchar(8),
   count integer
);

INSERT INTO uk_house_dict_district (id, district, count)
SELECT
    ROW_NUMBER() OVER () AS id,
    district,
    count(*) AS count
FROM uk_price_paid
GROUP BY district;

INSERT INTO uk_house_dict_town (id, district, town, count)
SELECT
    ROW_NUMBER() OVER () AS id,
    district,
    town,
    count(*) AS count
FROM uk_price_paid
GROUP BY district, town;


INSERT INTO uk_house_dict_postcode (id, district, town, postcode1, count)
SELECT
    ROW_NUMBER() OVER () AS id,
    district,
    town,
    postcode1,
    count(*) AS count
FROM uk_price_paid
GROUP BY district, town, postcode1;


alter table
  uk_house_listings_temp
add column
  fts tsvector generated always as (to_tsvector('english', description || ' ' || title || ' ' || postcode1 || ' '|| postcode2)) stored;

create index listings_fts_temp on uk_house_listings_temp using gin (fts); -- generate the index


CREATE TABLE uk_price_paid (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    price INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    postcode1 TEXT,
    postcode2 TEXT,
    type TEXT,
    is_new BOOLEAN NOT NULL,
    duration TEXT,
    addr1 TEXT NOT NULL,
    addr2 TEXT,
    street TEXT,
    locality TEXT,
    town TEXT,
    district TEXT,
    county TEXT
);

-- Indexes for optimizing queries
CREATE INDEX idx_uk_price_paid_postcode ON uk_price_paid (postcode1, postcode2, addr1, addr2);
