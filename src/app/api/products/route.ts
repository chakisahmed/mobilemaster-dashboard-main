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
        const currentPage = url.searchParams.get('currentPage') || '1';
        const searchTerm = url.searchParams.get('searchTerm') || '';

        // Fetch products data from Magento API with additional parameters
        const response = await axios.get(`http://localhost/rest/V1/products?searchCriteria[currentPage]=${currentPage}&searchCriteria[filterGroups][0][filters][0][field]=name&searchCriteria[filterGroups][0][filters][0][value]=%${searchTerm}%&searchCriteria[filterGroups][0][filters][0][conditionType]=like`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        //console.log(JSON.stringify(response.data));

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error fetching products data:', error.message);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}