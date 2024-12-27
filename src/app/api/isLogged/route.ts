import axios from 'axios';
import { parse } from 'cookie';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookies = req.headers.get('cookie') || '';
  console.log('Cookies:', cookies); // Logs all cookies sent by the client
  //get accessToken from cookies
    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.accessToken;
    console.log('accessToken:', accessToken); // Logs the accessToken
    //check if accessToken exists
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const response = await axios.get('https://customer.wamia.tn/rest/V1/directory/currency', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log('Data fetched:', response.data); // Logs the fetched data
    return NextResponse.json({ ...response.data,success: true });

}
