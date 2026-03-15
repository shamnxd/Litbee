import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";
import { Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { authService } from "@/services/authService";
import { verifySuccess } from "@/store/slices/authSlice";
import type { RootState } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema, type VerifyEmailFormData } from "@/lib/validation";

import { isAxiosError } from "axios";

export default function VerifyEmail() {
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const user = useSelector((state: RootState) => state.auth.user);
    const email = location.state?.email || user?.email;

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<VerifyEmailFormData>({
        resolver: zodResolver(verifyEmailSchema),
    });

    const otpValue = watch("otp");

    const [timer, setTimer] = useState(60);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer]);

    useEffect(() => {
        if (!email) {
            navigate("/auth", { replace: true });
        } else if (user?.isVerified) {
            navigate("/my-links", { replace: true });
        }
    }, [email, user, navigate]);

    const onSubmit = async (data: VerifyEmailFormData) => {
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const response = await authService.verifyEmail(email, data.otp);
            dispatch(verifySuccess({
                user: response.user,
                token: response.access_token
            }));
            setSuccessMsg("Email verified successfully! Redirecting...");
            setTimeout(() => {
                navigate("/my-links", { replace: true });
            }, 1500);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                setErrorMsg(error.response?.data?.message || "Verification failed");
            } else {
                setErrorMsg("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setIsResending(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            await authService.sendOtp(email);
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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <LitbeeLogo size={48} />
                    <h1 className="text-2xl font-black text-[#0a0a0a] mt-6 tracking-tight">Verify your email</h1>
                    <p className="text-gray-500 text-center mt-2">
                        We've sent a 6-digit verification code to <br />
                        <span className="text-[#0a0a0a] font-semibold">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                    <div>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            placeholder="000000"
                            {...register("otp")}
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                            }}
                            className={`w-full text-center text-4xl tracking-[1rem] font-black border-b-2 outline-none py-4 bg-transparent transition-all duration-300 placeholder:text-gray-100 ${
                                errors.otp ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
                            }`}
                            autoFocus
                        />
                        {errors.otp && (
                            <p className="text-xs text-red-500 font-medium text-center mt-2">{errors.otp.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !otpValue || otpValue.length !== 6}
                        className="w-full flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-4 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                Verify Email
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <button
                        onClick={handleResend}
                        disabled={isResending || timer > 0}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-[#0a0a0a]'}`}
                    >
                        {isResending ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <RefreshCw size={14} className={timer > 0 ? '' : 'animate-none'} />
                        )}
                        {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive the code? Resend"}
                    </button>

                    <button
                        onClick={() => navigate("/auth")}
                        className="text-sm text-amber-500 hover:text-amber-600 font-semibold"
                    >
                        Back to login
                    </button>
                </div>
            </div>
        </div>
    );
}
