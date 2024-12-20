import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// GET request handler
export async function GET(req: Request) {
    try {
        const accessToken = await getAccessToken(req);
        // Send GET request to external API using axios
        const response = await axios.get('http://localhost/rest/V1/mobilemaster/walkthrough', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error fetching walkthrough data:', error);
        return NextResponse.json({
            error: 'Failed to fetch walkthrough data',
            details: error.message
        }, { status: 500 });
    }
}

// POST request handler
export async function POST(req: Request) {
    try {
        const accessToken = await getAccessToken(req);

        const requestBody = await req.json();

        // Send POST request to external API using axios
        const response = await axios.post('http://localhost/rest/V1/mobilemaster/walkthrough', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,


            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data[0], { status: 200 });
    } catch (error) {
        console.error('Error posting walkthrough data:', error);
        return NextResponse.json({
            error: 'Failed to post walkthrough data',
            details: error.message
        }, { status: 500 });
    }
}
//delete
