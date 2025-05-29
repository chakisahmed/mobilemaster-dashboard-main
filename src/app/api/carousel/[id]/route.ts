import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// DELETE request handler
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const accessToken = getAccessToken(req);
        const { id } = params;

        // Send DELETE request to external API using axios
        const response = await axios.delete(`https://www.wamia.tn/rest/V1/mobilemaster/productcarousel/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error deleting product carousel:', error);
        return NextResponse.json({
            error: 'Failed to delete product carousel',
            details: error.message
        }, { status: 500 });
    }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const accessToken = getAccessToken(req);
        const { id } = params;
        const body = await req.json();

        // Send PUT request to external API using axios
        const response = await axios.put(`https://www.wamia.tn/rest/V1/mobilemaster/productcarousel/${id}`, body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('carousel PUT response', response.data);

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error updating product carousel:', error);
        return NextResponse.json({
            error: 'Failed to update product carousel',
            details: error.message
        }, { status: 500 });
    }
}