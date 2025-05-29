// api/banners2xn/create.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

export async function POST(request: Request) {
  const accessToken = await getAccessToken(request);
  try {
    const { name, order, layout_type } = await request.json();
    const response = await axios.post('https://www.wamia.tn/rest/V1/mobilemaster/banner2xn', {
      'name':name,
      'sort_order':order,
      'layout_type':layout_type,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json(response.data[0], { status: 200 });
  } catch (error:any) {
    console.error('Error creating banner2xn:', error);
    return NextResponse.json({ error: 'Failed to create banner2xn' }, { status: 500 });
  }
}