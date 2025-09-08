

export function customHref(searchParams: URLSearchParams, href: string, customParams: URLSearchParams = new URLSearchParams()) {

    let keepSearchParams = new URLSearchParams();

    customParams.forEach((value, key) => {
        keepSearchParams.set(key, value);
    })


    searchParams.forEach((value, key) => {
        if (key == 'database' || key == 'debug') {
            keepSearchParams.set(key, value);
        }
    })

    
    // Add custom params
    const search = `?${keepSearchParams.toString()}`;
    console.log(search)
    // handle and ids (#contact, #aboutUs) in the href
    const customHref = href.includes('#')
        ? href.split('#')[0] + search + '#' + href.split('#')[1]
        : href + search;
    return customHref;
}

