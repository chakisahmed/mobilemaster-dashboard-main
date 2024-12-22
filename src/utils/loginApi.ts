import axios from 'axios';

export async function login(username:string, password:string) {
  try {
    const response = await axios.post('/api/login', { username, password });
    //console.log('Login successful:', response.data);
  } catch (error:any) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}
