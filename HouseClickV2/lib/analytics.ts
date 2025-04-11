import { createClient, DataFormat } from '@clickhouse/client'
import { Pool } from 'pg';
import { AnalyticFilter } from "@/lib/types";
import { postgreSQLQueries, clickHouseQueries } from "@/lib/analytics_queries";

const clickhouse = createClient({
    host: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER ?? 'default',
    password: process.env.CLICKHOUSE_PASSWORD ?? '',
})

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE,
});

interface FilterConfig {
    column: string;
    value: string;
}


const filter_config = {
    'postcode': {
        column: 'postcode1'
    },
    'town': {
        column: 'town'
    },
    'district': {
        column: 'district'
    },
}

export async function getAnalytics(filter: AnalyticFilter) {

    const filters = filter.id in filter_config ? [{ column: filter_config[filter.id as keyof typeof filter_config].column, value: filter.value }] : []

    const condition = filtersToCondition(filters);

    const data = await Promise.all([
        soldByDuration(condition),
        price_over_time(condition),
        sales_over_time(condition, filters.length > 0 ? filters[0].column : 'postcode1'),
        stats(condition),
        price_increases(condition),
        getRanks(condition),
        numberByType(condition, filters.length > 0 ? filters[0].column : 'postcode1'),
        priceByType(condition),
        sold_by_period(condition),
        salesByDay(condition)
    ]);

    return {
        sold_by_duration: data[0],
        price_over_time: data[1],
        sales_over_time: data[2],
        stats: data[3],
        price_change: data[4],
        ranks: data[5],
        sales_by_type: data[6],
        price_by_type: data[7],
        sold_by_period: data[8],
        sales_by_day: data[9],
    };
}

async function runQuery(query: string) {
    let rawResults: Record<string, any>[];
    if (process.env.ANALYTICAL_DATABASE === 'clickhouse') {
        const results = await clickhouse.query({
            query: query,
            format: 'JSONEachRow',
        })
        rawResults = await results.json();
    } else if (process.env.ANALYTICAL_DATABASE === 'postgres') {
        try {
            const result = await pool.query(query);
            rawResults = result.rows;
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error('Unsupported database type')
    }
    return rawResults;
}

function getQuery(queryName: string) {
    console.log(process.env.ANALYTICAL_DATABASE)
    if (process.env.ANALYTICAL_DATABASE === 'clickhouse') {
        const query = clickHouseQueries[queryName]
        return query;
    } else if (process.env.ANALYTICAL_DATABASE === 'postgres') {
        const query = postgreSQLQueries[queryName]
        return query;
    } else {
        throw new Error('Unsupported database type')
    }
}
/**
 * Computes duration for the filtered area. Queries ClickHouse directly.
 */
async function soldByDuration(condition: string) {
    const results = await clickhouse.query({
        query: `SELECT duration as name,count() as value FROM uk.uk_price_paid WHERE duration != 'unknown' AND  ${condition} GROUP BY duration`,
        format: 'JSONEachRow',
    })
    return await results.json()
}

function filtersToCondition(filters: FilterConfig[]) {
    let condition = ''
    filters.forEach(filter => condition = `${condition} ${filter.column}='${filter.value}'`)
    return condition
}

async function salesByDay(condition: string) {
    const previous_year = await clickhouse.query({
        query: `SELECT
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
        format: 'JSONEachRow',
    })
    const pv_data = await previous_year.json() as Record<string, any>[]
    const this_year = await clickhouse.query({
        query: `SELECT
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
        format: 'JSONEachRow',
    })
    const data = await this_year.json() as Record<string, any>[]
    return [
        {
            year: pv_data[0].year,
            values: pv_data.map(day => {
                return [day.day.substring(0, 10), parseInt(day.c)]
            })
        },
        {
            year: data[0].year,
            values: data.map(day => {
                return [day.day.substring(0, 10), parseInt(day.c)]
            })
        }
    ]
}

async function priceByType(condition: string) {
    const qs = {
        query: `SELECT
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
        format: 'JSONEachRow' as DataFormat,
    }

    const results = await clickhouse.query(qs)
    const data = await results.json() as Record<string, any>[]
    return {
        all: data.map((type: any) => ({
            value: [type.min, type['25th'], type.median, type['75th'], type.max],
            name: type.type,
        })),
        filtered: data.map((type: any) => ({
            value: [
                type.min_filtered,
                type['25th_filtered'],
                type.median_filtered,
                type['75th_filtered'],
                type.max_filtered,
            ],
            name: type.type,
        })),
    }
}

async function sold_by_period(condition: string) {
    const results = await clickhouse.query({
        query: `SELECT toInt32(countIf(date >= now() - toIntervalMonth(6))) as \`6\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(12) AND date < now() - toIntervalMonth(6))) as \`12\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(18) AND date < now() - toIntervalMonth(12))) as \`18\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(24) AND date < now() - toIntervalMonth(18))) as \`24\`
            FROM uk.uk_price_paid WHERE ${condition}`,
        format: 'JSONEachRow' as DataFormat,
    })
    const data = await results.json() as Record<string, any>[]
    return [{ value: data[0]['6'], name: '6 months' }, { value: data[0]['12'], name: '1 year' }, { value: data[0]['18'], name: '18 months' }, { value: data[0]['24'], name: '2 years' }]
}

