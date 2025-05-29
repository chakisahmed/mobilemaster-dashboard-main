import { getAccessToken } from "@/utils/axiosInstance";
import axios from "axios";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const accessToken = await getAccessToken(req);
        // pop id from url using '/' as separator
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        

        // Send DELETE request to external API using axios
        const response = await axios.delete(`https://www.wamia.tn/rest/V1/mobilemaster/walkthrough/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error('Error deleting walkthrough data:', error);
        return NextResponse.json({
            error: 'Failed to delete walkthrough data',
            details: error.message
        }, { status: 500 });
    }
}