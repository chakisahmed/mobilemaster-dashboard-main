// // utils/clientLoginApi.ts
// import axios from 'axios';

// export const clientLoginApi = async (username: string, password: string) => {
//   try {
//     const response = await axios.get('/api/login', {
//       username,
//       password,
//     });
//     return response.data;
//   } catch (error:any) {
//     throw error;
//   }
// };