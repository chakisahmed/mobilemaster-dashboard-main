import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// GET request handler
export async function GET(req: Request) {
    try {
        const accessToken = getAccessToken(req);
        // Send GET request to external API using axios
        const response = await axios.get('https://www.wamia.tn/rest/V1/mobilemaster/featuredcategories', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error fetching featured categories:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch featured categories', 
            details: error.message 
        }, { status: 500 });
    }
}

// POST request handler
export async function POST(req: Request) {
    try {
        const accessToken = getAccessToken(req);
        // Parse the request body
        const body = await req.json();

        // Send POST request to external API using axios
        const response = await axios.post('https://www.wamia.tn/rest/V1/mobilemaster/featuredcategories/add', body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,


            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error creating featured category:', error);
        return NextResponse.json({ 
            error: 'Failed to create featured category', 
            details: error.message 
        }, { status: 500 });
    }
}
export async function PUT(req: Request) {
    try {
        const accessToken = getAccessToken(req);
        // Parse the request body
        const body = await req.json();

        // Send PUT request to external API using axios
        const response = await axios.put(`https://www.wamia.tn/rest/V1/mobilemaster/featuredcategories/${body.id}`, body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error updating featured category:', error);
        return NextResponse.json({ 
            error: 'Failed to update featured category', 
            details: error.message 
        }, { status: 500 });
    }
}