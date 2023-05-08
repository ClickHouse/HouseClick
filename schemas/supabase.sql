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

--clickhouse wrapper
create extension if not exists wrappers;


create foreign data wrapper clickhouse_wrapper
handler click_house_fdw_handler
validator click_house_fdw_validator;


create server clickhouse_server
foreign data wrapper clickhouse_wrapper
options (
conn_string 'tcp://default:<password>@<host>:9440/default?connection_timeout=30s&ping_before_query=false&secure=true'
);

create foreign table sold_by_duration (
  name text,
  value bigint,
  postcode1 text, -- parameter column, used for input parameter,
  district text,
  town text
)
server clickhouse_server
  options (
    table '(select * from sold_by_duration(_postcode=${postcode1},_district=${district}, _town=${town}))',
    rowid_column 'duration'
);

select name, value from sold_by_duration where postcode1='SA7' AND district='X' AND town='X';


SELECT * FROM uk_house_listings LIMIT 10

-- read only user

CREATE ROLE readaccess;

-- Grant access to existing tables
GRANT USAGE ON SCHEMA public TO readaccess;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readaccess;

-- Grant access to future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readaccess;


-- Create a final user with password
CREATE USER migration WITH PASSWORD 'clickhouse';
GRANT readaccess TO migration;

