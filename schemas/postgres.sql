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
);

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
