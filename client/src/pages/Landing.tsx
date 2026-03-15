import { Link } from "react-router-dom";
import {
    ShieldCheck, Zap, BarChart3,
    Twitter, Github, Linkedin, ChevronDown
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { HexGrid } from "@/components/shared/HexGrid";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";
import { UrlShortener } from "@/components/shared/UrlShortener";
import { DashboardMockup } from "@/components/shared/DashboardMockup";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { StepCard } from "@/components/landing/StepCard";
import { TestimonialCard } from "@/components/landing/TestimonialCard";
import { ReviewAvatars } from "@/components/landing/ReviewAvatars";
import { Accordion } from "@/components/ui/accordion";
import { FaqItem } from "@/components/landing/FaqItem";
import { FEATURES, STEPS, TESTIMONIALS, FAQS } from "@/data/landingData";

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#F5F5F5] text-gray-900 overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Navbar />

            <section className="relative min-h-[100vh] flex items-center pt-24 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <HexGrid className="absolute left-0 top-16 w-76 opacity-30 text-amber-400" />
                    <HexGrid className="absolute right-0 bottom-0 w-64 opacity-33 text-amber-400 rotate-12" />
                    <div className="absolute top-1/4 left-2/5 w-96 h-96 bg-amber-500/11 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-7">
                        <div className="flex items-center gap-6 pt-6">
                            <ReviewAvatars />
                            <p className="text-sm text-gray-500">
                                <span className="text-gray-900 font-semibold">4.9 ★</span> rated by 2,000+ reviews
                            </p>
                        </div>

                        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight">
                            Shorten Links,<br />
                            <span className="text-amber-500">Simplify Sharing.</span>
                        </h1>

                        <p className="text-gray-600 text-lg !text-[16px] font-semibold flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-amber-500" />
                            Trackable URL Shortener with Analytics
                        </p>

                        <UrlShortener />

                        <div className="flex items-center gap-6 pt-2 font-medium">
                            <span className="text-gray-600 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Instant</span>
                            <span className="text-gray-600 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-500" /> Secure</span>
                            <span className="text-gray-600 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-amber-500" /> Analytics</span>
                        </div>


                    </div>

                    <div className="flex hidden lg:flex justify-center lg:justify-end">
                        <DashboardMockup />
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 animate-bounce">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </section>

            <section id="features" className="py-24 px-6 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
                        <h2 className="text-4xl lg:text-5xl font-black mb-4 text-gray-900">
                            Everything you need to<br /><span className="text-amber-400">manage your links</span>
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
                            From one-click shortening to enterprise-grade analytics — Litbee has every tool a modern marketer or developer needs.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-amber-400/20 to-transparent" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
                        <h2 className="text-4xl lg:text-5xl font-black mb-4 text-gray-900">
                            Shorten in <span className="text-amber-400">4 simple steps</span>
                        </h2>
                        <p className="text-gray-600 max-w-lg mx-auto">
                            No learning curve. No complicated setup. Start shortening your first link in under 30 seconds.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                        <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                        {STEPS.map((step) => <StepCard key={step.number} {...step} />)}
                    </div>
                </div>
            </section>


            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
                        <h2 className="text-4xl lg:text-5xl font-black mb-4 text-gray-900">
                            Loved by <span className="text-amber-400">thousands</span>
                        </h2>
                        <div className="flex justify-center mb-6 scale-110">
                            <ReviewAvatars />
                        </div>
                        <p className="text-gray-600 max-w-lg mx-auto">
                            Real feedback from real users — marketers, creators, and developers who rely on Litbee daily.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {TESTIMONIALS.map((t) => <TestimonialCard key={t.name} {...t} />)}
                    </div>
                </div>
            </section>

            <section id="faq" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white rounded-l-[4rem] shadow-[inset_10px_0_20px_rgba(0,0,0,0.02)] hidden lg:block" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
                        <div className="lg:col-span-5 lg:sticky lg:top-32">
                            <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
                            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-gray-900">
                                Common <br />
                                <span className="text-amber-400">Questions.</span>
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg">
                                Everything you need to know about the product and billing. Can't find the answer you're looking for?
                            </p>
                            <a href="mailto:support@litbee.com" className="inline-flex items-center gap-2 font-semibold text-gray-900 bg-white border border-gray-200 px-6 py-3 rounded-full hover:border-amber-400 hover:text-amber-500 transition-colors shadow-sm">
                                Contact Support
                            </a>
                        </div>
                        <div className="lg:col-span-7 space-y-4">
                            <Accordion type="single" collapsible className="w-full space-y-3">
                                {FAQS.map((faq, index) => (
                                    <FaqItem key={faq.q} q={faq.q} a={faq.a} value={`item-${index}`} />
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-gray-200 bg-white pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-5 gap-10 mb-12">
                        <div className="md:col-span-2">
                            <Link to="/" className="flex items-center gap-2.5 mb-4">
                                <LitbeeLogo size={30} />
                                <span className="text-amber-400 font-black text-lg">Litbee</span>
                            </Link>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                                The fast, smart URL shortener trusted by creators, marketers, and developers worldwide.
                            </p>
                            <div className="flex items-center gap-3 mt-5">
                                {[Twitter, Github, Linkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {[
                            { title: "Product", links: ["Features", "Changelog", "Roadmap", "API Docs"] },
                            { title: "Company", links: ["About", "Blog", "Careers", "Press Kit", "Contact"] },
                            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"] },
                        ].map(({ title, links }) => (
                            <div key={title}>
                                <p className="text-gray-900 font-bold text-sm mb-4">{title}</p>
                                <ul className="space-y-2.5">
                                    {links.map((l) => (
                                        <li key={l}><a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-gray-600 text-sm">© 2025 Litbee. All rights reserved.</p>
                        <p className="text-gray-600 text-sm flex items-center gap-1">Made with <span className="text-amber-400">♥</span> in India</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
