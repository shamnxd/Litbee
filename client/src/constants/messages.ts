export const AUTH_MESSAGES = {
    ERROR: {
        GOOGLE_FAILED: "Google Authentication failed.",
        LOGIN_FAILED: "Login failed. Please check your credentials.",
        SIGNUP_FAILED: "Signup failed. Please try again.",
        VERIFY_FAILED: "Verification failed. Invalid or expired OTP.",
        RESEND_FAILED: "Failed to resend OTP. Please try again.",
        UNEXPECTED: "An unexpected error occurred. Please try again later.",
        AUTH_GENERIC: "Authentication failed.",
        LOGIN_REQUIRED: "Please login to shorten links",
        GENERIC_SOMETHING_WRONG: "Something went wrong.",
        INVALID_RESET_LINK: "Invalid reset link. Please request a new one.",
        RESET_FAILED_SESSION: "Reset failed. Session may have expired."
    },
    SUCCESS: {
        VERIFY_COMPLETE: "Email verified successfully! Redirecting...",
        OTP_SENT: "OTP resent to your email.",
        ACCOUNT_CREATED: "Account created successfully! Please verify your email.",
        PASSWORD_RESET_SENT: "Check your inbox for a reset link.",
        PASSWORD_RESET_SUCCESS: "Password updated successfully!",
        PASSWORD_RESET_REDIRECT: "Your password has been changed. You will be redirected to the login page shortly."
    },
    TITLES: {
        WELCOME_BACK: "Welcome back.",
        GET_STARTED: "Get started free.",
        VERIFY_EMAIL: "Verify email.",
        RESET_PASSWORD: "Reset Password",
        SET_NEW_PASSWORD: "Set New Password"
    },
    SUBTITLES: {
        SIGN_IN: "Sign in to your Litbee account",
        NO_CREDIT_CARD: "No credit card required · Free forever plan",
        ENTER_OTP: (email: string) => `Enter the 6-digit code sent to ${email}`,
        FORGOT_PROMPT: "Enter your email to receive a password reset link.",
        FORGOT_SENT: (email: string) => `If an account exists for ${email}, you'll receive an email with instructions shortly.`,
        RESET_PROMPT: "Secure your account with a strong new password."
    },
    VERIFY: {
        RESEND_WAIT: (timer: number) => `Resend code in ${timer}s`,
        RESEND_PROMPT: "Didn't receive the code? Resend",
        RESEND_RETRY: "Did't get it? Try again"
    }
};

export const URL_MESSAGES = {
    SLUG: {
        CHECKING: "Checking",
        AVAILABLE: "Available",
        TAKEN: "Taken",
        IN_USE: "This slug is already in use by another link."
    },
    TAGS: {
        EMPTY: "Organize with tags",
        LABEL: "Tags",
        ADD_PLACEHOLDER: "Add a tag..."
    },
    URL: {
        DESTINATION_LABEL: "Destination URL",
        DESTINATION_PLACEHOLDER: "https://example.com/long-url",
        INPUT_PLACEHOLDER: "Paste your long URL here...",
        SHORTEN: "Shorten",
        SHORTENING: "Shortening...",
        FAILED: "Failed to shorten URL"
    },
    COMMON: {
        UNEXPECTED: "An unexpected error occurred"
    }
};
