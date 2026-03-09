import type { StepCardProps } from "@/types/component.types";

export const StepCard = ({ number, title, desc, icon: Icon }: StepCardProps) => (
    <div className="flex flex-col items-center text-center relative">
        <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/30">
                <Icon className="w-7 h-7 text-black" />
            </div>
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-amber-400 text-amber-500 text-xs font-black flex items-center justify-center shadow-sm">
                {number}
            </span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xs">{desc}</p>
    </div>
);
