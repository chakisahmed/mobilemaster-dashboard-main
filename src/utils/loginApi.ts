// loginApi.ts

import axios from 'axios';

export const loginApi = async (username: string, password: string) => {
  try {
    const response = await axios.post('/api/rest/V1/integration/admin/token', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// // loginApi.ts
// import axios from 'axios';
// import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// export const loginApi = async (req: NextRequest) => {
//   const { username, password } = await req.json();

//   try {
//     const response = await axios.post('https://ext.web.wamia.tn/rest/V1/integration/admin/token', {
//       username,
//       password,
//     });

//     const token = response.data;

//     // Set the token as an HTTP-only cookie
//     const responseCookies = cookies();
//     responseCookies.set('authToken', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       path: '/',
//     });
//     return NextResponse.json({ message: 'Login successful' });

//   } catch (error) {
//     return NextResponse.json({ error: 'Invalid credentials' });
//   }
// };