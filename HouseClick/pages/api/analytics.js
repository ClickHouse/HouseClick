import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@clickhouse/client'

const clickhouse = createClient({
    host: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER ?? 'default',
    password: process.env.CLICKHOUSE_PASSWORD ?? '',
})

const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY)

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

export default async function handler(req, res) {
    const {
        query: { type, filter },
        method,
      } = req;
    
    const filters = filter !== undefined ? filter.split(',').map(f => {
        let fp =  f.split(':')
        if (fp.length === 2 && fp[0] in filter_config) {
            return {
                column: filter_config[fp[0]].column,
                value: fp[1]
            }
        }
    }).filter(f => f !== undefined): []
    const condition = filtersToCondition(filters)
    const data = await Promise.all([
        soldByDuration_fdw(filters),
        // above call but clickhouse directly.
        //soldByDuration(condition)
        price_over_time(condition), 
        sales_over_time(condition, filters.length > 0 ? filters[0].column: 'postcode1'), 
        stats(condition),
        price_increases(condition),
        getRanks(condition),
        numberByType(condition, filters.length > 0 ? filters[0].column: 'postcode1'),
        priceByType(condition),
        sold_by_period(condition),
        salesByDay(condition)
    ])
    res.status(200).json({
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
    })
}

/**
 * Computes duration for the filtered area. Queries ClickHouse directly.
 */
async function soldByDuration(condition) {
    const results = await clickhouse.query({
        query: `SELECT duration as name,count() as value FROM uk_price_paid WHERE duration != 'unknown' AND  ${condition} GROUP BY duration`,
        format: 'JSONEachRow',
    })
    return await results.json()
}

/**
 * Example method which queries ClickHouse through Supabase. Computes duration for the filtered area.
 */
async function soldByDuration_fdw(filters) {
    const default_value = 'X'
    let query = supabase.from('sold_by_duration').select('name, value')
    for (let k in filter_config) {
        let filter = filters.filter(f => f.column == filter_config[k].column)
        query = filter.length > 0 ? query.eq(filter[0].column, filter[0].value): query.eq(filter_config[k].column, default_value)
    }
    const { error, data } = await query
    console.log(error)
    return data
}


function filtersToCondition(filters) {
    let condition = ''
    filters.forEach(filter => condition = `${condition} ${filter.column}='${filter.value}'`)
    return condition
}

async function salesByDay(condition) {
    const previous_year = await clickhouse.query({
        query: `SELECT
                toYear(date) AS year,
                toStartOfDay(date) AS day,
                count() AS c
            FROM uk_price_paid
            WHERE ${condition} AND (date > toStartOfYear(now() - toIntervalYear(1))) AND date < toStartOfYear(now())
            GROUP BY
                year,
                day
            ORDER BY
                year ASC WITH FILL,
                day ASC WITH FILL FROM toUnixTimestamp(CAST(toStartOfYear(now() - toIntervalYear(1)), 'DateTime')) TO toUnixTimestamp(CAST(toStartOfYear(now()), 'DateTime')) STEP toIntervalDay(1)`,
        format: 'JSONEachRow',
    })
    const pv_data = await previous_year.json()
    const this_year = await clickhouse.query({
        query: `SELECT
                toYear(date) AS year,
                toStartOfDay(date) AS day,
                count() AS c
            FROM uk_price_paid
            WHERE ${condition} AND date > toStartOfYear(now())
            GROUP BY
                year,
                day
            ORDER BY
                year ASC WITH FILL,
                day ASC WITH FILL FROM toUnixTimestamp(CAST(toStartOfYear(now()), 'DateTime')) TO toUnixTimestamp(CAST(toStartOfYear(now() + toIntervalYear(1)), 'DateTime')) STEP toIntervalDay(1)`,
        format: 'JSONEachRow',
    })
    const data = await this_year.json()


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

async function priceByType(condition) {
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
            FROM uk_price_paid
            GROUP BY type`,
        format: 'JSONEachRow',
    }

    const results = await clickhouse.query(qs)
    const data = await results.json()
    return {
        'all': data.map(type => {
            return {value: [type.min, type['25th'],type.median, type['75th'],type.max], name: type.type}
        }),
        'filtered': data.map(type => {
            return {value: [type.min_filtered, type['25th_filtered'],type.median_filtered, type['75th_filtered'],type.max_filtered], name: type.type}
        })
    }
}

async function sold_by_period(condition) {
    const results = await clickhouse.query({
        query: `SELECT toInt32(countIf(date >= now() - toIntervalMonth(6))) as \`6\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(12) AND date < now() - toIntervalMonth(6))) as \`12\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(18) AND date < now() - toIntervalMonth(12))) as \`18\`,
                    toInt32(countIf(date >= now() - toIntervalMonth(24) AND date < now() - toIntervalMonth(18))) as \`24\`
            FROM uk_price_paid WHERE ${condition}`,
        format: 'JSONEachRow',
    })
    const data = await results.json()
    return [{value: data[0]['6'], name: '6 months'},{value: data[0]['12'], name: '1 year'},{value: data[0]['18'], name: '18 months'}, {value: data[0]['24'], name: '2 years'}]
}

