import React from "react";
import { Link } from "react-router-dom";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";

export const AuthSidebar = React.memo(() => {
    return (
        <div className="hidden lg:flex lg:w-[58%] flex-col bg-slate-50 border-r border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 20 L55 50 L30 65 L5 50 L5 20 Z' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px",
                }}
            />
            <div className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-amber-400/6 blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between px-12 pt-10">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <LitbeeLogo size={34} />
                    <span className="font-black text-xl text-[#0a0a0a] tracking-tight">Litbee</span>
                </Link>
                <Link to="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                    ← Back to site
                </Link>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center px-12 pb-12 pt-10 max-w-2xl">
                <div className="mb-10 flex items-center gap-4">
                    <div className="flex -space-x-3">
                        <img className="h-9 w-9 rounded-full border-2 border-white ring-2 ring-transparent" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <img className="h-9 w-9 rounded-full border-2 border-white ring-2 ring-transparent" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <img className="h-9 w-9 rounded-full border-2 border-white ring-2 ring-transparent" src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-[10px] font-bold text-amber-600">12k+</div>
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                        <span className="text-[#0a0a0a] font-bold">12,000+</span> creators trust Litbee
                    </div>
                </div>

                <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-5">
                    URL Shortener · Analytics
                </p>
                <h2 className="text-5xl xl:text-6xl font-black text-[#0a0a0a] leading-[1.05] tracking-tight mb-4">
                    Turn long links<br />
                    into <span className="text-amber-400">smart</span> ones.
                </h2>
                <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-md">
                    Shorten, brand, and track your URLs in seconds. Join 12,000+ creators, marketers, and developers using Litbee.
                </p>
                
                <div className="grid grid-cols-2 gap-8 mt-4 pt-10 border-t border-gray-100">
                    <div>
                        <div className="text-2xl font-black text-[#0a0a0a]">99.9%</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Uptime SLA</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-[#0a0a0a]">3M+</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Links Created</div>
                    </div>
                </div>
            </div>
        </div>
    );
});
