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

        // Fetch products data from Magento API with name and SKU search logic
        const response = await axios.get(
    `https://www.wamia.tn/rest/V1/products?searchCriteria[currentPage]=${currentPage}` +
    // Filter for product name (using "like" search)
    `&searchCriteria[filterGroups][0][filters][0][field]=name` +
    `&searchCriteria[filterGroups][0][filters][0][value]=%${searchTerm}%` +
    `&searchCriteria[filterGroups][0][filters][0][conditionType]=like` +
    // Filter for enabled products (status = 1)
    `&searchCriteria[filterGroups][1][filters][0][field]=status` +
    `&searchCriteria[filterGroups][1][filters][0][value]=1` +
    `&searchCriteria[filterGroups][1][filters][0][conditionType]=eq`,
    {
        headers: { Authorization: `Bearer ${accessToken}` },
    }
);

        if(response.data.items && response.data.items.length > 0) {
            return NextResponse.json(response.data);
        }

        console.log('No products found with the search term:', searchTerm);
        const response2 =await axios.get(
            `https://www.wamia.tn/rest/V1/products/${searchTerm}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        )
        const data = { items: [response2.data] }



        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching products data:', error.message);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
