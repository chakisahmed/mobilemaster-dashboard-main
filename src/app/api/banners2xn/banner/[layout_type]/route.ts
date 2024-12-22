import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/utils/axiosInstance';

// app/api/banners2xn/banner/[layout_type]/route.ts

export async function GET(request: Request, { params }: { params: { layout_type: string } }) {
    const accessToken = await getAccessToken(request);
    const { layout_type } = params;
    try {
        const response = await axios.get(`https://ext.web.wamia.tn/rest/V1/mobilemaster/banner2xn/banners/${layout_type}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return NextResponse.json(response.data, { status: 200 });
    } catch (error:any) {
        console.error(`Error fetching banners for layout type ${layout_type}:`, error);
        return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }
}