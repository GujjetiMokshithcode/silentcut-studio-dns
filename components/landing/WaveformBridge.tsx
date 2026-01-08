'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Generate waveform path with optional gaps
function generateWavePath(width: number, height: number, hasGaps: boolean): string {
    const points: string[] = [];
    const segments = 120;
    const segmentWidth = width / segments;
    const baseY = height / 2;

    // Define gap positions (indices where gaps occur)
    const gapRanges = hasGaps ? [
        { start: 25, end: 35 },
        { start: 55, end: 70 },
        { start: 90, end: 100 },
    ] : [];

    for (let i = 0; i <= segments; i++) {
        const x = i * segmentWidth;

        // Check if we're in a gap
        const inGap = gapRanges.some(gap => i >= gap.start && i <= gap.end);

        // Generate wave height
        let amplitude;
        if (inGap) {
            amplitude = 3 + Math.random() * 2; // Very small amplitude in gaps
        } else {
            // Natural wave pattern
            amplitude = 15 +
                Math.sin(i * 0.15) * 12 +
                Math.sin(i * 0.3) * 8 +
                Math.random() * 5;
        }

        const y1 = baseY - amplitude;
        const y2 = baseY + amplitude;

        if (i === 0) {
            points.push(`M ${x} ${baseY}`);
        }

        // Draw vertical bar for each segment
        points.push(`M ${x} ${y1} L ${x} ${y2}`);
    }

    return points.join(' ');
}

export function WaveformBridge() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Transform scroll progress to morph value (0 = broken, 1 = smooth)
    const morphProgress = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
    const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
    const waveOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);

    // SVG dimensions
    const svgWidth = 1200;
    const svgHeight = 80;

    // Generate paths
    const brokenPath = generateWavePath(svgWidth, svgHeight, true);
    const smoothPath = generateWavePath(svgWidth, svgHeight, false);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center py-32 px-6 overflow-hidden"
        >
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />

            {/* Content */}
            <div className="relative z-10 max-w-4xl w-full">

                {/* Small kicker */}
                <motion.p
                    style={{ opacity: textOpacity }}
                    className="text-xs md:text-sm uppercase tracking-[0.25em] text-white/30 text-center mb-8"
                >
                    Why AI voices feel off
                </motion.p>

                {/* Main headline */}
                <motion.h2
                    style={{ opacity: textOpacity }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-center leading-tight mb-6"
                >
                    <span className="text-white/90">Robotic pauses break flow.</span>
                    <br />
                    <span className="text-white/50">Humans don't pause like that.</span>
                </motion.h2>

                {/* Waveform visualization */}
                <motion.div
                    style={{ opacity: waveOpacity }}
                    className="relative w-full mt-16 mb-12"
                >
                    {/* Waveform container */}
                    <div className="relative w-full h-24 md:h-32">
                        <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="w-full h-full"
                            preserveAspectRatio="none"
                        >
                            {/* Broken waveform (fades out) */}
                            <motion.g
                                style={{
                                    opacity: useTransform(morphProgress, [0, 1], [1, 0])
                                }}
                            >
                                <path
                                    d={brokenPath}
                                    fill="none"
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </motion.g>

                            {/* Smooth waveform (fades in) */}
                            <motion.g
                                style={{
                                    opacity: useTransform(morphProgress, [0, 1], [0, 1])
                                }}
                            >
                                <path
                                    d={smoothPath}
                                    fill="none"
                                    stroke="rgba(255,255,255,0.7)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </motion.g>

                            {/* Subtle green accent on completion */}
                            <motion.g
                                style={{
                                    opacity: useTransform(morphProgress, [0.8, 1], [0, 0.3])
                                }}
                            >
                                <path
                                    d={smoothPath}
                                    fill="none"
                                    stroke="rgba(74, 222, 128, 0.4)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    filter="blur(2px)"
                                />
                            </motion.g>
                        </svg>

                        {/* Labels that fade */}
                        <motion.div
                            style={{ opacity: useTransform(morphProgress, [0, 0.5], [1, 0]) }}
                            className="absolute left-4 top-1/2 -translate-y-1/2"
                        >
                            <span className="text-[10px] md:text-xs text-white/20 uppercase tracking-wider">
                                broken
                            </span>
                        </motion.div>

                        <motion.div
                            style={{ opacity: useTransform(morphProgress, [0.5, 1], [0, 1]) }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider">
                                natural
                            </span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Whisper text */}
                <motion.p
                    style={{
                        opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 1])
                    }}
                    className="text-base md:text-lg text-white/30 text-center"
                >
                    SilentCut fixes this automatically.
                </motion.p>

            </div>
        </section>
    );
}
