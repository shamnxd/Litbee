import { useState } from "react";
import { Zap, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { urlService } from "@/services/urlService";
import { LinkSuccessModal } from "./LinkSuccessModal";

import { isAxiosError } from "axios";

export const UrlShortener = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [url, setUrl] = useState("");
    const [result, setResult] = useState<string | null>(null);
    const [originalUrl, setOriginalUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        if (!isAuthenticated) {
            setError("Please login to shorten links");
            setTimeout(() => navigate("/auth"), 1500);
            return;
        }

        let formattedUrl = url.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }

        setError("");
        setLoading(true);
        try {
            const response = await urlService.create({ longUrl: formattedUrl });
            const shortBase = import.meta.env.VITE_SHORT_URL_BASE || 'litbee.io';
            const shortUrl = `${shortBase}/${response.data.shortCode}`;
            setResult(shortUrl);
            setOriginalUrl(url);
            setUrl("");
            setIsModalOpen(true);
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to shorten URL");
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl">
            <form onSubmit={handleShorten} noValidate>
                <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-0 sm:bg-white sm:border sm:border-gray-200 sm:shadow-sm sm:rounded-2xl sm:p-1.5 sm:focus-within:border-amber-400 sm:transition-colors sm:duration-300 max-w-[520px]">
                    <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 sm:bg-transparent sm:border-0 sm:rounded-none sm:px-4">
                        <Link2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); setError(""); }}
                            placeholder="Paste your long URL here..."
                            className="flex-1 bg-transparent py-3 text-sm text-gray-900 placeholder-gray-400 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200",
                            loading
                                ? "bg-amber-400/60 text-black/60 cursor-not-allowed"
                                : "bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40"
                        )}
                    >
                        {loading
                            ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            : <Zap className="w-4 h-4" />
                        }
                        {loading ? "Shortening..." : "Shorten"}
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-2 ml-4 font-medium">{error}</p>}
            </form>

            <p className="text-gray-500 text-xs mt-4 text-center lg:text-left">
                By using Litbee, you agree to our{" "}
                <a href="#" className="text-gray-600 hover:text-amber-500 transition-colors underline font-medium">Terms of Service</a>
            </p>

            <LinkSuccessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                shortUrl={result || ""}
                longUrl={originalUrl}
            />
        </div>
    );
};
