import React from 'react'
import Charts from './charts'

export default async function Chart({getData, type, params}) {
    try {
        const { data, metadata } = await getData(params);
        return (data && (data.length > 0 || Object.keys(data).length > 0) && 
            <Charts type={type} data={data} metadata={metadata} debug={params.debug} />
        );
    } catch (error) {
        // Check if the error is a timeout error
        if (error.message && error.message.includes('timed out')) {
            return (
                <div className="flex flex-col items-center justify-center p-6 rounded-lg h-full">
                    <div className="text-red-600 font-semibold text-lg mb-2">Query Timeout</div>
                </div>
            );
        } 
    }
}
