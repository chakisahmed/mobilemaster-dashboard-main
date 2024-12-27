import axios from 'axios';
import { parse } from 'cookie';
import { NextResponse } from 'next/server';

const axiosInstance = axios.create({
  baseURL: "https://customer.wamia.tn",
  headers: {
    'Content-Type': 'application/json',
  },
});
export const getAccessToken = (req: Request) => {
  const cookies = req.headers.get('cookie') || '';
        const parsedCookies = parse(cookies);
        const accessToken = parsedCookies.accessToken;
        console.log('accessToken:', accessToken);

        if (!accessToken) {
            throw new Error('Unauthorized');
        }
        return accessToken;
}
export default axiosInstance;