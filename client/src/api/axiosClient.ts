import axios from 'axios';

// API Resource (KatCoffee.API)
export const resourceApi = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Identity Server (KatCoffee.IdentityServer)
export const authApi = axios.create({
  baseURL: 'https://localhost:7001/api',
});

// Interceptor tự động gắn Bearer Token vào mỗi Request gửi tới Resource API
resourceApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);