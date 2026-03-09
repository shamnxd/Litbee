import { X, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import type { QrModalProps } from "@/types/component.types";

export const QrModal = ({ isOpen, onClose, shortUrl }: QrModalProps) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        const full = shortUrl.startsWith('http') ? shortUrl : `https://${shortUrl}`;
        navigator.clipboard.writeText(full);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl flex flex-col items-center relative animate-in fade-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={20} /></button>
                <h2 className="text-lg font-bold mb-1 text-center text-gray-900">Scan QR Code</h2>
                <p className="text-gray-500 text-sm mb-6 text-center">{shortUrl}</p>

                <div className="bg-white p-4 border border-gray-100 rounded-xl mb-6 shadow-sm">
                    <QRCodeSVG value={shortUrl.startsWith('http') ? shortUrl : `https://${shortUrl}`} size={200} level="M" />
                </div>

                <button
                    onClick={handleCopy}
                    className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? "Link Copied!" : "Copy URL"}
                </button>
            </div>
        </div>
    );
};
