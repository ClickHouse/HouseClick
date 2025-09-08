import { createClient } from '@supabase/supabase-js'


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY)


const table = 'uk_house_listings'

export const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size : size;
    return { from, to };
}

//TODO: maybe make this an api route
export async function search(query) {
    const { from, to } = getPagination(query.page -1 , 9);
    let results_query = applyFilters(supabase.from(table).select('id,type,price,town,district,postcode1,postcode2,duration,date,urls,description,title,rooms,sold', {count: 'exact'}), query.filters)
    if (query.searchTerm != '') {
        const query_term = query.searchTerm.split(/\s+/).join(' | ')
        results_query = results_query.textSearch('fts', query.searchTerm)
    }
    results_query = results_query.range(from, to)

    const { error, data, count } = await results_query.order(query.sort.column, {ascending: query.sort.ascending}).limit(9)
    if (error !== null) {
        return []
    }

    return {
        count: count,
        results: data.map(listing => {
            return {
                id: listing.id,
                name: listing.title.replaceAll('"',''),
                description: listing.description,
                price: `£${listing.price.toLocaleString('en-US')}`,
                href: `/listings/listing/${listing.id}`,
                imageAlt: listing.title,
                imageSrc: listing.urls[0],
                postcode: `${listing.postcode1} ${listing.postcode2}`,
                duration: listing.duration,
                date: listing.date,
                sold: listing.sold,
                rooms: listing.rooms,
            }
        })
    }
}

function applyFilters(query, filters) {
    filters.map(filter => {
        const id = filter.get('id')
        const type = filter.get('type')
        if (type === 'check') {
            const checked = filter.get('options').filter(option => option.get('checked'))
            const eqValues = checked.filter(option => option.get('operator') === 'eq').map(option => option.get('value')).toJS()
            let orFilter = ''
            if (eqValues.length > 0) {
                orFilter = `${id}.in.(${eqValues.join(',')})`
            }
            const gt = checked.filter(option => option.get('operator') === 'gt').map(option => option.get('value')).toJS()
            gt.forEach(value => {
                if (orFilter !== ''){
                    orFilter = `${orFilter},${id}.gt.${value}`
                } else {
                    orFilter = `${id}.gt.${value}`
                }
            })
            if (orFilter != '') {
                query = query.or(orFilter)
            }
        } else if (type === 'range') {
            const ranges = filter.get('values').toJS()
            if (ranges[0] !== filter.get('min') || ranges[1] !== filter.get('max')) {
                query = query.gte(id, ranges[0]).lte(id, ranges[1])
            }
        }
    })
    return query
}


export async function getListing(id) {

    const { data, error } = await supabase.from(table).select('id,type,price,town,features,locality,duration,district,county,postcode1,postcode2,duration,urls,description,title,rooms,date,sold').eq('id', id)
    if (data.length === 1) {
        const listing = data[0]
        return {
            id: id,
            name: listing.title.replaceAll('"',''),
            price: `£${listing.price.toLocaleString('en-US')}`,
            sold: listing.sold,
            date: listing.date,
            rooms: listing.rooms,
            postcode1: listing.postcode1,
            postcode2: listing.postcode2,
            town: listing.town,
            district: listing.district,
            locality: listing.locality,
            county: listing.county,
            duration: listing.duration,
            images: listing.urls.map((url,i) => {
                return {
                    id: i,
                    name: '',
                    src: url,
                    alt: ''
                }
            }),
            description: listing.description,
            details: [
                {
                  name: 'Features',
                  items: listing.features.split('\n'),
                },
            ],
        }
    }
    return {}
}

export async function getNewListings() {

    const { data, error } = await supabase.from(table).select('id,type,price,town,district,postcode1,postcode2,duration,urls,description,title,rooms,sold,date').order('date', {ascending: false}).limit(4)
    if (error !== null) {
        return []
    }
    return data.map(listing => {
        return {
            id: listing.id,
            name: listing.title.replaceAll('"',''),
            description: listing.description,
            price: `£${listing.price.toLocaleString('en-US')}`,
            href: `/listings/listing/${listing.id}`,
            imageAlt: listing.title,
            imageSrc: listing.urls[0],
            postCode: `${listing.postcode1} ${listing.postcode2}`,
            duration: listing.duration,
            date: listing.date,
            sold: listing.sold,
            rooms: listing.rooms,
        }
    })
}

export async function getAllListings() {
    const {data, error } = await supabase.from(table).select('id')
    if (error !== null) {
        return []
    }

    return data.map(listing => {
        return {
            params: {
                id: `${listing.id}`,
            }
        }
    })
}
