import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { store } from '../store';
import { logout, updateToken } from '../store/slices/authSlice';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const authRoutes = ['/auth/login', '/auth/register', '/auth/verify-email', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password', '/auth/google-login', '/auth/send-otp'];
        const isAuthRoute = authRoutes.some(route => originalRequest.url?.includes(route));

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
            originalRequest._retry = true;
            try {
                const { user } = store.getState().auth;
                if (!user) {
                    store.dispatch(logout());
                    return Promise.reject(error);
                }

                // Call refresh endpoint
                const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });

                const { access_token } = response.data;

                // Update store
                store.dispatch(updateToken({
                    token: access_token
                }));

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
