import { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import type { AuthMode } from "@/types/auth.types";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { authService } from "@/services/authService";
import { useGoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from "@/lib/validation";

import { isAxiosError } from "axios";

export default function Auth() {
    const [mode, setMode] = useState<AuthMode>("login");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        clearErrors,
    } = useForm<LoginFormData | SignupFormData>({
        resolver: zodResolver(mode === "login" ? loginSchema : signupSchema),
        mode: "onChange",
    });

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
                navigate("/verify-email", { state: { email: data.user.email }, replace: true });
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
        onSuccess: (res) => handleGoogleAuth(res.access_token),
        onError: () => setErrorMsg("Google Login Failed"),
    });

    const onSubmit = async (data: LoginFormData | SignupFormData) => {
        setIsLoading(true);
        clearErrors();
        setErrorMsg("");

        try {
            if (mode === "login") {
                const loginData = data as LoginFormData;
                const response = await authService.login(loginData);
                dispatch(loginSuccess({ user: response.user, token: response.access_token }));
                if (response.user.isVerified) {
                    navigate("/my-links", { replace: true });
                } else {
                    navigate("/verify-email", { state: { email: response.user.email }, replace: true });
                }
            } else {
                const signupData = data as SignupFormData;
                const response = await authService.signup(signupData);
                dispatch(loginSuccess({ user: response.user, token: response.access_token }));
                navigate("/verify-email", { state: { email: response.user.email }, replace: true });
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

    const switchMode = (next: AuthMode) => {
        setMode(next);
        reset();
        setShowPassword(false);
        setErrorMsg("");
        clearErrors();
    };

    const isLogin = mode === "login";

    return (
        <div
            className="min-h-screen flex bg-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="hidden lg:flex lg:w-[58%] flex-col bg-slate-50 border-r border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 20 L55 50 L30 65 L5 50 L5 20 Z' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
                        backgroundSize: "60px 60px",
                    }}
                />
                <div className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-amber-400/6 blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between px-12 pt-10">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <LitbeeLogo size={34} />
                        <span className="font-black text-xl text-[#0a0a0a] tracking-tight">Litbee</span>
                    </Link>
                    <Link to="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                        ← Back to site
                    </Link>
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center px-12 pb-12 pt-10 max-w-2xl">
                    <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-5">
                        URL Shortener · Analytics
                    </p>
                    <h2 className="text-5xl xl:text-6xl font-black text-[#0a0a0a] leading-[1.05] tracking-tight mb-4">
                        Turn long links<br />
                        into <span className="text-amber-400">smart</span> ones.
                    </h2>
                    <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-md">
                        Shorten, brand, and track your URLs in seconds. Join 12,000+ creators, marketers, and developers using Litbee.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-[42%] flex flex-col justify-center px-8 sm:px-14 xl:px-16 py-12 relative">
                <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
                    <LitbeeLogo size={28} />
                    <span className="font-black text-lg text-[#0a0a0a]">Litbee</span>
                </Link>

                <div className="flex items-center gap-1 mb-8">
                    {(["login", "signup"] as AuthMode[]).map((m, i) => (
                        <Fragment key={m}>
                            {i > 0 && <span className="text-gray-300 text-sm">/</span>}
                            <button
                                onClick={() => switchMode(m)}
                                className={`text-sm font-semibold px-1 pb-0.5 transition-all duration-200 border-b-2 ${mode === m
                                    ? "text-[#0a0a0a] border-amber-400"
                                    : "text-gray-400 border-transparent hover:text-gray-600"
                                    }`}
                            >
                                {m === "login" ? "Sign In" : "Sign Up"}
                            </button>
                        </Fragment>
                    ))}
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-black text-[#0a0a0a] tracking-tight leading-tight">
                        {isLogin ? "Welcome back." : "Get started free."}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1.5">
                        {isLogin
                            ? "Sign in to your Litbee account"
                            : "No credit card required · Free forever plan"}
                    </p>
                </div>

                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => googleLoginTrigger()}
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

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-md">
                            {errorMsg}
                        </div>
                    )}

                    <div className={`overflow-hidden transition-all duration-300 ${isLogin ? "max-h-0 opacity-0" : "max-h-20 opacity-100"}`}>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                {...register("name")}
                                className={`w-full border-b bg-transparent py-2.5 text-sm text-[#0a0a0a] placeholder-gray-300 outline-none transition-colors duration-200 ${
                                    !isLogin && "name" in errors && errors.name ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
                                }`}
                            />
                            {!isLogin && "name" in errors && errors.name && (
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]"
                    >
                        {isLoading ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <>
                                {isLogin ? "Sign In" : "Create Account"}
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
