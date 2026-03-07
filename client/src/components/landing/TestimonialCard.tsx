import { Star } from "lucide-react";
import type { Testimonial } from "@/types/landing.types";

export const TestimonialCard = ({ quote, name, role, avatar, rating }: Testimonial) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex gap-0.5">
            {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed flex-1">"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                {avatar}
            </div>
            <div>
                <p className="text-gray-900 text-sm font-semibold">{name}</p>
                <p className="text-gray-500 text-xs">{role}</p>
            </div>
        </div>
    </div>
);
