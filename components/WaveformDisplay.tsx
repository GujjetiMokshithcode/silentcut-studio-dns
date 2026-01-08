'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { PauseSegment } from '@/types/audio';
import { COLORS } from '@/lib/constants';
import { getWaveformData } from '@/lib/audioUtils';

interface WaveformDisplayProps {
    buffer: AudioBuffer | null;
    pauses: PauseSegment[];
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
    frequencyData?: Uint8Array;
}

export function WaveformDisplay({
    buffer,
    pauses,
    currentTime,
    duration,
    onSeek,
    frequencyData,
}: WaveformDisplayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const waveformDataRef = useRef<number[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    // Draw waveform
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !buffer) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Generate waveform data if not cached
        if (waveformDataRef.current.length === 0) {
            waveformDataRef.current = getWaveformData(buffer, canvas.width * 2);
        }

        const waveformData = waveformDataRef.current;
        const width = canvas.width;
        const height = canvas.height;
        const midY = height / 2;
        const progress = currentTime / duration;

        // Clear canvas
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, width, height);

        if (waveformData.length === 0) return;

        // Draw Live Visualizer Background (if active)
        if (frequencyData && frequencyData.length > 0) {
            const barWidth = width / 64;
            const barCount = 64;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            for (let i = 0; i < barCount; i++) {
                const value = frequencyData[i * 2] || 0;
                const barHeight = (value / 255) * height * 0.8;

                // Draw mirrored bars
                ctx.fillRect(i * barWidth, midY - barHeight / 2, barWidth - 1, barHeight);
            }
        }

        // Draw pause highlights first (behind waveform)
        for (const pause of pauses) {
            if (!pause.selected) continue;

            const startX = (pause.start / duration) * width;
            const endX = (pause.end / duration) * width;

            ctx.fillStyle = `${COLORS.pauseHighlight}30`;
            ctx.fillRect(startX, 0, endX - startX, height);
        }

        // Draw waveform
        const step = waveformData.length / width;

        ctx.beginPath();

        // Top half
        for (let x = 0; x < width; x++) {
            const dataIndex = Math.floor(x * step);
            const amplitude = waveformData[dataIndex] || 0;
            const y = midY - amplitude * (height * 0.4);

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        // Bottom half (mirror)
        for (let x = width - 1; x >= 0; x--) {
            const dataIndex = Math.floor(x * step);
            const amplitude = waveformData[dataIndex] || 0;
            const y = midY + amplitude * (height * 0.4);
            ctx.lineTo(x, y);
        }

        ctx.closePath();

        // Gradient fill for progress
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const playHeadX = progress * width;

        // Played part - Cyan/White glow
        gradient.addColorStop(0, 'rgba(34, 211, 238, 0.8)'); // Cyan
        gradient.addColorStop(Math.max(0, progress - 0.01), 'rgba(34, 211, 238, 1)');

        // Unplayed part - Dim white
        gradient.addColorStop(Math.min(1, progress + 0.01), 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw pause markers on top
        ctx.lineWidth = 1;
        for (const pause of pauses) {
            if (!pause.selected) continue;

            const startX = (pause.start / duration) * width;
            const endX = (pause.end / duration) * width;

            ctx.strokeStyle = COLORS.pauseHighlight;
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(startX, 0);
            ctx.lineTo(startX, height);
            ctx.moveTo(endX, 0);
            ctx.lineTo(endX, height);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw playhead
        const playheadX = (currentTime / duration) * width;

        // Glow behind playhead
        const glowGradient = ctx.createRadialGradient(playheadX, midY, 0, playheadX, midY, 20);
        glowGradient.addColorStop(0, 'rgba(34, 211, 238, 0.5)');
        glowGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(playheadX - 20, 0, 40, height);

        ctx.strokeStyle = '#22d3ee'; // Cyan
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, height);
        ctx.stroke();

        // Draw playhead handle
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(playheadX, 8, 6, 0, Math.PI * 2);
        ctx.fill();

        // Shadow for handle
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        // Draw center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY);
        ctx.stroke();

    }, [buffer, pauses, currentTime, duration, frequencyData]);

    // Animation Loop
    useEffect(() => {
        const animate = () => {
            draw();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Only animate if there is live data to show or playing
        if (frequencyData && frequencyData.length > 0) {
            animate();
        } else {
            draw(); // Draw once if static
        }

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [draw, frequencyData]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && containerRef.current) {
                const dpr = window.devicePixelRatio || 1;
                const rect = containerRef.current.getBoundingClientRect();
                canvasRef.current.width = rect.width * dpr;
                canvasRef.current.height = rect.height * dpr;
                canvasRef.current.style.width = `${rect.width}px`;
                canvasRef.current.style.height = `${rect.height}px`;

                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.scale(dpr, dpr);
                }

                // Reset cached waveform data on resize
                waveformDataRef.current = [];
                draw();
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    // Handle click to seek
    const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !duration) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = (x / rect.width) * duration;
        onSeek(Math.max(0, Math.min(duration, time)));
    }, [duration, onSeek]);

    if (!buffer) {
        return (
            <div className="w-full h-32 bg-black rounded-lg flex items-center justify-center border border-white/10">
                <p className="text-white/30">No audio loaded</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-32 bg-black overflow-hidden cursor-crosshair rounded-lg"
        >
            <canvas
                ref={canvasRef}
                onClick={handleClick}
                className="w-full h-full"
            />
        </div>
    );
}
