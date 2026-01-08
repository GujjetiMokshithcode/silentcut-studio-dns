'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Zap, Check, Lock, Monitor, X, Cloud, Cpu, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const privacyFeatures = [
    { icon: Shield, text: 'No uploads', desc: 'Files never leave your browser' },
    { icon: Users, text: 'No accounts', desc: 'No sign-up required' },
    { icon: Zap, text: 'Works offline', desc: 'No internet needed' },
    { icon: Check, text: 'Open source', desc: 'Fully transparent code' },
];

// Animated data flow visualization
function DataFlowVisualization() {
    const [particles, setParticles] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev => {
                const newParticles = [...prev, Date.now()];
                return newParticles.slice(-8);
            });
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((id, i) => (
                <motion.div
                    key={id}
                    className="absolute w-1 h-1 bg-white/40 rounded-full"
                    initial={{ left: '10%', top: '20%', scale: 0 }}
                    animate={{
                        left: ['10%', '30%', '50%', '70%', '90%'],
                        top: ['20%', '40%', '35%', '45%', '80%'],
                        scale: [0, 1, 1, 1, 0],
                        opacity: [0, 0.6, 0.4, 0.2, 0]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        delay: i * 0.1
                    }}
                />
            ))}
        </div>
    );
}

// Animated circuit pattern
function CircuitPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M10 0v10h10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                    <circle cx="10" cy="10" r="1" fill="currentColor" className="text-white" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
    );
}

// Processing status indicator
function ProcessingIndicator() {
    return (
        <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className="w-1.5 h-6 bg-white/40 rounded-full"
                    animate={{
                        scaleY: [0.3, 1, 0.3],
                        opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.15
                    }}
                />
            ))}
        </div>
    );
}

