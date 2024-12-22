import { serialize } from 'cookie';

export default function handler(res: any) {
  res.setHeader(
    'Set-Cookie',
    serialize('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    })
  );

  res.status(200).json({ success: true });
}
