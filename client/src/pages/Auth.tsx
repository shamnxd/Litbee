import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import type { AuthMode } from "@/types/auth.types";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure, verifySuccess, logout } from "@/store/slices/authSlice";
import { authService } from "@/services/authService";
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { useForm, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema, verifyEmailSchema, type LoginFormData, type SignupFormData, type VerifyEmailFormData } from "@/lib/validation";
import type { RootState } from "@/store";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { VerificationForm } from "@/components/auth/VerificationForm";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { isAxiosError } from "axios";

type AuthFormData = LoginFormData & SignupFormData & VerifyEmailFormData;

export default function Auth() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [mode, setMode] = useState<AuthMode>(() => {
        if (isAuthenticated && user && !user.isVerified) return "verify";
        return "login";
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [verificationEmail, setVerificationEmail] = useState(() => {
        if (isAuthenticated && user && !user.isVerified) return user.email;
        return "";
    });
    const [timer, setTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        clearErrors,
        watch,
    } = useForm<AuthFormData>({
        resolver: zodResolver(
            mode === "login" ? loginSchema : mode === "signup" ? signupSchema : verifyEmailSchema
        ) as any,
        mode: "onChange",
    });

    const otpValue = watch("otp");

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (mode === "verify" && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [mode, timer]);

    const handleGoogleAuth = async (token: string) => {
        setIsLoading(true);
        setErrorMsg("");
        dispatch(loginStart());
        try {
            const data = await authService.googleLogin(token);
            dispatch(loginSuccess({ user: data.user, token: data.access_token }));
            if (data.user.isVerified) {
                navigate("/my-links", { replace: true });
            } else {
                setVerificationEmail(data.user.email);
                switchMode("verify");
            }
        } catch (error: unknown) {
            let message = "Google Authentication failed.";
            if (isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            setErrorMsg(message);
            dispatch(loginFailure(message));
        } finally {
            setIsLoading(false);
        }
    };

    const googleLoginTrigger = useGoogleLogin({
        onSuccess: async (res: TokenResponse) => {
            const token = res.access_token;
            if (token) {
                handleGoogleAuth(token);
            }
        },
        onError: () => setErrorMsg("Google Login Failed"),
    });

    const onSubmit = async (data: LoginFormData | SignupFormData | VerifyEmailFormData) => {
        setIsLoading(true);
        clearErrors();
        setErrorMsg("");
        setSuccessMsg("");

        try {
            if (mode === "login") {
                const loginData = data as LoginFormData;
                const response = await authService.login(loginData);
                dispatch(loginSuccess({ user: response.user, token: response.access_token }));
                if (response.user.isVerified) {
                    navigate("/my-links", { replace: true });
                } else {
                    setVerificationEmail(response.user.email);
                    switchMode("verify");
                }
            } else if (mode === "signup") {
                const signupData = data as SignupFormData;
                const response = await authService.signup(signupData);
                dispatch(loginSuccess({ user: response.user, token: response.access_token }));
                setVerificationEmail(response.user.email);
                switchMode("verify");
            } else if (mode === "verify") {
                const verifyData = data as VerifyEmailFormData;
                const response = await authService.verifyEmail(verificationEmail || user?.email || "", verifyData.otp);
                dispatch(verifySuccess({
                    user: response.user,
                    token: response.access_token
                }));
                setSuccessMsg("Email verified successfully! Redirecting...");
                setTimeout(() => {
                    navigate("/my-links", { replace: true });
                }, 1500);
            }
        } catch (error: unknown) {
            let message = "Authentication failed.";
            if (isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            setErrorMsg(message);
            dispatch(loginFailure(message));
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = async (next: AuthMode) => {
        if (isAuthenticated && (next === "login" || next === "signup")) {
            try {
                await authService.logout();
            } catch (err) {
                console.error("Logout failed during switch", err);
            }
            dispatch(logout());
            setVerificationEmail("");
        }
        setMode(next);
        reset();
        setShowPassword(false);
        setErrorMsg("");
        setSuccessMsg("");
        clearErrors();
        if (next === "verify") {
            setTimer(60);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setIsResending(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            await authService.sendOtp(verificationEmail || user?.email || "");
            setSuccessMsg("OTP resent to your email.");
            setTimer(60);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                setErrorMsg(error.response?.data?.message || "Failed to resend OTP");
            } else {
                setErrorMsg("An unexpected error occurred");
            }
        } finally {
            setIsResending(false);
        }
    };

    const isLogin = mode === "login";
    const isSignup = mode === "signup";
    const isVerify = mode === "verify";

    return (
        <div
            className="min-h-screen flex bg-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <AuthSidebar />

            <div className="w-full lg:w-[42%] flex flex-col justify-center px-8 sm:px-14 xl:px-16 py-12 relative">
                <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
                    <LitbeeLogo size={28} />
                    <span className="font-black text-lg text-[#0a0a0a]">Litbee</span>
                </Link>

                <AuthTabs
                    mode={mode}
                    switchMode={switchMode}
                    verificationEmail={verificationEmail}
                    hasUser={!!user?.email}
                />

                <div className="mb-8">
                    <h1 className="text-3xl font-black text-[#0a0a0a] tracking-tight leading-tight">
                        {isLogin ? "Welcome back." : isSignup ? "Get started free." : "Verify email."}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1.5">
                        {isLogin
                            ? "Sign in to your Litbee account"
                            : isSignup
                                ? "No credit card required · Free forever plan"
                                : `Enter the 6-digit code sent to ${verificationEmail || user?.email}`}
                    </p>
                </div>

                {!isVerify && (
                    <SocialAuth
                        onGoogleLogin={() => googleLoginTrigger()}
                        isLoading={isLoading}
                    />
                )}

                <form onSubmit={handleSubmit(onSubmit as (data: AuthFormData) => Promise<void>)} className="flex flex-col gap-4">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl border border-green-100 animate-in fade-in slide-in-from-top-1">
                            {successMsg}
                        </div>
                    )}

                    <div className={`${isVerify ? "hidden" : "flex flex-col gap-4"}`}>
                        <div className={`overflow-hidden transition-all duration-300 ${isLogin ? "max-h-0 opacity-0" : "max-h-20 opacity-100"}`}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    {...register("name")}
                                    className={`w-full border-b bg-transparent py-2.5 text-sm text-[#0a0a0a] placeholder-gray-300 outline-none transition-colors duration-200 ${
                                        isSignup && errors.name ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
                                    }`}
                                />
                                {isSignup && errors.name && (
                                    <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register("email")}
                                className={`w-full border-b bg-transparent py-2.5 text-sm text-[#0a0a0a] placeholder-gray-300 outline-none transition-colors duration-200 ${
                                    errors.email ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                                {isLogin && (
                                    <Link to="/forgot-password" title="Forgot Password" className="text-xs text-amber-500 hover:text-amber-600 font-medium transition-colors">
                                        Forgot?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={isLogin ? "••••••••" : "Min. 8 characters"}
                                    {...register("password")}
                                    className={`w-full border-b bg-transparent py-2.5 pr-8 text-sm text-[#0a0a0a] placeholder-gray-300 outline-none transition-colors duration-200 ${
                                        errors.password ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    {isVerify && (
                        <VerificationForm
                            register={register as unknown as UseFormRegister<VerifyEmailFormData>}
                            errors={errors as unknown as FieldErrors<VerifyEmailFormData>}
                            timer={timer}
                            isResending={isResending}
                            onResend={handleResend}
                        />
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || (isVerify && (!otpValue || otpValue.length !== 6))}
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]"
                    >
                        {isLoading ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <>
                                {isLogin ? "Sign In" : isSignup ? "Create Account" : "Verify Email"}
                                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-amber-400 rounded-md">
                                    <ArrowRight size={11} className="text-black" />
                                </span>
                            </>
                        )}
                    </button>
                </form>

                <p className="text-sm text-gray-400 mt-6">
                    {isLogin ? "No account yet?" : "Have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => switchMode(isLogin ? "signup" : "login")}
                        className="text-[#0a0a0a] font-semibold hover:text-amber-500 transition-colors"
                    >
                        {isLogin ? "Sign up free" : "Sign in"}
                    </button>
                </p>

                <p className="text-xs text-gray-300 mt-8 leading-relaxed max-w-xs">
                    By continuing, you agree to our{" "}
                    <Link to="/terms" className="underline underline-offset-2 hover:text-gray-500 transition-colors">Terms of Service</Link> and <Link to="/privacy" className="underline underline-offset-2 hover:text-gray-500 transition-colors">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
}
