import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

//https://ext.web.wamia.tn/rest/V1/mobilemaster/sortorder/swap {"id1":1,"id2":2,"pos1":1, "pos2":2}
export async function PUT(req: Request) {
    try {
        // Parse the request body
        const accessToken = await getAccessToken(req);
        const body = await req.json();

        // Send PUT request to external API using axios
        const response = await axios.put('https://ext.web.wamia.tn/rest/V1/mobilemaster/sortorder/swap', body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error swapping sort order positions:', error);
        return NextResponse.json({ 
            error: 'Failed to swap sort order positions', 
            details: error.message 
        }, { status: 500 });
    }
}