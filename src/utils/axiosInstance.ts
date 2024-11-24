import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://ext.web.wamia.tn",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;