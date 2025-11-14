BEGIN;

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

CREATE EXTENSION clickhouse_fdw;

-- Override default values from the environment.
\set ch_host sql-clickhouse.clickhouse.com
\getenv ch_host CLICKHOUSE_HOST
\set ch_port 9440
\getenv ch_port CLICKHOUSE_PORT
\set ch_db uk
\getenv ch_db CLICKHOUSE_DATABASE
\set ch_user demo
\getenv ch_user CLICKHOUSE_USER
\set ch_pass
\getenv ch_pass CLICKHOUSE_PASSWORD

CREATE SERVER playground_svr FOREIGN DATA WRAPPER clickhouse_fdw
    OPTIONS(driver 'binary', dbname :'ch_db', host :'ch_host', port :'ch_port');
CREATE USER MAPPING FOR CURRENT_USER SERVER playground_svr OPTIONS (user :'ch_user', password :'ch_pass');

CREATE SCHEMA uk;
IMPORT FOREIGN SCHEMA uk FROM SERVER playground_svr INTO uk;

CREATE SCHEMA houseclick;
IMPORT FOREIGN SCHEMA houseclick FROM SERVER playground_svr INTO houseclick;

COMMIT;