async function numberByType(condition, column) {
    const querys = {
        query: `SELECT
                type,
                toInt32(countIf(${condition})) AS filtered_count,
                round(count() / uniq(${column})) AS count
            FROM uk_price_paid
            GROUP BY type`,
        format: 'JSONEachRow',
    }
    const results = await clickhouse.query(querys)
    const data = await results.json()
    return data
}

async function getRanks(condition){
    const quantiles = [...Array(100).keys()].map(percentile => percentile/100).join(',')
    // use ntile
    const results = await clickhouse.query({
        query: `SELECT quantiles(${quantiles})(price) as quantiles, round(avgIf(price, ${condition})) AS filtered_avg, round(avg(price)) as avg FROM uk_price_paid WHERE date > (now() - toIntervalMonth(6))`,
        format: 'JSONEachRow',
    })
    const data = await results.json()
    const quantile = data[0].quantiles.findIndex(quantile => quantile > data[0].filtered_avg) - 1
    return {
        quantile: quantile,
        filtered_avg: data[0].filtered_avg,
        avg: data[0].avg,
    }
}

async function price_increases(condition) {
    const results = await clickhouse.query({
        query: `SELECT
                round(avgIf(price, ${condition})) as filter_avg,
                round(avg(price)) as avg,
                year
            FROM uk_price_paid
            GROUP BY toYear(date) AS year
            ORDER BY year ASC
            `,
        format: 'JSONEachRow',
    })
    const data = await results.json()
    const n = data[data.length-1].avg
    const r = data[data.length-1].filter_avg

    const years = [10, 5, 3, 1].filter(len => (data.length >= (len+1)) && data[data.length-(len+1)].filter_avg !== undefined)
    const increases = years.map(year => {
        let len = year + 1
        let national = data[data.length-len].avg
        let filter = data[data.length-len].filter_avg
        return {
            'year': year,
            'national': national > 0 ? Math.round((n - national)/national * 100): 0,
            'regional': filter > 0 ? Math.round((r - filter)/filter * 100): 0,
        }
    })
    return increases
}

async function stats(condition) {
    const results = await clickhouse.query({
        query: `SELECT
                avg(price) AS avg,
                median(price) AS median,
                quantile(0.95)(price) AS \`95th\`,
                quantile(0.99)(price) AS \`99th\`,
                count() as sold
            FROM uk_price_paid
            WHERE date > (now() - toIntervalMonth(6)) AND ${condition}`,
        format: 'JSONEachRow',
    })
    const data = await results.json()
    return data[0]
}

async function price_over_time(condition) {
    const results = await clickhouse.query({
        query: `SELECT
                toStartOfMonth(date) AS month,
                round(avgIf(price, ${condition})) AS filter_price,
                round(avg(price)) as avg
            FROM uk_price_paid
            GROUP BY month
            ORDER BY month ASC`,
        format: 'JSONEachRow',
    })
    const data = await results.json()
    return {
        x: data.map(row => row.month),
        price: data.map(row => row.avg),
        filtered_price: data.map(row => row.filter_price),
    }
}

async function sales_over_time(condition, column) {
    const results = await clickhouse.query({
        query: `SELECT
                    toStartOfYear(date) AS qtr,
                    toInt32(countIf(${condition})) AS filtered_count,
                    toInt32(round(count()/uniq(${column}))) AS count
                FROM uk_price_paid
                GROUP BY qtr
                ORDER BY qtr ASC`,
        format: 'JSONEachRow',
    })
    const data = await results.json()
    return {
        x: data.map(row => row.qtr),
        total: data.map(row => row.count),
        filtered_total: data.map(row => row.filtered_count)
    }
}
