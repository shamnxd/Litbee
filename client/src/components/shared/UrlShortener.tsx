import { useState } from "react";
import { Zap, Link2, Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const UrlShortener = () => {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setError("");
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        setResult("litbee.in/x7kQ2p");
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://${result}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-2xl">
            <form onSubmit={handleShorten}>
                <div className="flex items-stretch gap-0 bg-[#1c1c1c] border border-white/10 rounded-2xl p-1.5 focus-within:border-amber-400/50 transition-colors duration-300">
                    <div className="flex items-center gap-2 flex-1 px-4">
                        <Link2 className="w-4 h-4 text-amber-400/60 flex-shrink-0" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); setError(""); }}
                            placeholder="Paste your long URL here..."
                            className="flex-1 bg-transparent py-3 text-sm text-white placeholder-gray-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200",
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
                {error && <p className="text-red-400 text-xs mt-2 ml-4">{error}</p>}
            </form>

            {result && (
                <div className="mt-3 flex items-center justify-between bg-[#1c1c1c] border border-amber-400/30 rounded-2xl px-5 py-3.5 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-amber-400 font-mono font-medium text-sm">https://{result}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://${result}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200",
                                copied
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white"
                            )}
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>
            )}

            <p className="text-gray-600 text-xs mt-3 ml-1">
                By using Litbee, you agree to our{" "}
                <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors underline">Terms of Service</a>
            </p>
        </div>
    );
};
