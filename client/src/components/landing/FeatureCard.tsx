import { cn } from "@/lib/utils";

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    desc: string;
    badge?: string;
}

export const FeatureCard = ({ icon: Icon, title, desc, badge }: FeatureCardProps) => (
    <div className="group relative bg-white border border-gray-200 hover:border-amber-400 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-400/20">
        {badge && (
            <span className="absolute top-4 right-4 text-[10px] font-bold bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/30">
                {badge}
            </span>
        )}
        <div className={cn(
            "w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4",
            "group-hover:bg-amber-400/20 group-hover:border-amber-400/40 transition-all duration-300"
        )}>
            <Icon className="w-5 h-5 text-amber-400" />
        </div>
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
);