async function numberByType(condition: string, column: string) {
    const querys = {
        query: `SELECT
                type,
                toInt32(countIf(${condition})) AS filtered_count,
                round(count() / uniq(${column})) AS count
            FROM uk.uk_price_paid
            GROUP BY type`,
        format: 'JSONEachRow' as DataFormat,
    }
    const results = await clickhouse.query(querys)
    const data = await results.json()
    return data
}

async function getRanks(condition: string) {
    const quantiles = [...Array(100).keys()].map(percentile => percentile / 100).join(',')
    // use ntile
    const results = await clickhouse.query({
        query: `SELECT quantiles(${quantiles})(price) as quantiles, round(avgIf(price, ${condition})) AS filtered_avg, round(avg(price)) as avg FROM uk.uk_price_paid WHERE date > (now() - toIntervalMonth(6))`,
        format: 'JSONEachRow' as DataFormat,
    })
    const data = await results.json() as Record<string, any>[]
    const quantile = data[0].quantiles.findIndex((quantile: number) => quantile > data[0].filtered_avg) - 1
    return {
        quantile: quantile,
        filtered_avg: data[0].filtered_avg,
        avg: data[0].avg,
    }
}

async function price_increases(condition: string) {
    const results = await clickhouse.query({
        query: `SELECT
                round(avgIf(price, ${condition})) as filter_avg,
                round(avg(price)) as avg,
                year
            FROM uk.uk_price_paid
            GROUP BY toYear(date) AS year
            ORDER BY year ASC
            `,
        format: 'JSONEachRow' as DataFormat,
    })
    const data = await results.json() as Record<string, any>[]
    const n = data[data.length - 1].avg
    const r = data[data.length - 1].filter_avg

    const years = [10, 5, 3, 1].filter(len => (data.length >= (len + 1)) && data[data.length - (len + 1)].filter_avg !== undefined)
    const increases = years.map(year => {
        let len = year + 1
        let national = data[data.length - len].avg
        let filter = data[data.length - len].filter_avg
        return {
            'year': year,
            'national': national > 0 ? Math.round((n - national) / national * 100) : 0,
            'regional': filter > 0 ? Math.round((r - filter) / filter * 100) : 0,
        }
    })
    return increases
}

async function stats(condition: string) {
    const results = await clickhouse.query({
        query: `SELECT
                avg(price) AS avg,
                median(price) AS median,
                quantile(0.95)(price) AS \`95th\`,
                quantile(0.99)(price) AS \`99th\`,
                count() as sold
            FROM uk.uk_price_paid
            WHERE date > (now() - toIntervalMonth(6)) AND ${condition}`,
        format: 'JSONEachRow' as DataFormat,
    })
    const data = await results.json() as Record<string, any>[]
    return data[0]
}

async function price_over_time(condition: string) {
    const results = await clickhouse.query({
        query: `SELECT
                toStartOfMonth(date) AS month,
                round(avgIf(price, ${condition})) AS filter_price,
                round(avg(price)) as avg
            FROM uk.uk_price_paid
            GROUP BY month
            ORDER BY month ASC`,
        format: 'JSONEachRow',
    })
    const data = await results.json() as Record<string, any>[]
    return {
        x: data.map(row => row.month),
        price: data.map(row => row.avg),
        filtered_price: data.map(row => row.filter_price),
    }
}

async function sales_over_time(condition: string, column: string) {
    const query = getQuery('salesOverTime')
    const data = await runQuery(query(condition, column))
    // const results = await clickhouse.query({
    //     query: `SELECT
    //                 toStartOfYear(date) AS qtr,
    //                 toInt32(countIf(${condition})) AS filtered_count,
    //                 toInt32(round(count()/uniq(${column}))) AS count
    //             FROM uk.uk_price_paid
    //             GROUP BY qtr
    //             ORDER BY qtr ASC`,
    //     format: 'JSONEachRow',
    // })
    // const data = await results.json() as Record<string, any>[]
    return {
        x: data.map(row => row.qtr),
        total: data.map(row => row.count),
        filtered_total: data.map(row => row.filtered_count)
    }
}
