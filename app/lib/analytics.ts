import { createClient, DataFormat } from '@clickhouse/client'
import { Pool } from 'pg';
import { AnalyticFilter } from "@/lib/types";
import { postgreSQLQueries, postgresFDWQueriesLarge, clickHouseQueries, clickHouseQueriesLarge } from "@/lib/analytics_queries";
import { getDbSelection, getDatasetSelection } from './db-context'

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

export async function getMinMax({ postcode1 }: { postcode1: string }) {
    const query = getQuery('getMinMax')
    const condition = `postcode1='${postcode1}'`
    const data = await runQuery('getMinMax', query(condition))
    return data;
}

export async function getPopularTowns(district: string) {
    const query = getQuery('getPopularTowns')
    const data = await runQuery('getPopularTowns', query(district))
    return data;
}

export async function getPopularDistricts() {
    console.log('getPopularDistricts')
    const query = getQuery('getPopularDistricts')
    const data = await runQuery('getPopularDistricts', query())
    return data;
}

export async function getPopularPostcodes(town: string, district: string) {
    const query = getQuery('getPopularPostcodes')
    const data = await runQuery('getPopularPostcodes', query(town, district))
    return data;
}

function buildCondition(town: string, district: string, postcode: string) {
    let conditions = [];
    if (town != 'All') {
        conditions.push(`town='${town}'`);
    }
    if (district != 'All') {
        conditions.push(`district='${district}'`);
    }
    if (postcode != 'All') {
        conditions.push(`postcode1='${postcode}'`);
    }
    return conditions.join(' AND ');
}

export async function getHouseSalesComparison({ town, district, postcode }: { town: string, district: string, postcode: string }) {
    const query = getQuery('getHouseSales');
    const condition = buildCondition(town, district, postcode);
    const data = await runQuery('getHouseSales', query(condition))
    return data;
}

export async function getPriceEvolution({ town, district, postcode }: { town: string, district: string, postcode: string }) {
    const query = getQuery('priceOverTime');

    const condition = buildCondition(town, district, postcode);
    const data = await runQuery('priceOverTime', query(condition))
    return data;
}

export async function getTransactionsByOwnership({ town, district, postcode }: { town: string, district: string, postcode: string }) {
    const condition = buildCondition(town, district, postcode);
    let query = getQuery('soldByDuration');
    if (condition === '') {
        query = getQuery('soldByDurationNoFilter');
    }
    const data = await runQuery('soldByDuration', query(condition))
    return data;
}

export async function getSoldByType({ town, district, postcode }: { town: string, district: string, postcode: string }) {

    let conditions = [];
    let column = null
    let queryName = 'numberByType'
    if (town != 'All') {
        column = 'town'
        conditions.push(`town='${town}'`);
    }
    if (district != 'All') {
        column = 'district'
        conditions.push(`district='${district}'`);
    }
    if (postcode != 'All') {
        column = 'postcode1'
        conditions.push(`postcode1='${postcode}'`);
    }
    const query = getQuery(queryName);
    let condition = conditions.join(' AND ');
    const queryString = column ? query(condition, column) : query()
    const data = await runQuery('numberByType', queryString)
    return data;
}

export async function getPriceIncrease({ town, district, postcode }: { town: string, district: string, postcode: string }) {
    const query = getQuery('priceIncrease');
    const condition = buildCondition(town, district, postcode);
    const queryResults = await runQuery('priceIncrease', query(condition))

    const data = queryResults.data
    const n = data[data.length - 1].avg
    const r = data[data.length - 1].filter_avg
    const years = [10, 5, 3, 1].filter(len => (data.length >= (len + 1)) && data[data.length - (len + 1)].filter_avg !== undefined)
    const increases = years.map(year => {
        const len = year + 1
        const national = data[data.length - len].avg
        const filter = data[data.length - len].filter_avg
        return {
            'year': year,
            'national': national > 0 ? Math.round((n - national) / national * 100) : 0,
            'regional': filter > 0 ? Math.round((r - filter) / filter * 100) : 0,
        }
    })
    const results = {data: increases, metadata: queryResults.metadata}
    return results;
}

