import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

export async function GET(req: Request) {
    try {
        const accessToken = await getAccessToken(req);
        // Fetch sort order data from the external API using axios
        const response = await axios.get('http://localhost/rest/V1/mobilemaster/sortorder', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error fetching sort order data:', error);
        return NextResponse.json({ error: 'Failed to fetch sort order data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const accessToken = await getAccessToken(request);
        const { layout_id, label, position, type } = await request.json();

        // Post sort order data to the external API using axios
        const response = await axios.post('http://localhost/rest/V1/mobilemaster/sortorder', {
            'layout_id': layout_id,
            'label': label,
            'position': position,
            'type': type,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error posting sort order data:', error);
        return NextResponse.json({ error: 'Failed to post sort order data' }, { status: 500 });
    }
}

// Handle unsupported methods (e.g., OPTIONS)
export function OPTIONS() {
    return new Response(null, { status: 204 });
}