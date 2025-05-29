import { NextResponse } from 'next/server';
import axios from 'axios';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Call external API to authenticate
    const response = await axios.post('https://www.wamia.tn/rest/V1/integration/admin/token', {
      username,
      password,
    });

    const accessToken  = response.data;

    // Set HttpOnly cookie
    console.log('Login successful:', accessToken);
    const cookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    const headers = new Headers();
    headers.append('Set-Cookie', cookie);

    return NextResponse.json({ success: true }, { headers });
  } catch (error: any) {
    console.error('Login error:', error.message);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
