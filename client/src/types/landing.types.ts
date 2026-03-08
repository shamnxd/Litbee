export interface PricingPlan {
    name: string;
    price: string;
    period: string;
    desc: string;
    features: string[];
    cta: string;
    highlighted: boolean;
    badge?: string;
}

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    avatar: string;
    rating: number;
}

export interface FaqEntry {
    q: string;
    a: string;
}
