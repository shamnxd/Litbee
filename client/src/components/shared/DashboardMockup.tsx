import { Link2, TrendingUp, MousePointerClick } from "lucide-react";

const CHART_POINTS = "20,80 45,65 70,70 95,45 120,50 145,28 170,32 195,12";

export const DashboardMockup = () => (
    <div className="relative w-full max-w-[520px]">
        {/* Glow */}
        <div className="absolute inset-0 bg-amber-400/15 rounded-3xl blur-3xl scale-75" />

        {/* Card */}
        <div
            className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl"
            style={{ transform: "perspective(900px) rotateY(-6deg) rotateX(3deg)" }}
        >
            {/* Browser top bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <div className="flex-1 mx-3 bg-white border border-gray-100 shadow-sm rounded-md px-3 py-1 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-500 font-mono text-xs">litbee.in/my-links</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Total Links", value: "1,248" },
                        { label: "Total Clicks", value: "84.2K" },
                        { label: "Avg. CTR", value: "67.4%" },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-gray-500 text-[10px] mb-1">{label}</p>
                            <p className="text-gray-900 font-bold text-lg">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-600 text-xs font-medium">Click Analytics</span>
                        <span className="text-green-600 text-xs flex items-center gap-1 font-bold">
                            <TrendingUp className="w-3 h-3" /> +24.1%
                        </span>
                    </div>
                    <svg viewBox="0 0 215 95" className="w-full h-20">
                        <defs>
                            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <polyline points={CHART_POINTS} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polygon points={`20,95 ${CHART_POINTS} 195,95`} fill="url(#cg)" />
                        {CHART_POINTS.split(" ").map((pt, i) => {
                            const [x, y] = pt.split(",").map(Number);
                            return <circle key={i} cx={x} cy={y} r="3" fill="#F59E0B" />;
                        })}
                    </svg>
                </div>

                {/* Link list */}
                <div className="space-y-2">
                    {[
                        { slug: "litbee.in/launch24", clicks: "12.4K", trend: "+18%" },
                        { slug: "litbee.in/promo-q1", clicks: "9.1K", trend: "+32%" }
                    ].map(({ slug, clicks, trend }) => (
                        <div key={slug} className="flex items-center justify-between bg-white shadow-sm rounded-lg px-3 py-2.5 border border-gray-100">
                            <div className="flex items-center gap-2">
                                <Link2 className="w-3 h-3 text-amber-500" />
                                <span className="text-amber-500 font-mono text-xs font-semibold">{slug}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600 text-xs font-medium">{clicks}</span>
                                <span className="text-green-600 text-xs font-bold">{trend}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Floating badge */}
        <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-xl">
            <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                <MousePointerClick className="w-3 h-3 text-gray-900" />
            </div>
            <div>
                <p className="text-gray-900 text-xs font-bold">2,834 clicks today</p>
                <p className="text-gray-500 text-[10px]">across all links</p>
            </div>
        </div>
    </div>
);
