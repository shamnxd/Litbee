import axios from 'axios';
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
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
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
