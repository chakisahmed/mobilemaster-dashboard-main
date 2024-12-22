import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const accessToken = getAccessToken(request);
  const { id } = params;

  try {
    // Send DELETE request to the external API using axios
    const response = await axios.delete(`https://ext.web.wamia.tn/rest/V1/mobilemaster/banner/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assuming the external API returns a success status code
    // Return true to indicate success
    return NextResponse.json(true, { status: 200 });
  } catch (error:any) {
    console.error(`Error deleting banner with ID ${id}:`, error);

    // Return false to indicate failure
    return NextResponse.json(false, { status: 500 });
  }
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const accessToken = getAccessToken(request);
    const { id } = params;
    try {
      const body = await request.json();
      const response = await axios.put(`https://ext.web.wamia.tn/rest/V1/mobilemaster/banner/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return NextResponse.json(response.data[0], { status: 200 });
    } catch (error:any) {
      console.error(`Error updating banner with ID ${id}:`, error);
      return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
    }
  }
