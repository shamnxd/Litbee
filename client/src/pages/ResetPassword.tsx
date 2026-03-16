import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";
import { ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validation";

import { isAxiosError } from "axios";
import { AUTH_MESSAGES } from "@/constants/messages";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isReset, setIsReset] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        if (!token) {
            setErrorMsg(AUTH_MESSAGES.ERROR.INVALID_RESET_LINK);
        }
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) return;

        setIsLoading(true);
        setErrorMsg("");

        try {
            await authService.resetPassword(token, data.password);
            setIsReset(true);
            setTimeout(() => {
                navigate("/auth");
            }, 5000);
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setErrorMsg(err.response?.data?.message || AUTH_MESSAGES.ERROR.RESET_FAILED_SESSION);
            } else {
                setErrorMsg(AUTH_MESSAGES.ERROR.UNEXPECTED);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="w-full flex flex-col justify-center px-8 sm:px-14 xl:px-16 py-12 relative max-w-lg mx-auto">
                <div className="flex flex-col items-center mb-10">
                    <LitbeeLogo size={48} />
                    <h1 className="text-3xl font-black text-[#0a0a0a] tracking-tight mt-6">{AUTH_MESSAGES.TITLES.SET_NEW_PASSWORD}</h1>
                    <p className="text-gray-400 text-center mt-2 px-4">
                        {isReset
                            ? AUTH_MESSAGES.SUCCESS.PASSWORD_RESET_SUCCESS
                            : AUTH_MESSAGES.SUBTITLES.RESET_PROMPT}
                    </p>
                </div>

                {!isReset ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {errorMsg && (
                            <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-xl">
                                {errorMsg}
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    {...register("password")}
                                    className={`w-full border-b bg-transparent py-3 pl-7 pr-8 text-sm text-[#0a0a0a] placeholder-gray-300 outline-none transition-colors duration-200 ${
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

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repeat your password"
                                    {...register("confirmPassword")}
                                    className={`w-full border-b bg-transparent py-3 pl-7 pr-8 text-sm text-[#0a0a0a] placeholder-gray-300 outline-none transition-colors duration-200 ${
                                        errors.confirmPassword ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
                                    }`}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !token}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl py-4 text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Update Password
                                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-amber-400 rounded-md">
                                        <ArrowRight size={11} className="text-black" />
                                    </span>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-500 rounded-full mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <p className="text-gray-500 mb-8 px-4 font-medium">
                            {AUTH_MESSAGES.SUCCESS.PASSWORD_RESET_REDIRECT}
                        </p>
                        <Link
                            to="/auth"
                            className="text-sm font-bold bg-[#0a0a0a] text-white px-8 py-3 rounded-xl hover:bg-zinc-800 transition-colors inline-block"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
