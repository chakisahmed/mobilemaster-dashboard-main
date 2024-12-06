// api/banners2xn/create.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { name, order, layout_type } = await request.json();
    const response = await axios.post('http://localhost/rest/V1/mobilemaster/banner2xn', {
      'name':name,
      'sort_order':order,
      'layout_type':layout_type,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data[0], { status: 200 });
  } catch (error) {
    console.error('Error creating banner2xn:', error);
    return NextResponse.json({ error: 'Failed to create banner2xn' }, { status: 500 });
  }
}