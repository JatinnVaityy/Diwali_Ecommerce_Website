import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://diwali-ecommerce-website.onrender.com/api',
  headers: { 'Content-Type': 'application/json' }
});

// attach user token (for user endpoints like /orders, /auth protected)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
