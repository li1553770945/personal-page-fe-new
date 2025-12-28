// src/lib/request.ts
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

// 2. 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 【关键修改】加一个判断，确保是在浏览器里才去拿 token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 你可以直接返回 response.data，这样后面少写一个 .data
    return response.data; 
  },
  (error) => {
    // 这里可以统一处理 401 token 过期跳转登录
    return Promise.reject(error);
  }
);

export default instance;