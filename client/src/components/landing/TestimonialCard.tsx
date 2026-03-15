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
            <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
            <div>
                <p className="text-gray-900 text-sm font-semibold">{name}</p>
                <p className="text-gray-500 text-xs">{role}</p>
            </div>
        </div>
    </div>
);
