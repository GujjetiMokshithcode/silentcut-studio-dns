'use client';

import { useState } from 'react';
import { FileAudio, Sparkles, Download, ArrowRight, Volume2, VolumeX, Play, Pause, Wand2 } from 'lucide-react';

// Waveform data for visualization
const rawWaveform = [40, 65, 50, 80, 15, 10, 8, 12, 15, 70, 55, 85, 60, 45, 10, 8, 10, 12, 75, 50, 65, 45, 80, 55, 70, 60, 8, 10, 12, 65];
const cleanWaveform = [40, 65, 50, 80, 70, 55, 85, 60, 45, 75, 50, 65, 45, 80, 55, 70, 60, 65, 55, 75];

const steps = [
    {
        number: '01',
        icon: FileAudio,
        title: 'Drop your file',
        description: 'Drag any audio file into the browser. We support MP3, WAV, M4A, OGG and more.',
        accent: 'from-blue-500/20 to-transparent',
    },
    {
        number: '02',
        icon: Wand2,
        title: 'Detect unnatural pauses',
        description: 'Our algorithm finds the unnatural gaps AI voices insert—the ones that make them sound robotic.',
        accent: 'from-purple-500/20 to-transparent',
    },
    {
        number: '03',
        icon: Download,
        title: 'Download perfection',
        description: 'Preview the result, then export in your preferred format. Done in seconds.',
        accent: 'from-green-500/20 to-transparent',
    },
];

