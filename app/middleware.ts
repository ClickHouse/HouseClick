// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only process server-side requests, not client-side navigation
  // if (request.headers.get('x-middleware-rewrite') || 
  //     request.headers.get('x-nextjs-data')) {
  //   return NextResponse.next();
  // }

  const { searchParams } = new URL(request.url)
  const dbParam = searchParams.get('database')
  const datasetParam = searchParams.get('dataset')
  
  // // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  
  // Add the db parameter to the headers if it exists
  if (dbParam) {
    requestHeaders.set('x-database-selection', dbParam)
    requestHeaders.set('x-dataset-selection', datasetParam)
  }
  // console.log(requestHeaders)
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
    // request
  })
  // return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude client-side navigation requests
    '/((?!_next/data|api/auth).*)',
  ],
}
