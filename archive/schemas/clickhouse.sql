CREATE TABLE uk_price_paid
(
    `id` String MATERIALIZED toString(generateUUIDv4()),
    `price` UInt32,
    `date` DateTime,
    `postcode1` LowCardinality(String),
    `postcode2` LowCardinality(String),
    `type` LowCardinality(String),
    `is_new` UInt8,
    `duration` LowCardinality(String),
    `addr1` String,
    `addr2` String,
    `street` LowCardinality(String),
    `locality` LowCardinality(String),
    `town` LowCardinality(String),
    `district` LowCardinality(String),
    `county` LowCardinality(String)
)
ENGINE = MergeTree
ORDER BY (postcode1, postcode2, addr1, addr2)


CREATE VIEW default.sold_by_duration AS
SELECT
    duration AS name,
    count() AS value
FROM default.uk_price_paid
WHERE (duration != 'unknown') AND ((postcode1 = {_postcode:String}) OR (district = {_district:String}) OR (town = {_town:String}))
GROUP BY duration