export async function getPriceByType( { town, district, postcode }: { town: string, district: string, postcode: string }) {
    const query = getQuery('priceByType')
    const condition = buildCondition(town, district, postcode);
    const queryResults = await runQuery('priceByType', query(condition))

    const data = {
        all: queryResults.data.map((type: any) => ({
            value: [type.min, type['25th'], type.median, type['75th'], type.max],
            name: type.type,
        })),
        filtered: queryResults.data.map((type: any) => ({
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
    const results = {data: data, metadata: queryResults.metadata}
    return results
}


export async function getHouseSoldOverTime({ town, district, postcode }: { town: string, district: string, postcode: string }) {

    let conditions = [];
    let column = null
    let queryName = 'soldOverTimeNoFilter'
    if (town != 'All') {
        queryName = 'soldOverTime'
        column = 'town'
        conditions.push(`town='${town}'`);
    }
    if (district != 'All') {
        queryName = 'soldOverTime'
        column = 'district'
        conditions.push(`district='${district}'`);
    }
    if (postcode != 'All') {
        queryName = 'soldOverTime'
        column = 'postcode1'
        conditions.push(`postcode1='${postcode}'`);
    }
    const query = getQuery(queryName);
    let condition = conditions.join(' AND ');
    const queryString = column ? query(condition, column) : query()
    const data = await runQuery('soldOverTime', queryString)
    return data;
}

async function runQuery(name: string, query: string) {
    const database = getDbSelection()
    const dataset = getDatasetSelection()
    const start_time = performance.now();
    let queryString = query

    // Create a promise that will reject after the timeout period
    const timeout = (ms: number) => {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Query execution timed out after ${ms/1000} seconds`)), ms);
        });
    };

    // Create the actual query promise
    const executeQuery = async () => {
        let rawResults: Record<string, any>[];
        if (database === 'clickhouse') {
            // queryString = dataset === 'large' ? query.replace('uk.uk_price_paid', 'uk.uk_price_paid_synthetic') : query
            const results = await clickhouse.query({
                query: queryString,
                format: 'JSONEachRow',
                clickhouse_settings: {'enable_parallel_replicas': 1, 'use_query_condition_cache': 1}
            })
            rawResults = await results.json();
        } else if (database === 'postgres' || database === 'fdw') {
            const schema = database === 'fdw' ? 'uk' : 'public'
            queryString = queryString.replace(/FROM\s+uk/, `FROM ${schema}.uk`)
            try {
                const result = await pool.query(queryString);
                rawResults = result.rows;
            } catch (error) {
                throw error;
            }
        } else {
            throw new Error('Unsupported database type')
        }
        return rawResults;
    };

    let rawResults: Record<string, any>[];
    try {
        // Race the query execution against the timeout
        rawResults = await Promise.race([
            executeQuery(),
            timeout(40000) // 60 seconds timeout
        ]) as Record<string, any>[];
    } catch (error) {
        // Handle timeout or other errors
        console.error(`Error executing query "${name}":`, error.message);
        throw error;
    }

    const endTime = performance.now();
    const elapsedTime = endTime - start_time;
    console.log(`Database: ${database} query: ${name} Execution time: ${elapsedTime} ms`)
    const metadata = {query: name, elapsedTime: elapsedTime, queryString: queryString}
    const results = {data: rawResults, metadata: metadata}
    return results;
}

function getQuery(queryName: string) {
    const database = getDbSelection()
    const dataset = getDatasetSelection()
    if (database === 'clickhouse') {
        if (dataset === 'large') {
            const query = clickHouseQueriesLarge[queryName]
            return query;
        } else {
            const query = clickHouseQueries[queryName]
            return query;
        }
    } else if (database === 'postgres') {
        const query = postgreSQLQueries[queryName]
        return query;
    } else if (database === 'fdw') {
        if (dataset === 'large') {
            const query = postgresFDWQueriesLarge[queryName]
            return query;
        } else {
            const query = postgreSQLQueries[queryName]
            return query;
        }
    } else {
        throw new Error('Unsupported database type')
    }
}
/**
 * Computes duration for the filtered area. Queries ClickHouse directly.
 */
async function soldByDuration(condition: string) {
    const query = getQuery('soldByDuration')
    return await runQuery('soldByDuration', query(condition))
}

function filtersToCondition(filters: FilterConfig[]) {
    let condition = ''
    filters.forEach(filter => condition = `${condition} ${filter.column}='${filter.value}'`)
    return condition
}




async function sold_by_period(condition: string) {
    const query = getQuery('soldByPeriod')
    const data = await runQuery('soldByPeriod', query(condition))
    return [{ value: data[0]['6'], name: '6 months' }, { value: data[0]['12'], name: '1 year' }, { value: data[0]['18'], name: '18 months' }, { value: data[0]['24'], name: '2 years' }]
}

async function numberByType(condition: string, column: string) {
    const query = getQuery('numberByType')
    const data = await runQuery('numberByType', query(condition, column))
    return data
}

async function getRanks(condition: string) {
    const query = getQuery('getRanks')
    const quantiles = [...Array(100).keys()].map(percentile => percentile / 100).join(',')
    const data = await runQuery('getRanks', query(condition, quantiles))
    const quantile = data[0].quantiles.findIndex((quantile: number) => quantile > data[0].filtered_avg) - 1
    return {
        quantile: quantile,
        filtered_avg: data[0].filtered_avg,
        avg: data[0].avg,
    }
}
