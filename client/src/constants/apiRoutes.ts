export const AUTH_API_ROUTES = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  GOOGLE_LOGIN: '/auth/google-login',
  SEND_OTP: '/auth/send-otp',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
} as const;

export const AUTH_API_ROUTE_LIST = Object.values(AUTH_API_ROUTES);

export const URL_API_ROUTES = {
  URLS: '/urls',
  URL_BY_ID: (id: string) => `/urls/${id}`,
  CHECK_AVAILABILITY: '/urls/check-availability',
} as const;