export function HowItWorks() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeStep, setActiveStep] = useState<number | null>(null);

    return (
        <section id="how-it-works" className="py-32 relative overflow-hidden noise">
            {/* Enhanced Background */}
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] radial-gradient opacity-30" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-white/[0.03] to-transparent rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gradient-radial from-white/[0.03] to-transparent rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${4 + i}s`,
                        }}
                    />
                ))}
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6 animate-on-load animate-fade-in-down delay-100">
                        <Sparkles className="w-4 h-4 animate-pulse-soft" />
                        Simple 3-step workflow
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-on-load animate-fade-in-up delay-200">
                        From <span className="gradient-text">robotic</span> to <span className="gradient-text">natural</span>
                    </h2>
                    <p className="text-lg text-white/50 max-w-xl mx-auto animate-on-load animate-fade-in-up delay-300">
                        Make AI-generated voices sound human in under a minute
                    </p>
                </div>

                {/* Interactive Before/After Visualization */}
                <div className="max-w-5xl mx-auto mb-24">
                    <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 overflow-hidden animate-on-load animate-scale-in delay-400">
                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-white/10 rounded-tl-3xl" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-white/10 rounded-br-3xl" />

                        {/* Labels */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <VolumeX className="w-5 h-5 text-red-400/80" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white/90">Original Audio</p>
                                    <p className="text-xs text-white/40">AI voice with unnatural gaps</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                <span className="text-sm text-white/50">2:34</span>
                                <ArrowRight className="w-4 h-4 text-white/30" />
                                <span className="text-sm text-green-400/80 font-medium">2:16</span>
                                <span className="text-xs text-white/30 ml-1">(-18s)</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="font-semibold text-white/90 text-right">Cleaned Audio</p>
                                    <p className="text-xs text-white/40 text-right">Sounds natural now</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                    <Volume2 className="w-5 h-5 text-green-400/80" />
                                </div>
                            </div>
                        </div>

                        {/* Waveform comparison */}
                        <div className="relative">
                            {/* Before waveform */}
                            <div className="flex items-end justify-center gap-[3px] h-24 mb-4">
                                {rawWaveform.map((h, i) => {
                                    const isSilence = h < 20;
                                    return (
                                        <div
                                            key={`before-${i}`}
                                            className={`w-2 md:w-2.5 rounded-sm transition-all duration-300 ${isSilence
                                                ? 'bg-red-500/50'
                                                : 'bg-white/30'
                                                }`}
                                            style={{ height: `${h}%` }}
                                        />
                                    );
                                })}
                            </div>

                            {/* Transformation arrow */}
                            <div className="flex items-center justify-center gap-4 my-6">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20" />
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all hover:scale-105 active:scale-95"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-6 h-6 text-white/80" />
                                    ) : (
                                        <Play className="w-6 h-6 text-white/80 ml-1" />
                                    )}
                                </button>
                                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20" />
                            </div>

                            {/* After waveform */}
                            <div className="flex items-end justify-center gap-[3px] h-24">
                                {cleanWaveform.map((h, i) => (
                                    <div
                                        key={`after-${i}`}
                                        className="w-2 md:w-2.5 rounded-sm bg-gradient-to-t from-green-500/40 via-green-400/50 to-green-300/60"
                                        style={{
                                            height: `${h}%`,
                                            animationName: isPlaying ? 'equalize' : 'none',
                                            animationDuration: '1.2s',
                                            animationTimingFunction: 'ease-in-out',
                                            animationIterationCount: 'infinite',
                                            animationDelay: `${i * 0.05}s`,
                                            transformOrigin: 'bottom',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-8 mt-6 text-xs text-white/40">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-white/30" />
                                <span>Audio</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-red-500/50" />
                                <span>Detected silence</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-gradient-to-t from-green-500/40 to-green-300/60" />
                                <span>Cleaned result</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps - Enhanced Cards */}
                <div className="relative">
                    {/* Connecting line with glow */}
                    <div className="hidden lg:block absolute top-32 left-0 right-0 h-px">
                        <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {steps.map(({ number, icon: Icon, title, description, accent }, index) => (
                            <div
                                key={number}
                                className="relative group animate-on-load animate-fade-in-up"
                                style={{ animationDelay: `${0.5 + index * 0.15}s` }}
                                onMouseEnter={() => setActiveStep(index)}
                                onMouseLeave={() => setActiveStep(null)}
                            >
                                {/* Step number circle */}
                                <div className={`hidden lg:flex absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 items-center justify-center z-10 transition-all duration-300 ${activeStep === index ? 'border-white/60 scale-110' : 'border-white/20'
                                    }`}>
                                    <span className={`text-sm font-bold transition-colors ${activeStep === index ? 'text-white' : 'text-white/60'}`}>{number}</span>
                                </div>

                                <div className={`h-full p-8 rounded-3xl bg-white/[0.02] border transition-all duration-300 relative overflow-hidden ${activeStep === index
                                    ? 'border-white/30 bg-white/[0.05] translate-y-[-8px]'
                                    : 'border-white/10 hover:border-white/20'
                                    }`}>
                                    {/* Accent gradient on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="relative">
                                        {/* Icon */}
                                        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300 ${activeStep === index
                                            ? 'bg-white/15 border-white/30'
                                            : 'bg-white/5 border-white/10'
                                            }`}>
                                            <Icon className={`w-7 h-7 transition-colors ${activeStep === index ? 'text-white' : 'text-white/60'}`} />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold mb-3">{title}</h3>
                                        <p className="text-sm text-white/50 leading-relaxed">{description}</p>
                                    </div>

                                    {/* Decorative number */}
                                    <div className="absolute bottom-4 right-4 text-7xl font-black text-white/[0.03] select-none">
                                        {number}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Stats */}
                <div className="mt-24 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { value: '< 1min', label: 'Average processing time', icon: '⚡' },
                            { value: '99.2%', label: 'Silence detection accuracy', icon: '🎯' },
                            { value: '6+', label: 'Export formats', icon: '📦' },
                        ].map(({ value, label, icon }, i) => (
                            <div key={label} className="animate-on-load animate-fade-in-up" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
                                <span className="text-2xl mb-2 block">{icon}</span>
                                <p className="text-4xl font-bold mb-2 gradient-text">{value}</p>
                                <p className="text-sm text-white/40">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
