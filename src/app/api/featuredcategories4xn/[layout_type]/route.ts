import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// GET request handler
export async function GET(req: Request) {
    try {
        const accessToken = await getAccessToken(req);
        // Extract layout_type from the request URL
        const url = new URL(req.url);
        const layoutType = url.pathname.split('/').pop();

        // Send GET request to external API using axios
        const response = await axios.get(`http://localhost/rest/V1/mobilemaster/featuredcategories4xN/${layoutType}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error fetching featured categories:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch featured categories', 
            details: error.message 
        }, { status: 500 });
    }
}