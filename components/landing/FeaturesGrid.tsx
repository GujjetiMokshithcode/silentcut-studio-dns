'use client';

import { Volume2, Zap, Music, Clock, Play, Sliders, Headphones, FileAudio, Shield, Mic } from 'lucide-react';

// Waveform data
const waveformHeights = [35, 55, 45, 70, 40, 60, 50, 75, 35, 55, 65, 45, 70, 50, 60, 40, 25, 30, 25, 30, 25, 35, 55, 45, 70, 40, 60, 50, 75, 35];

export function FeaturesGrid() {
    return (
        <section id="features" className="py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6 animate-on-load animate-fade-in-down delay-100">
                        <Headphones className="w-4 h-4" />
                        Built for AI Voice
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-on-load animate-fade-in-up delay-200">Perfect your AI voiceovers</h2>
                    <p className="text-white/50 max-w-lg mx-auto animate-on-load animate-fade-in-up delay-300">AI voices have a pause problem. SilentCut fixes it with surgical precision.</p>
                </div>

                {/* Bento Grid */}
                <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[180px]">

                    {/* Hero Card - Waveform Visualization */}
                    <div className="md:col-span-4 lg:col-span-4 row-span-2 p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden group animate-on-load animate-fade-in-up delay-100">
                        {/* Decorative corner glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                                        <Volume2 className="w-6 h-6 text-white/80" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Real-time waveform visualization</h3>
                                    <p className="text-white/50 max-w-sm">See exactly where AI inserts unnatural pauses. Preview each one and choose what to remove.</p>
                                </div>
                                <div className="hidden md:block text-right">
                                    <span className="text-xs text-white/30 font-mono">INTERACTIVE</span>
                                </div>
                            </div>

                            {/* Animated Waveform */}
                            <div className="h-28 rounded-2xl bg-black/40 border border-white/10 p-4 flex items-end justify-center gap-0.5 relative overflow-hidden">
                                {/* Playhead */}
                                <div
                                    className="absolute top-4 bottom-4 w-0.5 bg-white/70 rounded-full z-10"
                                    style={{ left: '30%', animation: 'playhead 5s linear infinite' }}
                                />

                                {waveformHeights.map((h, i) => {
                                    const isPause = i > 10 && i < 15;
                                    return (
                                        <div
                                            key={i}
                                            className={`flex-1 max-w-2 rounded-full ${isPause ? 'bg-red-500/40' : 'bg-gradient-to-t from-white/30 to-white/60'}`}
                                            style={{
                                                height: isPause ? '15%' : `${h}%`,
                                                animation: isPause ? 'none' : 'equalize 1.5s ease-in-out infinite',
                                                animationDelay: `${i * 0.05}s`,
                                                transformOrigin: 'bottom',
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            {/* Mini stats */}
                            <div className="flex items-center gap-6 mt-4">
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-white/60" />
                                    <span className="text-white/40">Audio</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                                    <span className="text-white/40">Silence (will be removed)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Speed Card */}
                    <div className="md:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all group animate-on-load animate-fade-in-up delay-200">
                        <div className="flex items-center justify-between mb-auto">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <Zap className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold">10x</span>
                                <span className="text-xs text-white/40 block">faster</span>
                            </div>
                        </div>
                        <h4 className="font-bold mt-4 mb-1">Lightning speed</h4>
                        <p className="text-sm text-white/50">WebAssembly-powered processing. Hours of audio in seconds.</p>
                    </div>

                    {/* Formats Card */}
                    <div className="md:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all group animate-on-load animate-fade-in-up delay-300">
                        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                            <Music className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                        </div>
                        <h4 className="font-bold mb-1">Multiple formats</h4>
                        <p className="text-sm text-white/50 mb-3">Export to any format you need.</p>
                        <div className="flex flex-wrap gap-1.5">
                            {['MP3', 'WAV', 'M4A', 'OGG'].map(fmt => (
                                <span key={fmt} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-white/50">{fmt}</span>
                            ))}
                        </div>
                    </div>

                    {/* Threshold Card */}
                    <div className="md:col-span-2 lg:col-span-3 p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all group animate-on-load animate-fade-in-up delay-400">
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                <Sliders className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                            </div>
                            <div>
                                <h4 className="font-bold mb-1">Fine-tune sensitivity</h4>
                                <p className="text-sm text-white/50">Adjust threshold and minimum pause duration. Catch every pause or just the long ones.</p>
                            </div>
                        </div>
                        {/* Visual slider */}
                        <div className="mt-4 h-2 rounded-full bg-white/10 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-2/3 rounded-full bg-gradient-to-r from-white/30 to-white/50" />
                            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-black" style={{ left: 'calc(66% - 8px)' }} />
                        </div>
                    </div>

                    {/* Preview Card */}
                    <div className="md:col-span-2 lg:col-span-3 p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all group animate-on-load animate-fade-in-up delay-500">
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                <Play className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold mb-1">Preview before export</h4>
                                <p className="text-sm text-white/50">Listen to the cleaned result before downloading. Hear exactly what you'll get.</p>
                            </div>
                        </div>
                        {/* Play button visual */}
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Play className="w-4 h-4 text-white/70 ml-0.5" />
                            </div>
                            <div className="flex-1 h-1 rounded-full bg-white/10">
                                <div className="w-1/3 h-full rounded-full bg-white/40" />
                            </div>
                            <span className="text-xs text-white/40 font-mono">1:24</span>
                        </div>
                    </div>

                </div>

                {/* Bottom badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
                    {[
                        { icon: Shield, text: '100% Private' },
                        { icon: FileAudio, text: 'All formats supported' },
                        { icon: Mic, text: 'ElevenLabs, PlayHT & more' },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 text-sm text-white/50">
                            <Icon className="w-4 h-4" />
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
