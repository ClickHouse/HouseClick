INSERT INTO uk.uk_price_paid_synthetic WITH data AS
    (
        SELECT
            round(dictGetOrDefault(uk.uk_avg_price_dictionary_year, 'avg_price', (postcode1, type, duration, is_new, CAST(toYear(date), 'UInt8')), dictGet(uk.uk_avg_price_dictionary, 'avg_price', (postcode1, type, duration, is_new)))) AS avg_price,
            dictGet(uk.uk_price_dictionary, 'date', floor(randUniform(1, 30033199))) AS date,
            dictGet(uk.uk_price_dictionary, 'postcode1', floor(randUniform(1, 30033199))) AS postcode1,
            dictGet(uk.uk_price_dictionary, 'postcode2', floor(randUniform(1, 30033199))) AS postcode2,
            dictGet(uk.uk_price_dictionary, 'type', floor(randUniform(1, 30033199))) AS type,
            dictGet(uk.uk_price_dictionary, 'is_new', floor(randUniform(1, 30033199))) AS is_new,
            dictGet(uk.uk_price_dictionary, 'duration', floor(randUniform(1, 30033199))) AS duration,
            dictGet(uk.uk_price_dictionary, 'addr1', floor(randUniform(1, 30033199))) AS addr1,
            dictGet(uk.uk_price_dictionary, 'addr2', floor(randUniform(1, 30033199))) AS addr2,
            dictGet(uk.uk_price_dictionary, 'street', floor(randUniform(1, 30033199))) AS street,
            dictGet(uk.uk_price_dictionary, 'locality', floor(randUniform(1, 30033199))) AS locality,
            dictGet(uk.uk_price_dictionary, 'town', floor(randUniform(1, 30033199))) AS town,
            dictGet(uk.uk_price_dictionary, 'district', floor(randUniform(1, 30033199))) AS district,
            dictGet(uk.uk_price_dictionary, 'county', floor(randUniform(1, 30033199))) AS county,
            dictGet(uk.uk_price_dictionary, 'category', floor(randUniform(1, 30033199))) AS category
        FROM numbers(100000000)
    )
SELECT
    floor(avg_price * randNormal(1, 0.2)) AS price,
    date,
    postcode1,
    postcode2,
    type,
    is_new,
    duration,
    addr1,
    addr2,
    street,
    locality,
    town,
    district,
    county,
    category
FROM data
