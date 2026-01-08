'use client';

import { FileAudio, Clock, Shield } from 'lucide-react';

const stats = [
    { value: '10,000+', label: 'Files processed', icon: FileAudio, delay: 'delay-100' },
    { value: '500+', label: 'Hours of silence removed', icon: Clock, delay: 'delay-200' },
    { value: '0', label: 'Files uploaded to servers', icon: Shield, delay: 'delay-300' },
];

export function StatsSection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 grid-pattern opacity-10" />

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative">
                <div className="grid md:grid-cols-3 gap-8">
                    {stats.map(({ value, label, icon: Icon, delay }, index) => (
                        <div
                            key={label}
                            className={`text-center p-8 rounded-3xl glass hover-lift hover-glow animate-on-load animate-fade-in-up ${delay}`}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/10 transition-colors animate-subtle-bounce" style={{ animationDelay: `${index * 0.3}s` }}>
                                <Icon className="w-6 h-6 text-white/60" />
                            </div>
                            <p className="text-5xl font-bold mb-2 gradient-text">{value}</p>
                            <p className="text-sm text-white/50">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
