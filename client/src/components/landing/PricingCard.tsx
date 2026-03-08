import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/types/landing.types";

export const PricingCard = ({ plan }: { plan: PricingPlan }) => (
    <div className={cn(
        "relative rounded-2xl p-8 border flex flex-col transition-all duration-300 hover:-translate-y-1",
        plan.highlighted
            ? "bg-amber-400 border-amber-400 text-black shadow-2xl shadow-amber-400/30"
            : "bg-white border-gray-200 hover:border-amber-400"
    )}>
        {plan.badge && (
            <div className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full",
                plan.highlighted ? "bg-black text-amber-400" : "bg-amber-400 text-black"
            )}>
                {plan.badge}
            </div>
        )}

        <div className="mb-6">
            <p className={cn("text-sm font-semibold mb-1", plan.highlighted ? "text-black/70" : "text-gray-600")}>
                {plan.name}
            </p>
            <div className="flex items-end gap-1">
                <span className={cn("text-4xl font-black", plan.highlighted ? "text-black" : "text-gray-900")}>
                    {plan.price}
                </span>
                <span className={cn("text-sm mb-1.5", plan.highlighted ? "text-black/60" : "text-gray-500")}>
                    {plan.period}
                </span>
            </div>
            <p className={cn("text-sm mt-2", plan.highlighted ? "text-black/70" : "text-gray-600")}>
                {plan.desc}
            </p>
        </div>

        <ul className="flex-1 space-y-3 mb-8">
            {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                    <Check className={cn("w-4 h-4 mt-0.5 flex-shrink-0", plan.highlighted ? "text-black" : "text-amber-400")} />
                    <span className={cn("text-sm", plan.highlighted ? "text-black/80" : "text-gray-600")}>{f}</span>
                </li>
            ))}
        </ul>

        <Link
            to="/signup"
            className={cn(
                "w-full text-center text-sm font-semibold py-3 rounded-xl transition-all duration-200",
                plan.highlighted
                    ? "bg-black text-amber-400 hover:bg-black/80 shadow-lg"
                    : "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-400 hover:text-black hover:border-amber-400"
            )}
        >
            {plan.cta}
        </Link>
    </div>
);
