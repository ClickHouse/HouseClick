
/* eslint-disable */
export const postgreSQLQueries: Record<string, Function> = {
    soldOverTime: (condition: string, column: string) => `SELECT
                        to_char(DATE_TRUNC('year', date), 'YYYY-MM-DD') AS year,
                        COUNT(*) FILTER (WHERE ${condition})::INT AS filtered_count,
                        ROUND(COUNT(*)::NUMERIC / COUNT(DISTINCT ${column}))::INT AS count
                    FROM uk_price_paid
                    GROUP BY year
                    ORDER BY year ASC;`,
    soldOverTimeNoFilter: () => `SELECT
                    to_char(DATE_TRUNC('year', date), 'YYYY-MM-DD') AS year,
                    ROUND(COUNT(*)::NUMERIC / COUNT(DISTINCT town))::INT AS count
                FROM uk_price_paid
                GROUP BY year
                ORDER BY year ASC;`,
    priceOverTime: (condition: string) => `SELECT
                    to_char(date_trunc('month', date), 'YYYY-MM-DD') AS month,
                    round(avg(price) FILTER (WHERE ${condition})) AS filter_price,
                    round(avg(price)) AS avg
                FROM uk_price_paid
                GROUP BY month
                ORDER BY month ASC;`,
    stats: (condition: string) => `SELECT
                    avg(price) AS avg,
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY price) AS median,
                    percentile_cont(0.95) WITHIN GROUP (ORDER BY price) AS "95th",
                    percentile_cont(0.99) WITHIN GROUP (ORDER BY price) AS "99th",
                    count(*) AS sold
                FROM uk_price_paid
                WHERE date > current_date - INTERVAL '6 months' AND ${condition};`,
    priceIncrease: (condition: string) => `SELECT
                    round(avg(price) FILTER (WHERE ${condition})) AS filter_avg,
                    round(avg(price)) AS avg,
                    EXTRACT(YEAR FROM date) AS year
                FROM uk_price_paid
                GROUP BY year
                ORDER BY year ASC;`,
    getRanks: (condition: string, quantiles: string) => `SELECT 
                percentile_cont(ARRAY[${quantiles}]) WITHIN GROUP (ORDER BY price) AS quantiles,
                round(avg(price) FILTER (WHERE ${condition})) AS filtered_avg,
                round(avg(price)) AS avg
            FROM uk_price_paid
            WHERE date > current_date - INTERVAL '6 months';`,
    numberByDuration: (condition: string) => `SELECT
                duration as name,
                count(*) FILTER (WHERE ${condition})::int AS value
            FROM uk_price_paid
            WHERE duration = 'freehold' OR duration = 'leasehold'
            GROUP BY duration;`,
    numberByType: (condition: string, column: string) => `SELECT
            type,
            count(*) FILTER (WHERE ${condition})::int AS filtered_count,
            round(count(*)::numeric / COUNT(DISTINCT ${column})) AS count
        FROM uk_price_paid
        GROUP BY type;`,
    soldByPeriod: (condition: string) => `SELECT 
                count(*) FILTER (WHERE date >= current_date - INTERVAL '6 months') AS "6",
                count(*) FILTER (WHERE date >= current_date - INTERVAL '12 months' AND date < current_date - INTERVAL '6 months') AS "12",
                count(*) FILTER (WHERE date >= current_date - INTERVAL '18 months' AND date < current_date - INTERVAL '12 months') AS "18",
                count(*) FILTER (WHERE date >= current_date - INTERVAL '24 months' AND date < current_date - INTERVAL '18 months') AS "24"
            FROM uk_price_paid
            WHERE ${condition};`,
    priceByType: (condition: string) => `SELECT
                type,
                round(min(price)) + 100 AS min,
                round(min(price) FILTER (WHERE ${condition})) AS min_filtered,
                round(max(price)) AS max,
                round(max(price) FILTER (WHERE ${condition})) AS max_filtered,
                round(percentile_cont(0.5) WITHIN GROUP (ORDER BY price)) AS median,
                round(percentile_cont(0.5) WITHIN GROUP (ORDER BY price) FILTER (WHERE ${condition})) AS median_filtered,
                round(percentile_cont(0.25) WITHIN GROUP (ORDER BY price)) AS "25th",
                round(percentile_cont(0.25) WITHIN GROUP (ORDER BY price) FILTER (WHERE ${condition})) AS "25th_filtered",
                round(percentile_cont(0.75) WITHIN GROUP (ORDER BY price)) AS "75th",
                round(percentile_cont(0.75) WITHIN GROUP (ORDER BY price) FILTER (WHERE ${condition})) AS "75th_filtered"
            FROM uk_price_paid
            GROUP BY type;`,
    salesByDayPreviousYear: (condition: string) => `SELECT
                EXTRACT(YEAR FROM date) AS year,
                date_trunc('day', date) AS day,
                count(*) AS c
            FROM uk_price_paid
            WHERE ${condition}
            AND date >= date_trunc('year', current_date) - INTERVAL '1 year'
            AND date < date_trunc('year', current_date)
            GROUP BY year, day
            ORDER BY year ASC, day ASC;`, 
    salesByDayCurrentYear: (condition: string) => `SELECT
                EXTRACT(YEAR FROM date) AS year,
                date_trunc('day', date) AS day,
                count(*) AS c
            FROM uk_price_paid
            WHERE ${condition}
            AND date >= date_trunc('year', current_date)
            GROUP BY year, day
            ORDER BY year ASC, day ASC;`,
    soldByDuration: (condition: string) => `SELECT
                duration AS name,
                count(*) AS value
            FROM uk_price_paid
            WHERE duration != 'unknown' AND ${condition}
            GROUP BY duration;`,
    soldByDurationNoFilter: (condition: string) => `SELECT
                duration AS name,
                count(*) AS value
            FROM uk_price_paid
            WHERE duration != 'unknown'
            GROUP BY duration;`,
    getMinMax: (condition: string) => `SELECT
            round(percentile_cont(0.01) WITHIN GROUP (ORDER BY price)) AS min_price,
            round(percentile_cont(0.99) WITHIN GROUP (ORDER BY price)) AS max_price
        FROM uk_price_paid
        WHERE date > (current_date - interval '18 months') AND ${condition}`,
    getPopularTowns: (district: string) => `SELECT 
    town, count(*) as popularity FROM uk_price_paid WHERE district = '${district}' GROUP BY district, town ORDER BY popularity DESC LIMIT 10`,
    getPopularDistricts: () => `SELECT 
    district, count(*) as popularity FROM uk_price_paid GROUP BY district ORDER BY popularity DESC LIMIT 10`,
    getPopularPostcodes: (town: string, district: string) => `SELECT 
    postcode1, count(*) as popularity FROM uk_price_paid WHERE town = '${town}' AND district = '${district}' AND postcode1 != '' GROUP BY district, town, postcode1 ORDER BY popularity DESC LIMIT 10`,
    getHouseSales: (condition: string) => `SELECT count(*) FILTER (WHERE ${condition})::int AS area_count, count(*) as national_count FROM uk_price_paid`,
}


