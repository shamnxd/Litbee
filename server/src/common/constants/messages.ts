export const AUTH_MESSAGES = {
  ERRORS: {
    USER_NOT_FOUND: 'User not found',
    EMAIL_ALREADY_VERIFIED: 'Email already verified',
    INVALID_OTP: 'Invalid or expired OTP',
    INVALID_RESET_TOKEN: 'Invalid or expired reset token',
    EMAIL_EXISTS: 'An account with this email already exists',
    INVALID_GOOGLE_TOKEN: 'Invalid Google token',
    GOOGLE_AUTH_FAILED: 'Google authentication failed',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCESS_DENIED: 'Access Denied',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  },
  SUCCESS: {
    OTP_SENT: 'Verification OTP sent to your email.',
    EMAIL_VERIFIED: 'Email verified successfully.',
    RESET_LINK_SENT: 'If an account exists, a reset link will be sent.',
    PASSWORD_RESET: 'Password reset successfully',
    REGISTRATION_SUCCESS: 'Registration successful. Please verify your email.',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully.',
  },
};

export const URL_MESSAGES = {
  ERRORS: {
    NOT_FOUND: 'Url not found',
    SHORT_URL_NOT_FOUND: (shortCode: string) => `Short URL '${shortCode}' not found`,
  },
  SUCCESS: {
    CREATED: 'Short URL created successfully',
    UPDATED: 'Short URL updated successfully',
    DELETED: 'Short URL deleted successfully',
  },
};
