import { Copy, Check, X, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LinkSuccessModalProps } from "@/types/component.types";

export const LinkSuccessModal = ({ isOpen, onClose, shortUrl, longUrl }: LinkSuccessModalProps) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        const full = shortUrl.startsWith('http') ? shortUrl : `https://${shortUrl}`;
        navigator.clipboard.writeText(full);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={28} strokeWidth={2.5} />
                </div>

                <h2 className="text-2xl font-black mb-2 text-gray-900 tracking-tight">Link Generated!</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-xs truncate">{longUrl}</p>

                <div className="bg-white p-4 border border-gray-100 rounded-2xl mb-6 shadow-sm">
                    <QRCodeSVG value={shortUrl.startsWith('http') ? shortUrl : `https://${shortUrl}`} size={160} level="H" />
                </div>

                <div className="w-full flex items-center bg-gray-50 border border-gray-100 rounded-xl p-1 mb-2">
                    <span className="flex-1 text-sm font-bold px-4 truncate text-left text-gray-900">
                        {shortUrl}
                    </span>
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 border",
                            copied
                                ? "bg-green-500 border-green-500 text-white"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">QR Code is ready to download or share</p>
            </div>
        </div>
    );
};
