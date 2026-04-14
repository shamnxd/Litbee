import api from './api';
import { AUTH_API_ROUTES } from '@/constants/apiRoutes';

export const authService = {
    async login(credentials: { email: string; password: string }) {
        const response = await api.post(AUTH_API_ROUTES.LOGIN, credentials);
        return response.data;
    },

    async signup(userData: { name: string; email: string; password: string }) {
        const response = await api.post(AUTH_API_ROUTES.REGISTER, userData);
        return response.data;
    },

    async logout() {
        const response = await api.post(AUTH_API_ROUTES.LOGOUT);
        return response.data;
    },

    async googleLogin(token: string) {
        const response = await api.post(AUTH_API_ROUTES.GOOGLE_LOGIN, { token });
        return response.data;
    },

    async sendOtp(email: string) {
        const response = await api.post(AUTH_API_ROUTES.SEND_OTP, { email });
        return response.data;
    },

    async verifyEmail(email: string, otp: string) {
        const response = await api.post(AUTH_API_ROUTES.VERIFY_EMAIL, { email, otp });
        return response.data;
    },

    async forgotPassword(email: string) {
        const response = await api.post(AUTH_API_ROUTES.FORGOT_PASSWORD, { email });
        return response.data;
    },

    async resetPassword(token: string, newPass: string) {
        const response = await api.post(AUTH_API_ROUTES.RESET_PASSWORD, { token, newPassword: newPass });
        return response.data;
    },
};
