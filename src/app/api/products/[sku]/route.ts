import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'cookie';

export async function GET(req: Request) {
    try {
        const cookies = req.headers.get('cookie') || '';
        const parsedCookies = parse(cookies);
        const accessToken = parsedCookies.accessToken;
        console.log('accessToken:', accessToken);

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract query parameters from the request URL
        const url = new URL(req.url);
        const sku = url.pathname.split('/').pop();

        // Fetch products data from Magento API with additional parameters
        const response = await axios.get(`https://www.wamia.tn/rest/V1/products/${sku}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const stockResponse = await axios.get(`https://www.wamia.tn/rest/V1/stockItems/${sku}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        

        return NextResponse.json({...response.data, stock: stockResponse.data});
    } catch (error: any) {
        console.error('Error fetching products data:', error.message);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}