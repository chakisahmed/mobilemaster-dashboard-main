import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// DELETE request handler
export async function DELETE(req: Request) {
    try {
        const accessToken = await getAccessToken(req);
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        // Send DELETE request to external API using axios
        const response = await axios.delete(`https://customer.wamia.tn/rest/V1/mobilemaster/tags/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting tag data:', error);
        return NextResponse.json({
            error: 'Failed to delete tag data',
            details: error.message
        }, { status: 500 });
    }
}