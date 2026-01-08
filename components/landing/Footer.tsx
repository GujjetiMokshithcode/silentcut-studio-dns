'use client';

import Link from 'next/link';
import { Scissors } from 'lucide-react';

const footerLinks = {
    product: [
        { label: 'Features', href: '/#features' },
        { label: 'How it works', href: '/#how-it-works' },
        { label: 'Privacy', href: '/#privacy' },
    ],
    legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
    ],
};

export function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <Scissors className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold">SilentCut</span>
                        </Link>
                        <p className="text-white/50 text-sm max-w-xs">
                            Remove dead air from your audio files instantly.
                            100% private, runs entirely in your browser.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white/80">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-white/50 hover:text-white/80 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white/80">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-white/50 hover:text-white/80 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/40">
                        © {new Date().getFullYear()} SilentCut. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-white/40">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500/60 animate-pulse" />
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