export function PrivacySection() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="privacy" className="py-32 relative overflow-hidden bg-black">
            {/* Animated grid background */}
            <div className="absolute inset-0">
                {/* Base grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* Animated glowing grid nodes */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                                left: `${(i % 5) * 25 + 10}%`,
                                top: `${Math.floor(i / 5) * 25 + 10}%`,
                            }}
                            animate={{
                                opacity: [0.1, 0.4, 0.1],
                                scale: [1, 1.5, 1],
                                boxShadow: [
                                    '0 0 0px rgba(255,255,255,0)',
                                    '0 0 10px rgba(255,255,255,0.3)',
                                    '0 0 0px rgba(255,255,255,0)'
                                ]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            className="absolute w-px h-px bg-white/50"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                x: [0, Math.random() * 20 - 10, 0],
                                opacity: [0, 0.6, 0],
                            }}
                            transition={{
                                duration: 5 + Math.random() * 5,
                                repeat: Infinity,
                                delay: i * 0.5,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Moving horizontal scan line */}
                <motion.div
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Moving vertical scan line */}
                <motion.div
                    className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
                    animate={{ left: ['0%', '100%'] }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Corner brackets with pulse animation */}
                <motion.div
                    className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/10"
                    animate={{ borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)'] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/10"
                    animate={{ borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)'] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                    className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/10"
                    animate={{ borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)'] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                />
                <motion.div
                    className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/10"
                    animate={{ borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)'] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                />

                {/* Pulsing center glow */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 60%)'
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
            </div>

            <div className="w-full max-w-6xl mx-auto px-6 relative">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white/50 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Lock className="w-4 h-4" />
                        Privacy-first architecture
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className="text-white/90">Your audio never</span>
                        <br />
                        <span className="text-white/40">leaves your device</span>
                    </motion.h2>

                    <motion.p
                        className="text-white/40 text-lg max-w-xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Unlike cloud-based tools, SilentCut processes everything locally using WebAssembly. Zero data collection.
                    </motion.p>
                </div>

                {/* Main visualization */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left - Interactive flow diagram */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                            <DataFlowVisualization />

                            {/* Step 1: Your Device */}
                            <motion.div
                                className={`relative mb-4 p-5 rounded-2xl border transition-all duration-500 ${activeStep === 0
                                    ? 'bg-white/[0.08] border-white/20'
                                    : 'bg-white/[0.02] border-white/[0.06]'
                                    }`}
                                animate={{ scale: activeStep === 0 ? 1.02 : 1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${activeStep === 0 ? 'bg-white/20' : 'bg-white/10'
                                        }`}>
                                        <HardDrive className="w-7 h-7 text-white/80" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white/90">Your File</p>
                                        <p className="text-sm text-white/40">Stays on your device</p>
                                    </div>
                                    {activeStep === 0 && <ProcessingIndicator />}
                                </div>

                                {/* Animated border glow */}
                                {activeStep === 0 && (
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl border-2 border-white/20"
                                        animate={{ opacity: [0.5, 0.2, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}
                            </motion.div>

                            {/* Flow connector */}
                            <div className="flex justify-center my-2">
                                <motion.div
                                    className="w-px h-8 bg-gradient-to-b from-white/20 to-white/5"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>

                            {/* Step 2: Local Processing */}
                            <motion.div
                                className={`relative mb-4 p-5 rounded-2xl border transition-all duration-500 ${activeStep === 1
                                    ? 'bg-white/[0.08] border-white/20'
                                    : 'bg-white/[0.02] border-white/[0.06]'
                                    }`}
                                animate={{ scale: activeStep === 1 ? 1.02 : 1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${activeStep === 1 ? 'bg-white/20' : 'bg-white/10'
                                        }`}>
                                        <Cpu className="w-7 h-7 text-white/80" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white/90">WebAssembly Engine</p>
                                        <p className="text-sm text-white/40">Processing in browser</p>
                                    </div>
                                    {activeStep === 1 && <ProcessingIndicator />}
                                </div>

                                {activeStep === 1 && (
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl border-2 border-white/20"
                                        animate={{ opacity: [0.5, 0.2, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}
                            </motion.div>

                            {/* Flow connector */}
                            <div className="flex justify-center my-2">
                                <motion.div
                                    className="w-px h-8 bg-gradient-to-b from-white/20 to-white/5"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                />
                            </div>

                            {/* Step 3: Output */}
                            <motion.div
                                className={`relative p-5 rounded-2xl border transition-all duration-500 ${activeStep === 2
                                    ? 'bg-white/[0.08] border-white/20'
                                    : 'bg-white/[0.02] border-white/[0.06]'
                                    }`}
                                animate={{ scale: activeStep === 2 ? 1.02 : 1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${activeStep === 2 ? 'bg-white/20' : 'bg-white/10'
                                        }`}>
                                        <Monitor className="w-7 h-7 text-white/80" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white/90">Clean Audio</p>
                                        <p className="text-sm text-white/40">Ready for download</p>
                                    </div>
                                    {activeStep === 2 && (
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <Check className="w-5 h-5 text-white/80" />
                                        </div>
                                    )}
                                </div>

                                {activeStep === 2 && (
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl border-2 border-white/20"
                                        animate={{ opacity: [0.5, 0.2, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}
                            </motion.div>

                            {/* Cloud crossed out */}
                            <div className="mt-6 pt-6 border-t border-white/[0.06]">
                                <div className="flex items-center gap-4 opacity-30">
                                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center relative">
                                        <Cloud className="w-7 h-7 text-white/40" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-10 h-0.5 bg-white/40 rotate-45" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white/40 line-through">Cloud Servers</p>
                                        <p className="text-sm text-white/30">Not used — ever</p>
                                    </div>
                                    <WifiOff className="w-5 h-5 text-white/30" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Feature cards */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {privacyFeatures.map(({ icon: Icon, text, desc }, i) => (
                            <motion.div
                                key={text}
                                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer relative overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ x: 5 }}
                            >
                                {/* Hover gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <Icon className="w-6 h-6 text-white/60 group-hover:text-white/80 transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white/90 mb-1">{text}</h3>
                                        <p className="text-sm text-white/40">{desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/[0.06]">
                            {[
                                { value: '0', label: 'Data sent', icon: Wifi },
                                { value: '0', label: 'Servers', icon: Cloud },
                                { value: '∞', label: 'Privacy', icon: Shield },
                            ].map(({ value, label, icon: StatIcon }, i) => (
                                <motion.div
                                    key={label}
                                    className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                >
                                    <StatIcon className="w-5 h-5 text-white/30 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white/80">{value}</p>
                                    <p className="text-xs text-white/40">{label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom trust badges */}
                <motion.div
                    className="mt-20 flex flex-wrap items-center justify-center gap-8 text-sm text-white/30"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        End-to-end local processing
                    </span>
                    <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        No tracking or analytics
                    </span>
                    <span className="flex items-center gap-2">
                        <WifiOff className="w-4 h-4" />
                        Works without internet
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