export const clickHouseQueries: Record<string, Function> = {
    soldOverTime: (condition: string, column: string) => `SELECT
                    toStartOfYear(date) AS year,
                    toInt32(countIf(${condition})) AS filtered_count,
                    toInt32(round(count()/uniq(${column}))) AS count
                FROM uk.uk_price_paid
                GROUP BY year
                ORDER BY year ASC`,
    soldOverTimeNoFilter: () => `SELECT
                toStartOfYear(date) AS year,
                toInt32(round(count()/unique(town))) AS count
            FROM uk.uk_price_paid
            GROUP BY year
            ORDER BY year ASC`,
    priceOverTime: (condition: string) => `SELECT
                toStartOfMonth(date) AS month,
                round(avgIf(price, ${condition})) AS filter_price,
                round(avg(price)) as avg
            FROM uk.uk_price_paid
            GROUP BY month
            ORDER BY month ASC`,
    stats: (condition: string) => `SELECT
                avg(price) AS avg,
                median(price) AS median,
                quantile(0.95)(price) AS \`95th\`,
                quantile(0.99)(price) AS \`99th\`,
                count() as sold
            FROM uk.uk_price_paid
            WHERE date > (now() - toIntervalMonth(6)) AND ${condition}`,
    priceIncrease: (condition: string) => `SELECT
                round(avgIf(price, ${condition})) as filter_avg,
                round(avg(price)) as avg,
                year
            FROM uk.uk_price_paid
            GROUP BY toYear(date) AS year
            ORDER BY year ASC`,
    getRanks: (condition: string, quantiles: string) => `SELECT quantiles(${quantiles})(price) as quantiles, round(avgIf(price, ${condition})) AS filtered_avg, round(avg(price)) as avg FROM uk.uk_price_paid WHERE date > (now() - toIntervalMonth(6))`,
    numberByDuration: (condition: string) => `SELECT
                duration as name,
                toInt32(countIf(${condition})) AS value
            FROM uk.uk_price_paid
            WHERE duration = 'freehold' OR duration = 'leasehold'
            GROUP BY duration`,
    numberByType: (condition: string, column: string) => `SELECT
            type,
            toInt32(countIf(${condition})) AS filtered_count,
            round(count() / uniq(${column})) AS count
        FROM uk.uk_price_paid
        GROUP BY type`,
    soldByPeriod: (condition: string) => `SELECT toInt32(countIf(date >= now() - toIntervalMonth(6))) as \`6\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(12) AND date < now() - toIntervalMonth(6))) as \`12\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(18) AND date < now() - toIntervalMonth(12))) as \`18\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(24) AND date < now() - toIntervalMonth(18))) as \`24\`
            FROM uk.uk_price_paid WHERE ${condition}`,
    priceByType: (condition: string) => `SELECT
                type,
                round(min(price)) + 100 AS min,
                round(minIf(price, ${condition})) AS min_filtered,
                round(max(price)) AS max,
                round(maxIf(price, ${condition})) AS max_filtered,
                round(quantile(0.5)(price)) AS median,
                round(quantileIf(0.5)(price, ${condition})) AS median_filtered,
                round(quantile(0.25)(price)) AS 25th,
                round(quantileIf(0.25)(price, ${condition})) AS 25th_filtered,
                round(quantile(0.75)(price)) AS 75th,
                round(quantileIf(0.75)(price, ${condition})) AS 75th_filtered
            FROM uk.uk_price_paid
            GROUP BY type`,
    salesByDayPreviousYear: (condition: string) => `SELECT
                toYear(date) AS year,
                toStartOfDay(date) AS day,
                count() AS c
            FROM uk.uk_price_paid
            WHERE ${condition} AND (date > toStartOfYear(now() - toIntervalYear(1))) AND date < toStartOfYear(now())
            GROUP BY
                year,
                day
            ORDER BY
                year ASC WITH FILL,
                day ASC WITH FILL FROM toUnixTimestamp(CAST(toStartOfYear(now() - toIntervalYear(1)), 'DateTime')) TO toUnixTimestamp(CAST(toStartOfYear(now()), 'DateTime')) STEP toIntervalDay(1)`, 
    salesByDayCurrentYear: (condition: string) => `SELECT
                toYear(date) AS year,
                toStartOfDay(date) AS day,
                count() AS c
            FROM uk.uk_price_paid
            WHERE ${condition} AND date > toStartOfYear(now())
            GROUP BY
                year,
                day
            ORDER BY
                year ASC WITH FILL,
                day ASC WITH FILL FROM toUnixTimestamp(CAST(toStartOfYear(now()), 'DateTime')) TO toUnixTimestamp(CAST(toStartOfYear(now() + toIntervalYear(1)), 'DateTime')) STEP toIntervalDay(1)`,
    soldByDuration: (condition: string) => `SELECT duration as name,count() as value FROM uk.uk_price_paid WHERE duration != 'unknown' AND  ${condition} GROUP BY duration`,
    soldByDurationNoFilter: (condition: string) => `SELECT duration as name,count() as value FROM uk.uk_price_paid WHERE duration != 'unknown' GROUP BY duration`,
    getMinMax: (condition: string) => `SELECT
                round(quantile(0.01)(price)) AS \`min_price\`,
                round(quantile(0.99)(price)) AS \`max_price\`
            FROM uk.uk_price_paid
            WHERE date > (now() - toIntervalMonth(18)) AND ${condition}`,
    getPopularTowns: (district: string) => `SELECT 
    town, count() as popularity FROM uk.uk_price_paid WHERE district = '${district}' GROUP BY town ORDER BY popularity DESC LIMIT 10`,
    getPopularDistricts: () => `SELECT 
    district, count() as popularity FROM uk.uk_price_paid GROUP BY district ORDER BY popularity DESC LIMIT 10`,
    getPopularPostcodes: (town: string, district: string) => `SELECT 
    postcode1, count() as popularity FROM uk.uk_price_paid WHERE town = '${town}' AND district = '${district}' AND postcode1 != '' GROUP BY postcode1 ORDER BY popularity DESC LIMIT 10`,
    getPriceEvolution: (condition: string) => `SELECT
            toStartOfMonth(date) AS month,
            round(avgIf(price, ${condition})) AS filter_price,
            round(avg(price)) as avg
        FROM uk.uk_price_paid
        GROUP BY month
        ORDER BY month ASC`,
        getHouseSales: (condition: string) => `SELECT countIf(${condition}) as area_count, count() as national_count FROM uk.uk_price_paid`,
}

