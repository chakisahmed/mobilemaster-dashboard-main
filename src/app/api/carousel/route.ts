import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// GET request handler
export async function GET(req: Request) {
    try {
        const accessToken = getAccessToken(req);
        // Send GET request to external API using axios
        const response = await axios.get('https://www.wamia.tn/rest/V1/mobilemaster/productcarousel', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        console.log('carousel GET response', response.data);
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error fetching product carousel:', error);
        return NextResponse.json({
            error: 'Failed to fetch product carousel',
            details: error.message
        }, { status: 500 });
    }
}

// POST request handler
export async function POST(req: Request) {
    try {
        const accessToken = getAccessToken(req);
        const body = await req.json();

        // Send POST request to external API using axios
        const response = await axios.post('https://www.wamia.tn/rest/V1/mobilemaster/productcarousel', body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('carousel POST response', response.data);

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 201 });
    } catch (error:any) {
        console.error('Error creating product carousel:', error);
        return NextResponse.json({
            error: 'Failed to create product carousel',
            details: error.message
        }, { status: 500 });
    }
}