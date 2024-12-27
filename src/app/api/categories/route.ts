import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'cookie';

export async function GET(req: Request) {
  try {
  
    const cookies = req.headers.get('cookie') || '';
    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

   

    // Fetch protected data from external API
    const response = await axios.get('https://customer.wamia.tn/rest/V1/categories?rootCategoryId=2', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });


    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching protected data:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
