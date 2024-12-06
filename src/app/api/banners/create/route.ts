import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';


export async function POST(req: Request) {
  try {
    const accessToken = getAccessToken(req);

    // Parse the request body
    const body = await req.json();

    // Send POST request to external API using axios
    const response = await axios.post('http://localhost/rest/V1/mobilemaster/banner', body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Return a success response with the data from the external API
    return NextResponse.json(response.data[0], { status: 200 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ 
      error: 'Failed to create banner', 
      details: error.message 
    }, { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const accessToken = getAccessToken(req);
    
    // Fetch data from the external API using axios
    const response = await axios.get('http://localhost/rest/V1/mobilemaster/banner', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Return a success response with the data from the external API
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}
// Handle unsupported methods (e.g., OPTIONS)
export function OPTIONS() {
  return new Response(null, { status: 204 });
}

