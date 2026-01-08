"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Mic, Video, BookOpen, GraduationCap, Film, Podcast } from "lucide-react"

// Different visual effects for each use case
const effects = {
    scanlines: "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)] before:pointer-events-none",
    noise: "after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] after:opacity-50 after:pointer-events-none",
    grid: "before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] before:bg-[size:20px_20px] before:pointer-events-none",
    vignette: "after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] after:pointer-events-none",
    dots: "before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] before:bg-[size:12px_12px] before:pointer-events-none",
    diagonal: "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] before:pointer-events-none",
}

const useCases = [
    {
        title: "AI Voice Generation",
        subtitle: "ElevenLabs, PlayHT, Murf",
        description: "Remove robotic pauses from AI-generated voiceovers for natural-sounding results.",
        icon: Mic,
        effect: effects.scanlines,
        animation: "glitch"
    },
    {
        title: "Podcast Production",
        subtitle: "Save 2+ hours per episode",
        description: "Clean up interviews and solo episodes automatically. No more manual silence trimming.",
        icon: Podcast,
        effect: effects.noise,
        animation: "pulse"
    },
    {
        title: "Audiobook Narration",
        subtitle: "Professional quality",
        description: "Create seamless narration for audiobooks without awkward gaps between sentences.",
        icon: BookOpen,
        effect: effects.grid,
        animation: "float"
    },
    {
        title: "Online Courses",
        subtitle: "Clear instruction delivery",
        description: "Polish your educational content for maximum student engagement and clarity.",
        icon: GraduationCap,
        effect: effects.vignette,
        animation: "scan"
    },
    {
        title: "Video Production",
        subtitle: "YouTube, TikTok, Reels",
        description: "Create polished voiceovers for any video format. Keep viewers engaged.",
        icon: Video,
        effect: effects.dots,
        animation: "flicker"
    },
    {
        title: "Documentary Films",
        subtitle: "Cinematic narration",
        description: "Seamless storytelling with professional-grade audio for documentary projects.",
        icon: Film,
        effect: effects.diagonal,
        animation: "wave"
    },
]

export function UseCasesSlider() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        if (!isAutoPlaying) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % useCases.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const handlePrev = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev === 0 ? useCases.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev === useCases.length - 1 ? 0 : prev + 1))
    }

    const currentCase = useCases[currentIndex]
    const Icon = currentCase.icon

    return (
        <section className="w-full bg-black py-32 px-6 overflow-hidden">
            {/* CSS Animations */}
            <style jsx global>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.12; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.08; }
          10% { opacity: 0.12; }
          20% { opacity: 0.05; }
          30% { opacity: 0.15; }
          40% { opacity: 0.08; }
        }
        @keyframes wave {
          0%, 100% { transform: skewX(0deg); }
          25% { transform: skewX(0.5deg); }
          75% { transform: skewX(-0.5deg); }
        }
        .anim-glitch { animation: glitch 0.3s ease-in-out infinite; }
        .anim-pulse::after { animation: pulse 2s ease-in-out infinite; }
        .anim-float { animation: float 3s ease-in-out infinite; }
        .anim-scan::before { animation: scan 3s linear infinite; }
        .anim-flicker::before { animation: flicker 0.5s infinite; }
        .anim-wave { animation: wave 4s ease-in-out infinite; }
      `}</style>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-4">
                        [ Use Cases ]
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white/90">
                        Perfect audio for every project
                    </h2>
                </div>

                {/* Main Showcase */}
                <div className="relative">
                    {/* Large Featured Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.5 }}
                            className={`relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-12 md:p-16 min-h-[400px] flex flex-col justify-between overflow-hidden ${currentCase.effect} anim-${currentCase.animation}`}
                        >
                            {/* Animated scan line overlay */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <motion.div
                                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    initial={{ top: 0 }}
                                    animate={{ top: "100%" }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            {/* Background Icon with effect */}
                            <div className="absolute right-8 top-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 0.08, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Icon className="w-48 h-48 md:w-64 md:h-64 text-white" />
                                </motion.div>
                            </div>

                            {/* Pixel corners */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/20" />
                            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/20" />
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/20" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/20" />

                            {/* Content */}
                            <div className="relative z-10 max-w-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <motion.div
                                        className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 border border-white/10"
                                        whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
                                    >
                                        <Icon className="w-7 h-7 text-white/80" />
                                    </motion.div>
                                    <span className="text-white/40 text-sm uppercase tracking-wider font-mono">
                                        {currentCase.subtitle}
                                    </span>
                                </div>

                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white/90 mb-6">
                                    {currentCase.title}
                                </h3>

                                <p className="text-lg md:text-xl text-white/50 leading-relaxed">
                                    {currentCase.description}
                                </p>
                            </div>

                            {/* Navigation */}
                            <div className="relative z-10 flex items-center justify-between mt-8">
                                <div className="flex gap-2">
                                    {useCases.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setIsAutoPlaying(false)
                                                setCurrentIndex(i)
                                            }}
                                            className={`h-1 rounded-full transition-all duration-300 ${currentIndex === i
                                                    ? 'bg-white/80 w-8'
                                                    : 'bg-white/20 w-2 hover:bg-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handlePrev}
                                        className="w-12 h-12 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-white/60" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="w-12 h-12 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-white/60" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Small Preview Cards */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
                        {useCases.map((useCase, i) => {
                            const PreviewIcon = useCase.icon
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setIsAutoPlaying(false)
                                        setCurrentIndex(i)
                                    }}
                                    className={`relative p-4 rounded-xl border transition-all overflow-hidden ${currentIndex === i
                                            ? 'bg-white/[0.08] border-white/20'
                                            : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                                        } ${useCase.effect}`}
                                >
                                    <PreviewIcon className={`w-6 h-6 mx-auto relative z-10 ${currentIndex === i ? 'text-white/90' : 'text-white/40'
                                        }`} />
                                    <p className={`text-xs mt-2 text-center truncate relative z-10 font-mono ${currentIndex === i ? 'text-white/70' : 'text-white/30'
                                        }`}>
                                        {useCase.title.split(' ')[0]}
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UseCasesSlider
