// api/banners2xn/create/[id].ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const accessToken = await getAccessToken(request);
  const { id } = params;
  try {
    const response = await axios.get(`http://localhost/rest/V1/mobilemaster/banner2xn/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(`Error fetching banners for id ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const accessToken = await getAccessToken(request);
  const { id } = params;
  try {
    const response = await axios.delete(`http://localhost/rest/V1/mobilemaster/banner2xn/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ message: 'Banner deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting banner for id ${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const accessToken = await getAccessToken(request);
  const { id } = params;
  const { name = null, sort_order = null } = await request.json();
  try {
    const response = await axios.put(
      `http://localhost/rest/V1/mobilemaster/banner2xn/${id}`,
      { name, sort_order },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(`Error updating banner for id ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}