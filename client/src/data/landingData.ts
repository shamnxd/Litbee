import {
    Zap, BarChart3, QrCode, Layers, Lock, Clock, Globe, LineChart,
    Link2, Copy,
} from "lucide-react";
import type { PricingPlan, Testimonial, FaqEntry } from "@/types/landing.types";

export const FEATURES = [
    {
        icon: Zap,
        title: "Instant Shortening",
        desc: "Shorten any URL in milliseconds. No sign-up required for basic use — just paste and go.",
    },
    {
        icon: BarChart3,
        title: "Deep Analytics",
        desc: "Track clicks, referrers, geographic data, device types, and browser stats in real time.",
        badge: "Popular",
    },
    {
        icon: QrCode,
        title: "QR Code Generator",
        desc: "Auto-generate scannable QR codes for every shortened link, ready to download and share.",
    },
    {
        icon: Layers,
        title: "Custom Slugs",
        desc: "Create branded, memorable short links with custom aliases — e.g. litbee.in/your-brand.",
    },
    {
        icon: Lock,
        title: "Password Protection",
        desc: "Guard sensitive links with a password. Only people with the password can access them.",
    },
    {
        icon: Clock,
        title: "Expiring Links",
        desc: "Set an expiry date and time on your links. They auto-deactivate when the window closes.",
    },
    {
        icon: Globe,
        title: "Geo Targeting",
        desc: "Redirect visitors to different URLs based on their country or region automatically.",
        badge: "Pro",
    },
    {
        icon: LineChart,
        title: "UTM Builder",
        desc: "Append UTM parameters to any link and track your marketing campaigns effortlessly.",
    },
];

export const STEPS = [
    {
        number: "1",
        icon: Link2,
        title: "Paste Your URL",
        desc: "Drop any long, messy link into the input box above. Any URL works — social, docs, affiliate, anything.",
    },
    {
        number: "2",
        icon: Zap,
        title: "Click Shorten",
        desc: "Hit the button and Litbee instantly generates a clean, compact short link in under a second.",
    },
    {
        number: "3",
        icon: Copy,
        title: "Share Anywhere",
        desc: "Copy your new link and share it across social media, emails, bio pages, or print campaigns.",
    },
    {
        number: "4",
        icon: BarChart3,
        title: "Track Performance",
        desc: "Watch real-time analytics roll in — clicks, devices, locations, and conversion rates from your dashboard.",
    },
];

export const PRICING_PLANS: PricingPlan[] = [
    {
        name: "Free",
        price: "₹0",
        period: "/ forever",
        desc: "Perfect for personal use and trying things out.",
        features: [
            "Up to 20 short links/month",
            "Basic click analytics",
            "QR code generation",
            "7-day link history",
            "Standard short links",
        ],
        cta: "Start for Free",
        highlighted: false,
    },
    {
        name: "Pro",
        price: "₹299",
        period: "/ month",
        desc: "For creators, marketers, and growing teams.",
        features: [
            "Unlimited short links",
            "Advanced analytics & reports",
            "Custom slugs & branding",
            "Password-protected links",
            "Link expiry & scheduling",
            "Geo targeting",
            "UTM builder",
            "Priority support",
        ],
        cta: "Start 14-day Trial",
        highlighted: true,
        badge: "Most Popular",
    },
    {
        name: "Business",
        price: "₹999",
        period: "/ month",
        desc: "For agencies and large-scale campaigns.",
        features: [
            "Everything in Pro",
            "5 team members",
            "Custom domain",
            "API access",
            "Bulk link shortening",
            "White-label reports",
            "Dedicated account manager",
        ],
        cta: "Contact Sales",
        highlighted: false,
    },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "Litbee replaced three tools for us. GA-style analytics, branded links, and QR codes — all in one clean dashboard. We saved hours every week.",
        name: "Priya Mehta",
        role: "Growth Lead @ Startify",
        avatar: "P",
        rating: 5,
    },
    {
        quote: "I use it for every YouTube video bio link. The custom slugs make my brand look pro, and seeing real-time clicks is super motivating.",
        name: "Arjun Singh",
        role: "Content Creator, 450K followers",
        avatar: "A",
        rating: 5,
    },
    {
        quote: "The geo-targeting feature alone is worth the Pro plan. We redirect users to region-specific pages and saw a 34% uplift in conversions.",
        name: "Sneha Rao",
        role: "PPC Manager @ DigitalFirst",
        avatar: "S",
        rating: 5,
    },
    {
        quote: "Clean UI, fast as lightning, and the API is dead simple to integrate. We shortened 50K+ links last month without a single hiccup.",
        name: "Dev Kapoor",
        role: "CTO @ LinkStack",
        avatar: "D",
        rating: 5,
    },
];

export const FAQS: FaqEntry[] = [
    {
        q: "Is Litbee really free?",
        a: "Yes! Litbee's Free plan is free forever with no credit card required. You get 20 short links per month with basic analytics. Upgrade to Pro or Business when you need more.",
    },
    {
        q: "Do my links expire?",
        a: "On the Free plan, links are active for 7 days from creation. On Pro and Business, links are permanent unless you manually set an expiry date.",
    },
    {
        q: "Can I use my own domain?",
        a: "Custom domains are available on the Business plan. You can connect any domain you own, and all your links will use that domain (e.g., go.yourbrand.com).",
    },
    {
        q: "Is there an API?",
        a: "Yes! Business plan users get full API access to programmatically create, manage, and retrieve links and analytics data. Documentation is available in your dashboard.",
    },
    {
        q: "How accurate are the analytics?",
        a: "Very accurate. We track unique vs. total clicks, device/browser types, geographic locations (country & city), referrer sources, and time-series data — all updated in real time.",
    },
    {
        q: "Are short links safe?",
        a: "Yes. All links go through a safety check powered by Safe Browsing APIs. We also provide password protection for sensitive links and you can deactivate any link instantly.",
    },
];
