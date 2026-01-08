'use client';

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Shield, Volume2, Wand2, Clock, Download } from "lucide-react"

// Waveform Animation
function WaveformAnimation() {
    const [bars, setBars] = useState(Array(20).fill(0.3))

    useEffect(() => {
        const interval = setInterval(() => {
            setBars(prev => prev.map(() => 0.2 + Math.random() * 0.8))
        }, 150)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-end justify-center h-full gap-1">
            {bars.map((height, i) => (
                <motion.div
                    key={i}
                    className="w-1.5 bg-white/60 rounded-full"
                    animate={{ height: `${height * 100}%` }}
                    transition={{ duration: 0.15 }}
                />
            ))}
        </div>
    )
}

// Pause Detection Animation
function PauseDetection() {
    const [phase, setPhase] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(prev => (prev + 1) % 3)
        }, 1500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-center justify-center h-full gap-2">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={`w-16 h-8 rounded flex items-center justify-center ${phase === i ? 'bg-red-500/30 border border-red-500/50' : 'bg-white/10'
                        }`}
                    animate={{
                        scale: phase === i ? [1, 1.05, 1] : 1,
                        opacity: phase === i ? 1 : 0.5
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {phase === i && (
                        <motion.span
                            className="text-xs text-red-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            PAUSE
                        </motion.span>
                    )}
                </motion.div>
            ))}
        </div>
    )
}

// Speed Indicator
function SpeedIndicator() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="h-10 flex items-center justify-center overflow-hidden relative w-full">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loader"
                            className="h-8 w-24 bg-white/10 rounded"
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    ) : (
                        <motion.span
                            key="text"
                            initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            className="text-3xl md:text-4xl font-sans font-medium text-white"
                        >
                            &lt;2s
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
            <span className="text-sm text-gray-400">Processing Time</span>
            <div className="w-full max-w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: loading ? 0 : "100%" }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
                />
            </div>
        </div>
    )
}

// Privacy Shield
function PrivacyShield() {
    const [shields, setShields] = useState([
        { id: 1, active: false },
        { id: 2, active: false },
        { id: 3, active: false }
    ])

    useEffect(() => {
        const interval = setInterval(() => {
            setShields(prev => {
                const nextIndex = prev.findIndex(s => !s.active)
                if (nextIndex === -1) {
                    return prev.map(() => ({ id: Math.random(), active: false }))
                }
                return prev.map((s, i) => i === nextIndex ? { ...s, active: true } : s)
            })
        }, 800)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-center justify-center h-full gap-2">
            {shields.map((shield) => (
                <motion.div
                    key={shield.id}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${shield.active ? 'bg-white/20' : 'bg-white/5'
                        }`}
                    animate={{ scale: shield.active ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Shield className={`w-5 h-5 ${shield.active ? 'text-white' : 'text-gray-600'}`} />
                </motion.div>
            ))}
        </div>
    )
}

// Export Formats
function ExportFormats() {
    const formats = ['MP3', 'WAV', 'AAC', 'FLAC']
    const [active, setActive] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setActive(prev => (prev + 1) % formats.length)
        }, 1200)
        return () => clearInterval(interval)
    }, [formats.length])

    return (
        <div className="flex items-center justify-center h-full gap-3">
            {formats.map((format, i) => (
                <motion.div
                    key={format}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${active === i ? 'bg-white text-black' : 'bg-white/10 text-white/50'
                        }`}
                    animate={{ scale: active === i ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {format}
                </motion.div>
            ))}
        </div>
    )
}

export function BentoFeaturesGrid() {
    return (
        <section className="bg-black px-6 py-12 pt-0">
            <div className="max-w-6xl w-full mx-auto">
                <motion.p
                    className="text-white/40 text-xs uppercase tracking-[0.25em] mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Features
                </motion.p>

                <motion.h2
                    className="text-3xl md:text-4xl text-white/90 font-medium mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Built for audio perfection
                </motion.h2>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[180px]">

                    {/* 1. Waveform - Tall (2x2) */}
                    <motion.div
                        className="md:col-span-2 md:row-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col hover:border-white/[0.12] transition-colors cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex-1">
                            <WaveformAnimation />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg text-white font-medium flex items-center gap-2">
                                <Volume2 className="w-4 h-4" />
                                Audio Analysis
                            </h3>
                            <p className="text-white/40 text-sm mt-1">Intelligent waveform scanning detects every pause.</p>
                        </div>
                    </motion.div>

                    {/* 2. Pause Detection - Standard (2x1) */}
                    <motion.div
                        className="md:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col hover:border-white/[0.12] transition-colors cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 0.98 }}
                    >
                        <div className="flex-1">
                            <PauseDetection />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg text-white font-medium flex items-center gap-2">
                                <Wand2 className="w-4 h-4" />
                                Smart Detection
                            </h3>
                            <p className="text-white/40 text-sm mt-1">AI finds unnatural pauses.</p>
                        </div>
                    </motion.div>

                    {/* 3. Speed - Tall (2x2) */}
                    <motion.div
                        className="md:col-span-2 md:row-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col hover:border-white/[0.12] transition-colors cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex-1 flex items-center justify-center">
                            <SpeedIndicator />
                        </div>
                        <div className="mt-auto">
                            <h3 className="text-lg text-white flex items-center gap-2 font-medium">
                                <Zap className="w-4 h-4" />
                                Lightning Fast
                            </h3>
                            <p className="text-white/40 text-sm mt-1">Process hours of audio in seconds.</p>
                        </div>
                    </motion.div>

                    {/* 4. Privacy - Standard (2x1) */}
                    <motion.div
                        className="md:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col hover:border-white/[0.12] transition-colors cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 0.98 }}
                    >
                        <div className="flex-1">
                            <PrivacyShield />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg text-white font-medium flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                100% Private
                            </h3>
                            <p className="text-white/40 text-sm mt-1">All processing in browser.</p>
                        </div>
                    </motion.div>

                    {/* 5. Export - Wide (3x1) */}
                    <motion.div
                        className="md:col-span-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col hover:border-white/[0.12] transition-colors cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 0.98 }}
                    >
                        <div className="flex-1">
                            <ExportFormats />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg text-white flex items-center gap-2 font-medium">
                                <Download className="w-4 h-4" />
                                Multiple Formats
                            </h3>
                            <p className="text-white/40 text-sm mt-1">Export to MP3, WAV, AAC, FLAC and more.</p>
                        </div>
                    </motion.div>

                    {/* 6. Batch Processing - Wide (3x1) */}
                    <motion.div
                        className="md:col-span-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col hover:border-white/[0.12] transition-colors cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 0.98 }}
                    >
                        <div className="flex-1 flex items-center justify-center">
                            <Clock className="w-16 h-16 text-white/60" />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg text-white font-medium">Batch Processing</h3>
                            <p className="text-white/40 text-sm mt-1">Process multiple files at once. Save hours of work.</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}

export default BentoFeaturesGrid
