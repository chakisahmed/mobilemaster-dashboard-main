import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// GET request handler
export async function GET(req: Request) {
    try {
        const accessToken = getAccessToken(req);
        // Extract layout_type from the request URL
        const url = new URL(req.url);
        const layoutType = url.pathname.split('/').pop();

        // Send GET request to external API using axios
        const response = await axios.get(`http://localhost/rest/V1/mobilemaster/featuredcategories/${layoutType}`, {
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
export async function DELETE(req: Request) { 
    try {
        const accessToken = getAccessToken(req);
        const url = new URL(req.url);
        const layoutType = url.pathname.split('/').pop();
        const response = await axios.delete(`http://localhost/rest/V1/mobilemaster/featuredcategories/${layoutType}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error deleting featured category:', error);
        return NextResponse.json({ 
            error: 'Failed to delete featured category', 
            details: error.message 
        }, { status: 500 });
    }
}
