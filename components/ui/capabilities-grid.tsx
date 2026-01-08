"use client";

import { useState, useEffect } from "react";
import { Zap, Shield, Volume2, Wand2, Download, Clock } from "lucide-react";
import { motion } from "framer-motion";

// Different visual effects for each capability
const effects = {
    scanlines: "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] before:pointer-events-none before:rounded-2xl",
    grid: "before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] before:bg-[size:24px_24px] before:pointer-events-none before:rounded-2xl",
    dots: "before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] before:bg-[size:16px_16px] before:pointer-events-none before:rounded-2xl",
    vignette: "after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] after:pointer-events-none after:rounded-2xl",
    diagonal: "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.015)_10px,rgba(255,255,255,0.015)_20px)] before:pointer-events-none before:rounded-2xl",
    noise: "after:absolute after:inset-0 after:opacity-30 after:pointer-events-none after:rounded-2xl after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]",
};

// Animated waveform bars
function WaveformBars() {
    const [bars, setBars] = useState(Array(12).fill(0.3));

    useEffect(() => {
        const interval = setInterval(() => {
            setBars(prev => prev.map(() => 0.2 + Math.random() * 0.8));
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-end justify-center h-16 gap-1">
            {bars.map((height, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-white/30 rounded-full"
                    animate={{ height: `${height * 100}%` }}
                    transition={{ duration: 0.15 }}
                />
            ))}
        </div>
    );
}

// Animated shield pulse
function ShieldPulse() {
    return (
        <div className="relative flex items-center justify-center h-16">
            <Shield className="w-10 h-10 text-white/40 relative z-10" />
            <motion.div
                className="absolute w-16 h-16 border border-white/10 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
                className="absolute w-12 h-12 border border-white/20 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
        </div>
    );
}

export function CapabilitiesGrid() {
    return (
        <section className="w-full bg-black py-32 px-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-4">
                        [ Capabilities ]
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white/90">
                        Everything you need to perfect audio
                    </h2>
                </div>

                {/* Grid - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Card 1: AI Detection */}
                    <motion.div
                        className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 min-h-[280px] overflow-hidden group cursor-pointer ${effects.scanlines}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
                    >
                        {/* Corner brackets */}
                        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-white/10 group-hover:border-white/30 transition-colors" />
                        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-white/10 group-hover:border-white/30 transition-colors" />
                        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-white/10 group-hover:border-white/30 transition-colors" />
                        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-white/10 group-hover:border-white/30 transition-colors" />

                        <Wand2 className="absolute right-6 bottom-6 w-24 h-24 text-white/[0.03]" />

                        <div className="mb-6">
                            <WaveformBars />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10">
                                    <Wand2 className="h-6 w-6 text-white/70" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-medium text-white/90">AI Detection</h3>
                            </div>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Intelligent pause detection that identifies unnatural silences in your audio with precision.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 2: 100% Private */}
                    <motion.div
                        className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 min-h-[280px] overflow-hidden group cursor-pointer ${effects.vignette}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
                    >
                        {/* Corner brackets */}
                        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-white/10 group-hover:border-white/30 transition-colors" />
                        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-white/10 group-hover:border-white/30 transition-colors" />
                        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-white/10 group-hover:border-white/30 transition-colors" />
                        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-white/10 group-hover:border-white/30 transition-colors" />

                        <div className="mb-6">
                            <ShieldPulse />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10">
                                    <Shield className="h-6 w-6 text-white/70" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-medium text-white/90">100% Private</h3>
                            </div>
                            <p className="text-white/40 text-sm leading-relaxed">
                                All processing happens in your browser. Your audio never leaves your device.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Grid - Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Card 3: Waveform Analysis */}
                    <motion.div
                        className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 min-h-[180px] overflow-hidden group cursor-pointer ${effects.grid}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
                    >
                        <div className="relative z-10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 mb-4">
                                <Volume2 className="h-6 w-6 text-white/70" />
                            </div>
                            <h3 className="text-lg font-medium text-white/90 mb-2">Waveform Analysis</h3>
                            <p className="text-white/40 text-sm">Visual audio analysis that scans every millisecond.</p>
                        </div>
                        <motion.div
                            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>

                    {/* Card 4: Lightning Fast */}
                    <motion.div
                        className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 min-h-[180px] overflow-hidden group cursor-pointer ${effects.dots}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
                    >
                        <div className="relative z-10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 mb-4">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Zap className="h-6 w-6 text-white/70" />
                                </motion.div>
                            </div>
                            <h3 className="text-lg font-medium text-white/90 mb-2">Lightning Fast</h3>
                            <p className="text-white/40 text-sm">Process hours of audio in seconds.</p>
                        </div>
                        <div className="absolute bottom-4 right-4 font-mono text-2xl text-white/10">&lt;2s</div>
                    </motion.div>

                    {/* Card 5: Multiple Formats */}
                    <motion.div
                        className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 min-h-[180px] overflow-hidden group cursor-pointer ${effects.diagonal}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
                    >
                        <div className="relative z-10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 mb-4">
                                <Download className="h-6 w-6 text-white/70" />
                            </div>
                            <h3 className="text-lg font-medium text-white/90 mb-2">Multiple Formats</h3>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {['MP3', 'WAV', 'AAC', 'FLAC'].map((fmt) => (
                                    <span key={fmt} className="px-2 py-1 text-xs font-mono bg-white/[0.05] border border-white/10 rounded text-white/50">
                                        {fmt}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Grid - Row 3: Full width */}
                <motion.div
                    className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 min-h-[120px] overflow-hidden group cursor-pointer ${effects.noise}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
                >
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 shrink-0">
                            <Clock className="h-6 w-6 text-white/70" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-medium text-white/90">Batch Processing</h3>
                                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-white/10 border border-white/20 rounded-full text-white/60">
                                    Pro
                                </span>
                            </div>
                            <p className="text-white/40 text-sm">Process multiple files at once. Perfect for podcast series, audiobooks, and course content.</p>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-8 bg-white/10 rounded-sm"
                                animate={{ height: ['32px', '16px', '32px'] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

export default CapabilitiesGrid;