export const clickHouseQueriesLarge: Record<string, Function> = {
    soldOverTime: (condition: string, column: string) => `SELECT
                year,
                countMergeIf(count_state, ${condition}) AS filtered_count,
                round(countMerge(count_state)/uniq(${column})) AS count
                FROM houseclick.uk_price_paid_yearly_agg
                GROUP BY year
                ORDER BY year ASC`,
    soldOverTimeNoFilter: () => `SELECT
                toStartOfYear(date) AS year,
                toInt32(round(count()/unique(town))) AS count
            FROM uk.uk_price_paid_synthetic
            GROUP BY year
            ORDER BY year ASC`,
    priceOverTime: (condition: string) => `SELECT
                month,
                round(avgMergeIf(avg_price_state, ${condition})) AS filter_price,
                round(avgMerge(avg_price_state)) AS avg
            FROM houseclick.uk_price_paid_monthly_agg
            GROUP BY month
            ORDER BY month ASC`,
    stats: (condition: string) => `SELECT
                avg(price) AS avg,
                median(price) AS median,
                quantile(0.95)(price) AS \`95th\`,
                quantile(0.99)(price) AS \`99th\`,
                count() as sold
            FROM uk.uk_price_paid_synthetic
            WHERE date > (now() - toIntervalMonth(6)) AND ${condition}`,
    priceIncrease: (condition: string) => `SELECT
                round(avgMergeIf(avg_price_state, ${condition})) as filter_avg,
                round(avgMerge(avg_price_state)) as avg,
                year
                FROM houseclick.uk_price_paid_yearly_agg
            GROUP BY year
            ORDER BY year ASC`,
    getRanks: (condition: string, quantiles: string) => `SELECT quantiles(${quantiles})(price) as quantiles, round(avgIf(price, ${condition})) AS filtered_avg, round(avg(price)) as avg FROM uk.uk_price_paid_synthetic WHERE date > (now() - toIntervalMonth(6))`,
    numberByDuration: (condition: string) => `SELECT
                duration as name,
                toInt32(countIf(${condition})) AS value
            FROM uk.uk_price_paid_synthetic
            WHERE duration = 'freehold' OR duration = 'leasehold'
            GROUP BY duration`,
    numberByType: (condition: string, column: string) => `SELECT
                type,
                toInt32(countMergeIf(count_state, ${condition})) AS filtered_count,
                round(countMerge(count_state) / uniq(postcode1)) AS count
            FROM houseclick.uk_price_paid_type_agg
            GROUP BY type`,
    soldByPeriod: (condition: string) => `SELECT toInt32(countIf(date >= now() - toIntervalMonth(6))) as \`6\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(12) AND date < now() - toIntervalMonth(6))) as \`12\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(18) AND date < now() - toIntervalMonth(12))) as \`18\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(24) AND date < now() - toIntervalMonth(18))) as \`24\`
            FROM uk.uk_price_paid_synthetic WHERE ${condition}`,
    priceByType: (condition: string) => `SELECT
            type,
            round(minMerge(min_price_state)) + 100 AS min,
            round(minMergeIf(min_price_state, ${condition})) AS min_filtered,
            round(maxMerge(max_price_state)) AS max,
            round(maxMergeIf(max_price_state, ${condition})) AS max_filtered,
            round(quantileMerge(0.5)(quantile_price_state)) AS median,
            round(quantileMergeIf(0.5)(quantile_price_state, ${condition})) AS median_filtered,
            round(quantileMerge(0.25)(quantile_price_state)) AS 25th,
            round(quantileMergeIf(0.25)(quantile_price_state, ${condition})) AS 25th_filtered,
            round(quantileMerge(0.75)(quantile_price_state)) AS 75th,
            round(quantileMergeIf(0.75)(quantile_price_state, ${condition})) AS 75th_filtered
            FROM houseclick.uk_price_paid_type_agg
            GROUP BY type`,
    salesByDayPreviousYear: (condition: string) => `SELECT
                toYear(date) AS year,
                toStartOfDay(date) AS day,
                count() AS c
            FROM uk.uk_price_paid_synthetic
            WHERE ${condition} AND (date > toStartOfYear(now() - toIntervalYear(1))) AND date < toStartOfYear(now())
            GROUP BY
                year,
                day
            ORDER BY
                year ASC WITH FILL,
                day ASC WITH FILL FROM toUnixTimestamp(CAST(toStartOfYear(now() - toIntervalYear(1)), 'DateTime')) TO toUnixTimestamp(CAST(toStartOfYear(now()), 'DateTime')) STEP toIntervalDay(1)`, 
    salesByDayCurrentYear: (condition: string) => `SELECT
                toYear(date) AS year,
                toStartOfDay(date) AS day,
                count() AS c
            FROM uk.uk_price_paid_synthetic
            WHERE ${condition} AND date > toStartOfYear(now())
            GROUP BY
                year,
                day
            ORDER BY
                year ASC WITH FILL,
                day ASC WITH FILL FROM toUnixTimestamp(CAST(toStartOfYear(now()), 'DateTime')) TO toUnixTimestamp(CAST(toStartOfYear(now() + toIntervalYear(1)), 'DateTime')) STEP toIntervalDay(1)`,
    soldByDuration: (condition: string) => `SELECT duration as name,count() as value FROM uk.uk_price_paid_synthetic WHERE duration != 'unknown' AND  ${condition} GROUP BY duration`,
    soldByDurationNoFilter: (condition: string) => `SELECT duration as name,count() as value FROM uk.uk_price_paid_synthetic WHERE duration != 'unknown' GROUP BY duration`,
    getMinMax: (condition: string) => `SELECT
                round(quantile(0.01)(price)) AS \`min_price\`,
                round(quantile(0.99)(price)) AS \`max_price\`
            FROM uk.uk_price_paid_synthetic
            WHERE date > (now() - toIntervalMonth(18)) AND ${condition}`,
    getPopularTowns: (district: string) => `SELECT 
    town, count() as popularity FROM uk.uk_price_paid_synthetic WHERE district = '${district}' GROUP BY town ORDER BY popularity DESC LIMIT 10`,
    getPopularDistricts: () => `SELECT 
    district, count() as popularity FROM uk.uk_price_paid_synthetic GROUP BY district ORDER BY popularity DESC LIMIT 10`,
    getPopularPostcodes: (town: string, district: string) => `SELECT 
    postcode1, count() as popularity FROM uk.uk_price_paid_synthetic WHERE town = '${town}' AND district = '${district}' AND postcode1 != '' GROUP BY postcode1 ORDER BY popularity DESC LIMIT 10`,
    getPriceEvolution: (condition: string) => `SELECT
            toStartOfMonth(date) AS month,
            round(avgIf(price, ${condition})) AS filter_price,
            round(avg(price)) as avg
        FROM uk.uk_price_paid_synthetic
        GROUP BY month
        ORDER BY month ASC`,
    getHouseSales: (condition: string) => `SELECT countIf(${condition}) as area_count, count() as national_count FROM uk.uk_price_paid_synthetic`,
}
