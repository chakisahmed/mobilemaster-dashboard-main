import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'cookie';
import { getAccessToken } from '@/utils/axiosInstance';

export async function GET(req: Request) {
  try {
  
    const accessToken = getAccessToken(req);
    // pop categoryId from url using '/' as separator
    const url = new URL(req.url);
    const categoryId = url.pathname.split('/').pop();
   
    const response = await axios.get(`http://localhost/rest/V1/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching protected data:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}