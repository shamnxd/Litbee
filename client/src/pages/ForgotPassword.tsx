import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";
import { ArrowRight, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validation";

import { isAxiosError } from "axios";
import { AUTH_MESSAGES } from "@/constants/messages";

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [sentEmail, setSentEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setErrorMsg("");
        setSentEmail(data.email);

        try {
            await authService.forgotPassword(data.email);
            setIsSent(true);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                setErrorMsg(error.response?.data?.message || AUTH_MESSAGES.ERROR.GENERIC_SOMETHING_WRONG);
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
                    <h1 className="text-3xl font-black text-[#0a0a0a] tracking-tight mt-6">{AUTH_MESSAGES.TITLES.RESET_PASSWORD}</h1>
                    <p className="text-gray-400 text-center mt-2">
                        {isSent
                            ? AUTH_MESSAGES.SUCCESS.PASSWORD_RESET_SENT
                            : AUTH_MESSAGES.SUBTITLES.FORGOT_PROMPT}
                    </p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {errorMsg && (
                            <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-xl">
                                {errorMsg}
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email")}
                                    className={`w-full border-b bg-transparent py-3 pl-7 text-sm text-[#0a0a0a] placeholder-gray-300 outline-none transition-colors duration-200 ${
                                        errors.email ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl py-4 text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Send Reset Link
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
                        <p className="text-gray-500 mb-8 px-4">
                            {AUTH_MESSAGES.SUBTITLES.FORGOT_SENT(sentEmail)}
                        </p>
                        <button
                            onClick={() => setIsSent(false)}
                            className="text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors"
                        >
                            {AUTH_MESSAGES.VERIFY.RESEND_RETRY}
                        </button>
                    </div>
                )}

                <div className="mt-10 text-center">
                    <Link to="/auth" className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
