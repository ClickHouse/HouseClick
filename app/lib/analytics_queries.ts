
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

