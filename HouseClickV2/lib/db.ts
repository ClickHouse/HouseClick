import { Pool, QueryResult, QueryResultRow } from 'pg';
import { Listing, SearchFilter, SearchParams } from './types';

interface ListingRow {
  id: number;
  date: Date;
  addr1: string;
  addr2: string | null;
  street: string;
  locality: string | null;
  town: string;
  district: string;
  county: string;
  postcode1: string;
  postcode2: string;
  type: string;
  duration: string;
  is_new: number;
  price: number;
  rooms: number;
  title: string;
  description: string;
  urls: string[];
  sold: boolean;
  sold_date: string | null;
  features: string;
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
});

function convertRowToListing(row: ListingRow): Listing {
  return {
    ...row,
    title: row.title.replaceAll('"',''),
    price: `£${row.price.toLocaleString('en-US')}`,
    date: row.date.toISOString().split('T')[0],
    images: row.urls.map((url, i) => ({ id: i, name: '', src: url, alt: '' })),
    details: [{ name: 'Features', items: row.features?.split('\n') }],
  }
}

// Function to execute SQL queries
export async function executeQuery<T extends QueryResultRow, U = T>(
  query: string,
  params: any[] = [],
  mapRow?: (row: T) => U
): Promise<U[]> {
  const client = await pool.connect();
  try {
    const result: QueryResult<T> = await client.query(query, params);
    return mapRow ? result.rows.map(mapRow) : (result.rows as unknown as U[]);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Get default listings (most recent non-sold listings)
export async function getDefaultListings(limit: number = 12): Promise<Listing[]> {
  const query = `
    SELECT * FROM uk_house_listings 
    WHERE sold = false
    ORDER BY date DESC 
    LIMIT $1
  `;
  return executeQuery<ListingRow, Listing>(query, [limit], (row) => (convertRowToListing(row)));
}


function applyFilters(filters: SearchFilter[], startIndex: number) {
  let conditions: string[] = [];
  let values: any[] = [];
  let index = startIndex;

  filters.forEach(filter => {
    const id = filter.id;
    const type = filter.type;

    if (filter.type === 'check') {
      const checked = filter.options?.filter(option => option.checked);
      const eqValues = checked?.filter(option => option.operator === 'eq').map(option => option.value);
      if (eqValues && eqValues.length > 0) {
        conditions.push(`${id} = ANY($${index})`);
        values.push(eqValues);
        index++;
      }
    } else if (type === 'range') {
      const ranges = filter.values;
      if (ranges && ranges[0] !== filter.min || ranges && ranges[1] !== filter.max) {
        conditions.push(`${id} BETWEEN $${index} AND $${index + 1}`);
        values.push(ranges[0], ranges[1]);
        index += 2;
      }
    }
  });
  return { conditionString: conditions.join(' AND '), filterValues: values };
}

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;
  return { from, to };
}

export async function search(query: SearchParams) {
  const { from, to } = getPagination(query.page - 1, 9);
  let baseQuery = `SELECT id, type, price, town, district, postcode1, postcode2, duration, date, urls, description, title, rooms, sold FROM uk_house_listings`;
  let conditions = [];
  let values = [];
  if (query.searchTerm !== '') {
    conditions.push(`to_tsvector(title || ' ' || description) @@ to_tsquery($1)`);
    values.push(query.searchTerm?.split(/\s+/).join(' | '));
  }
  const { conditionString, filterValues } = applyFilters(query.filters, values.length + 1);
  if (conditionString) {
    conditions.push(conditionString);
    values = values.concat(filterValues);
  }
  if (conditions.length > 0) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
  }
  baseQuery += ` ORDER BY ${query.sort.column} ${query.sort.ascending ? 'ASC' : 'DESC'} LIMIT 9 OFFSET ${from}`;
  // return executeQuery<Listing>(baseQuery, values);
  console.log(baseQuery, values)
  return executeQuery<ListingRow, Listing>(baseQuery, values, (row) => (convertRowToListing(row)));
}


export async function getListing(id: string): Promise<Listing | null> {
  const query = `SELECT * FROM uk_house_listings WHERE id = $1`;
  const results = await executeQuery<ListingRow, Listing>(query, [id], (row) => (convertRowToListing(row)));
  return results.length > 0 ? results[0] : null;
}

export async function getNewListings() {
  const query = `SELECT * FROM uk_house_listings ORDER BY date DESC LIMIT 4`;
  return executeQuery<ListingRow, Listing>(query, [], (row) => (convertRowToListing(row)));
}

export async function getAllListings() {
  const query = `SELECT id FROM uk_house_listings`;
  const rows = await executeQuery<{ id: string }>(query);
  return rows.map(listing => ({ params: { id: `${listing.id}` } }));
}
