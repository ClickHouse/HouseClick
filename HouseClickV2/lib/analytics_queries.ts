
export const postgreSQLQueries: Record<string, Function> = {
    salesOverTime: (condition: string, column: string) => `SELECT
                        DATE_TRUNC('year', date) AS qtr,
                        COUNT(*) FILTER (WHERE ${condition})::INT AS filtered_count,
                        ROUND(COUNT(*)::NUMERIC / COUNT(DISTINCT ${column}))::INT AS count
                    FROM uk_price_paid
                    GROUP BY qtr
                    ORDER BY qtr ASC;`,
                    priceOverTime: (condition: string) => `SELECT
                    date_trunc('month', date) AS month,
                    round(avg(price) FILTER (WHERE ${condition})) AS filter_price,
                    round(avg(price)) AS avg
                FROM uk.uk_price_paid
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
            GROUP BY duration;`
}


export const clickHouseQueries: Record<string, Function> = {
    salesOverTime: (condition: string, column: string) => `SELECT
                    toStartOfYear(date) AS qtr,
                    toInt32(countIf(${condition})) AS filtered_count,
                    toInt32(round(count()/uniq(${column}))) AS count
                FROM uk_price_paid
                GROUP BY qtr
                ORDER BY qtr ASC`,
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
    soldByDuration: (condition: string) => `SELECT duration as name,count() as value FROM uk.uk_price_paid WHERE duration != 'unknown' AND  ${condition} GROUP BY duration`
}
