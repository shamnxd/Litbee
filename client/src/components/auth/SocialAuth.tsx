import React from "react";

interface SocialAuthProps {
    onGoogleLogin: () => void;
    isLoading: boolean;
}

export const SocialAuth: React.FC<SocialAuthProps> = ({ onGoogleLogin, isLoading }) => {
    return (
        <>
            <div className="mb-6">
                <button
                    type="button"
                    onClick={onGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl py-3.5 text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-70"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                        <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.504.37 2.924 1.018 4.174l2.946-2.468z" fill="#FBBC05" />
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962l2.946 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">or with email</span>
                <div className="h-px flex-1 bg-gray-100" />
            </div>
        </>
    );
};
