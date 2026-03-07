import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";

const NAV_LINKS = ["Features", "Dashboard", "Contact"];

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled
                ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl"
                : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                    <LitbeeLogo size={34} />
                    <span className="text-amber-400 font-black text-xl tracking-tight">Litbee</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm text-amber-400 border-b-2 border-amber-400 pb-1 font-semibold">
                        Home
                    </Link>
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                        >
                            {link}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2 font-medium">
                        Sign In
                    </Link>
                    <Link
                        to="/signup"
                        className="flex items-center gap-2 text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-black px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-amber-400/25 hover:shadow-amber-400/40 hover:scale-105"
                    >
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden text-gray-300 hover:text-white transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#0d0d0d]/98 border-t border-white/5 px-6 py-6 flex flex-col gap-4">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-gray-300 hover:text-white py-2 text-sm font-medium"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link}
                        </a>
                    ))}
                    <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                        <Link to="/login" className="text-center text-sm text-gray-300 py-2.5 border border-white/10 rounded-full">
                            Sign In
                        </Link>
                        <Link to="/signup" className="text-center text-sm font-semibold bg-amber-400 text-black py-2.5 rounded-full">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
