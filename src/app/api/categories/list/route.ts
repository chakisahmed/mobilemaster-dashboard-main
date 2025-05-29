import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'cookie';
import { URLSearchParams } from 'url';

export async function GET(req: Request) {
    try {
        const cookies = req.headers.get('cookie') || '';
        const parsedCookies = parse(cookies);
        const accessToken = parsedCookies.accessToken;

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL('https://www.wamia.tn/rest/V1/categories/list');
        const params = new URLSearchParams();

        const searchParams = req.url.split('?')[1];
        if (searchParams) {
            const queryParams = new URLSearchParams(searchParams);
            queryParams.forEach((value, key) => {
                if (key === 'name') {
                    params.append('searchCriteria[filterGroups][0][filters][0][field]', 'name');
                    params.append('searchCriteria[filterGroups][0][filters][0][value]', `%${value}%`);
                    params.append('searchCriteria[filterGroups][0][filters][0][condition_type]', 'like');
                } else {
                    params.append(key, value);
                }
            });
        }

        url.search = params.toString();

        // Fetch protected data from external API
        const response = await axios.get(url.toString(), {
            headers: { Authorization: `Bearer ${accessToken}` },
        });


        return NextResponse.json(response.data);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}