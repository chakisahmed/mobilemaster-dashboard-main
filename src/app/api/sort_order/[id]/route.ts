import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// DELETE request handler
export async function DELETE(req: Request) {
    try {
        const accessToken = await getAccessToken(req);

        // Extract id from the request URL
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        // Send DELETE request to external API using axios
        const response = await axios.delete(`https://ext.web.wamia.tn/rest/V1/mobilemaster/sortorder/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error deleting sort order:', error);
        return NextResponse.json({ 
            error: 'Failed to delete sort order', 
            details: error.message 
        }, { status: 500 });
    }
}