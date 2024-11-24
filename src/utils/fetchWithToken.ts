// utils/fetchWithToken.ts
import axios from 'axios';
import { parse } from 'cookie';

export const fetchWithToken = async (url: string, req: any) => {
  const cookies = parse(req ? req.headers.cookie || '' : document.cookie);
  const token = cookies.token;

  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const checkToken = (req?: any) => {
    const cookies = parse(req ? req.headers.cookie || '' : document.cookie);
    return !!cookies.token;
  };