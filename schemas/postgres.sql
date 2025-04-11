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
   title text,
   description text,
   urls Text[],
   sold boolean,
   sold_date Date,
   features text
)


alter table
  uk_house_listings
add column
  fts tsvector generated always as (to_tsvector('english', description || ' ' || title || ' ' || postcode1 || ' '|| postcode2)) stored;

create index listings_fts on uk_house_listings using gin (fts); -- generate the index


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
