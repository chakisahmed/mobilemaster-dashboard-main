import { NextResponse } from 'next/server';
import axios from 'axios';

// GET request handler
export async function POST(req: Request) {
    try {
        // Extract search term and page from query parameters
        const payload = await req.text();


        // Construct the API URL
        const apiUrl = `https://customer.wamia.tn/graphql`;

        // Send GET request to external API using axios
        const response = await axios.post(apiUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            error: 'Failed to fetch products',
            details: error.message
        }, { status: 500 });
    }
}