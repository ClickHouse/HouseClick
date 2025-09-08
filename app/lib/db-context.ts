import { headers } from 'next/headers'
import { cache } from 'react'

export const getDbSelection = cache(() => {
  const headersList = headers()
//   return process.env.ANALYTICAL_DATABASE
  return headersList.get('x-database-selection') || process.env.ANALYTICAL_DATABASE
})


export const getDatasetSelection = cache(() => {
  const headersList = headers()
  return headersList.get('x-dataset-selection') || 'normal'
})
