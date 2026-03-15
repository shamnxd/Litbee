import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Loader2, RefreshCw } from "lucide-react";
import type { VerifyEmailFormData } from "@/lib/validation";

interface VerificationFormProps {
    register: UseFormRegister<VerifyEmailFormData>;
    errors: FieldErrors<VerifyEmailFormData>;
    timer: number;
    isResending: boolean;
    onResend: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
    register,
    errors,
    timer,
    isResending,
    onResend,
}) => {
    return (
        <div className="flex flex-col gap-6">
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
            
            <div className="flex flex-col items-center gap-4">
                <button
                    type="button"
                    onClick={onResend}
                    disabled={isResending || timer > 0}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-[#0a0a0a]'
                    }`}
                >
                    {isResending ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <RefreshCw size={14} className={timer > 0 ? '' : 'animate-none'} />
                    )}
                    {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive the code? Resend"}
                </button>
            </div>
        </div>
    );
};
