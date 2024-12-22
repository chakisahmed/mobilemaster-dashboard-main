import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// GET request handler
export async function GET(req: Request) {
    try {

        // Send GET request to external API using axios
        const response = await axios.get('https://ext.web.wamia.tn/rest/V1/customermobile/homepage', {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error fetching homepage data:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch homepage data', 
            details: error.message 
        }, { status: 500 });
    }
}