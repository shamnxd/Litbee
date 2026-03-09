import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import type { RootState } from "@/store";
import { Settings, LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { authService } from "@/services/authService";

const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
];

export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Failed to logout on server", error);
        } finally {
            dispatch(logout());
            navigate("/auth");
        }
    };

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled
                ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/30"
                : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
                    <LitbeeLogo size={32} />
                    <span className="text-amber-400 font-black text-lg tracking-tight">Litbee</span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150 font-medium px-4 py-2 rounded-lg"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 transition-all"
                            >
                                <div className="w-8 h-8 bg-amber-400 text-black rounded-full flex items-center justify-center text-xs font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-200">{user?.name}</span>
                                <ChevronDown size={14} className={cn("text-gray-500 transition-transform", profileOpen && "rotate-180")} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    <Link to="/my-links" className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                        <Settings size={14} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="flex items-center gap-1.5 text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-black px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30"
                            >
                                Get Started
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            <div className={cn(
                "md:hidden overflow-hidden transition-all duration-300",
                mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="bg-[#0d0d0d] border-t border-white/[0.06] px-4 py-4 flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-gray-300 hover:text-white hover:bg-white/5 py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-white/[0.06]">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                                    <div className="w-10 h-10 bg-amber-400 text-black rounded-full flex items-center justify-center font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <Link
                                    to="/my-links"
                                    className="text-gray-300 hover:text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-400 hover:text-red-300 text-left py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-center text-sm text-gray-300 hover:text-white py-2.5 border border-white/10 rounded-full transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-center text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-black py-2.5 rounded-full transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
