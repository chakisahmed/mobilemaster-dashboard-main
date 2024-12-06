import axios from 'axios';

export async function login(username, password) {
  try {
    const response = await axios.post('/api/login', { username, password });
    //console.log('Login successful:', response.data);
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}
