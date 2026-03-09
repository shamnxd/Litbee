import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function RedirectHandler() {
    const { code } = useParams();

    useEffect(() => {
        if (code) {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            window.location.href = `${apiBase}/${code}`;
        }
    }, [code]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                <p className="text-gray-500 font-medium animate-pulse">Redirecting you...</p>
            </div>
        </div>
    );
}
