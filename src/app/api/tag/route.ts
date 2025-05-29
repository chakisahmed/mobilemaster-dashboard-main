import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// GET request handler
export async function GET(req: Request) {
    try {
        const accessToken = await getAccessToken(req);
        // Send GET request to external API using axios
        const response = await axios.get('https://www.wamia.tn/rest/V1/mobilemaster/tags', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching tags data:', error);
        return NextResponse.json({
            error: 'Failed to fetch tags data',
            details: error.message
        }, { status: 500 });
    }
}

// POST request handler
export async function POST(req: Request) {
    try {
        const accessToken = await getAccessToken(req);
        const body = await req.json();

        // Send POST request to external API using axios
        const response = await axios.post('https://www.wamia.tn/rest/V1/mobilemaster/tags', body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 201 });
    } catch (error: any) {
        console.error('Error posting tags data:', error);
        return NextResponse.json({
            error: 'Failed to post tags data',
            details: error.message
        }, { status: 500 });
    }
}