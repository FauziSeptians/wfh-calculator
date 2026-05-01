import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan pada server';

    return Promise.reject(new Error(errorMessage));
  }
);
