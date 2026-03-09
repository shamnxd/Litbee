import api from './api';

export const authService = {
    async login(credentials: { email: string; password: string }) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async signup(userData: { name: string; email: string; password: string }) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    async logout() {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    async googleLogin(token: string) {
        const response = await api.post('/auth/google-login', { token });
        return response.data;
    },

    async sendOtp(email: string) {
        const response = await api.post('/auth/send-otp', { email });
        return response.data;
    },

    async verifyEmail(email: string, otp: string) {
        const response = await api.post('/auth/verify-email', { email, otp });
        return response.data;
    },

    async forgotPassword(email: string) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(token: string, newPass: string) {
        const response = await api.post('/auth/reset-password', { token, newPassword: newPass });
        return response.data;
    },
};
