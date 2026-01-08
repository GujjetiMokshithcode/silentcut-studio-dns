'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, X, FileAudio, Volume2, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadZone } from '@/components/UploadZone';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface CTASectionProps {
    onFileSelect?: (file: File) => void;
    isProcessing?: boolean;
    progress?: number;
    error?: string | null;
    isDetecting?: boolean;
    detectProgress?: number;
}

// Animated floating particles
function FloatingParticles() {
    const [particles] = useState(() =>
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 1 + Math.random() * 2,
            duration: 10 + Math.random() * 20,
            delay: Math.random() * 5,
        }))
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-white/20"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

// Shuffle text effect - letters scramble before revealing
const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function ShuffleText({
    text,
    className = "",
    delay = 0
}: {
    text: string;
    className?: string;
    delay?: number;
}) {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (hasAnimated) return;

        const timeout = setTimeout(() => {
            setIsAnimating(true);
            let iteration = 0;
            const originalText = text;

            const interval = setInterval(() => {
                setDisplayText(
                    originalText
                        .split("")
                        .map((char, index) => {
                            if (char === " ") return " ";
                            if (index < iteration) {
                                return originalText[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("")
                );

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                    setIsAnimating(false);
                    setHasAnimated(true);
                }

                iteration += 1 / 2;
            }, 30);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, delay, hasAnimated]);

    return (
        <span className={`${className} ${isAnimating ? 'font-mono' : ''}`}>
            {displayText}
        </span>
    );
}

// Animated waveform visualization
function AnimatedWaveform({ isHovering }: { isHovering: boolean }) {
    const bars = 60;

    return (
        <div className="flex items-center justify-center gap-[2px] h-24 w-full max-w-2xl mx-auto">
            {Array.from({ length: bars }).map((_, i) => {
                const isSilence = i >= 24 && i <= 35;
                const baseHeight = isSilence ? 8 : 20 + Math.sin(i * 0.3) * 60;

                return (
                    <motion.div
                        key={i}
                        className={`w-1 rounded-full ${isSilence
                            ? 'bg-white/10'
                            : 'bg-gradient-to-t from-white/20 via-white/40 to-white/60'
                            }`}
                        animate={{
                            height: isSilence ? 8 : isHovering
                                ? [baseHeight * 0.5, baseHeight, baseHeight * 0.5]
                                : baseHeight,
                            opacity: isSilence ? 0.3 : isHovering ? [0.4, 0.8, 0.4] : 0.5,
                        }}
                        transition={{
                            duration: 1 + Math.random() * 0.5,
                            repeat: Infinity,
                            delay: i * 0.02,
                            ease: "easeInOut",
                        }}
                    />
                );
            })}
        </div>
    );
}

export function CTASection({
    onFileSelect,
    isProcessing = false,
    progress = 0,
    error = null,
    isDetecting = false,
    detectProgress = 0
}: CTASectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);

    return (
        <>
            <section
                className="py-32 relative overflow-hidden bg-black"
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMousePos({
                        x: ((e.clientX - rect.left) / rect.width) * 100,
                        y: ((e.clientY - rect.top) / rect.height) * 100,
                    });
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Animated grid background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>

                {/* Floating particles */}
                <FloatingParticles />

                {/* Mouse follow glow */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)',
                    }}
                    animate={{
                        left: `${mousePos.x}%`,
                        top: `${mousePos.y}%`,
                        opacity: isHovering ? 1 : 0,
                    }}
                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                    initial={{ x: "-50%", y: "-50%" }}
                />

                {/* Animated scan line */}
                <motion.div
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                <div className="w-full max-w-6xl mx-auto px-6 relative z-10">

                    {/* Badge */}
                    <motion.div
                        className="flex justify-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10">
                            <Sparkles className="w-4 h-4 text-white/50" />
                            <span className="text-sm text-white/50">AI-Powered Audio Processing</span>
                        </div>
                    </motion.div>

                    {/* Main heading */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Main heading with unique effects */}
                        <div className="relative inline-block">
                            {/* Glitch shadow layers */}
                            <h2
                                className="absolute text-5xl md:text-7xl lg:text-[10rem] font-black tracking-tighter text-cyan-500/20 blur-[1px] select-none pointer-events-none"
                                style={{ transform: 'translate(-2px, -2px)' }}
                                aria-hidden="true"
                            >
                                SILENTCUT
                            </h2>
                            <h2
                                className="absolute text-5xl md:text-7xl lg:text-[10rem] font-black tracking-tighter text-red-500/20 blur-[1px] select-none pointer-events-none"
                                style={{ transform: 'translate(2px, 2px)' }}
                                aria-hidden="true"
                            >
                                SILENTCUT
                            </h2>

                            {/* Main text with letter animations */}
                            <h2 className="relative text-5xl md:text-7xl lg:text-[10rem] font-black tracking-tighter">
                                {/* SILENT - with strikethrough on hover */}
                                <span className="relative inline-block">
                                    {"SILENT".split("").map((letter, i) => (
                                        <motion.span
                                            key={i}
                                            className="inline-block text-white/80"
                                            initial={{ opacity: 0, y: 50, rotateX: -90 }}
                                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                delay: 0.3 + i * 0.05,
                                                type: "spring",
                                                damping: 12
                                            }}
                                            whileHover={{
                                                y: -10,
                                                color: "rgba(255,255,255,1)",
                                                textShadow: "0 0 20px rgba(255,255,255,0.5)"
                                            }}
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                    {/* Strikethrough line */}
                                    <motion.div
                                        className="absolute left-0 right-0 h-1 md:h-2 bg-white/60"
                                        style={{ top: '50%', transformOrigin: 'left' }}
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1, duration: 0.5 }}
                                    />
                                </span>

                                {/* CUT - glowing accent */}
                                <span className="relative inline-block">
                                    {"CUT".split("").map((letter, i) => (
                                        <motion.span
                                            key={i}
                                            className="inline-block"
                                            style={{
                                                background: 'linear-gradient(180deg, #fff 0%, #a0a0a0 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
                                            }}
                                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                delay: 0.8 + i * 0.1,
                                                type: "spring",
                                                damping: 10
                                            }}
                                            whileHover={{
                                                scale: 1.1,
                                                filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.6))'
                                            }}
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}

                                    {/* Underline glow */}
                                    <motion.div
                                        className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                                        style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                                            boxShadow: '0 0 20px rgba(255,255,255,0.5)'
                                        }}
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        whileInView={{ scaleX: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                    />
                                </span>
                            </h2>

                            {/* Scan line effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
                                animate={{ y: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mt-6">
                            <ShuffleText
                                text="Remove awkward silences. Make AI voices sound human."
                                delay={1500}
                            />
                        </p>
                    </motion.div>

                    {/* Waveform visualization */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <AnimatedWaveform isHovering={isHovering} />

                        {/* Label */}
                        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-white/30 uppercase tracking-wider">
                            <span>Audio</span>
                            <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-white/50">
                                ← silence removed →
                            </span>
                            <span>Audio</span>
                        </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        className="flex flex-col items-center gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button
                            size="lg"
                            className="h-16 px-12 text-lg rounded-2xl group relative overflow-hidden"
                            onClick={() => setIsModalOpen(true)}
                        >
                            {/* Button glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                            <Volume2 className="w-5 h-5 mr-3" />
                            Try it now — it's free
                            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        {/* Features row */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
                            {[
                                { icon: Zap, text: "Instant processing" },
                                { text: "No sign up required" },
                                { text: "100% private" },
                                { text: "Works offline" },
                            ].map((item, i) => (
                                <span key={i} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                    {item.text}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Corner decorations */}
                    <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/10" />
                    <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/10" />
                    <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/10" />
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/10" />
                </div>
            </section>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => !isProcessing && !isDetecting && setIsModalOpen(false)}
                    />
                    <motion.div
                        className="relative w-full max-w-2xl mx-4 p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 25 }}
                    >
                        {!isProcessing && !isDetecting && (
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        )}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-4">
                                <FileAudio className="w-8 h-8 text-white/60" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-white/90">Upload your audio</h2>
                            <p className="text-white/40">Drag and drop or click to select a file</p>
                        </div>

                        {onFileSelect ? (
                            <UploadZone
                                onFileSelect={onFileSelect}
                                isProcessing={isProcessing}
                                progress={progress}
                                error={error}
                            />
                        ) : (
                            <div className="text-center p-8 border border-dashed border-white/10 rounded-xl">
                                <p className="text-white/50">Please use the upload button at the top of the page</p>
                                <Button className="mt-4" onClick={() => {
                                    setIsModalOpen(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}>
                                    Go to top
                                </Button>
                            </div>
                        )}

                        {isDetecting && (
                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between text-sm text-white/50">
                                    <span>Analyzing audio...</span>
                                    <span>{Math.round(detectProgress)}%</span>
                                </div>
                                <Progress value={detectProgress} />
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </>
    );
}
