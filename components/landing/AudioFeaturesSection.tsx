'use client';

import { ScannerCardStream } from "@/components/ui/scanner-card-stream";

// Audio waveform feature images - generated waveform patterns
const featureImages = [
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=250&fit=crop&q=80", // Audio waves
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=250&fit=crop&q=80", // Studio
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop&q=80", // Microphone
    "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=250&fit=crop&q=80", // Podcast
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=250&fit=crop&q=80", // Recording
];

const features = [
    { title: "AI Detection", description: "Identifies unnatural pauses instantly" },
    { title: "Batch Processing", description: "Process multiple files at once" },
    { title: "Preserve Quality", description: "Lossless audio processing" },
    { title: "Fast Export", description: "Download in any format" },
];

export function AudioFeaturesSection() {
    return (
        <section className="relative bg-black py-24 overflow-hidden">
            {/* Top gradient for transition */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent z-10" />

            {/* Section Header */}
            <div className="max-w-4xl mx-auto px-6 mb-16 text-center relative z-10">
                <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-white/30 mb-4">
                    What we do
                </p>
                <h2 className="text-3xl md:text-5xl font-medium text-white/80 mb-4">
                    Audio that flows naturally
                </h2>
                <p className="text-lg text-white/40 max-w-2xl mx-auto">
                    SilentCut scans your audio, detects awkward gaps, and removes them — leaving you with professional, human-sounding narration.
                </p>
            </div>

            {/* Scanner Card Stream */}
            <div className="relative z-0">
                <ScannerCardStream
                    cardImages={featureImages}
                    initialSpeed={100}
                    direction={-1}
                    repeat={4}
                    cardGap={40}
                    friction={0.92}
                    scanEffect="scramble"
                />
            </div>

            {/* Feature Pills */}
            <div className="max-w-4xl mx-auto px-6 mt-16">
                <div className="flex flex-wrap justify-center gap-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center px-6 py-4 bg-white/[0.03] border border-white/[0.06] rounded-xl backdrop-blur-sm"
                        >
                            <span className="text-white/70 font-medium text-sm">{feature.title}</span>
                            <span className="text-white/30 text-xs mt-1">{feature.description}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </section>
    );
}
