'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
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

const ZOOM_LEVELS = [1, 1.5, 2, 3, 4];

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
    const [isMobile, setIsMobile] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    const handleZoomIn = useCallback(() => {
        const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
        if (currentIndex < ZOOM_LEVELS.length - 1) {
            setZoomLevel(ZOOM_LEVELS[currentIndex + 1]);
        }
    }, [zoomLevel]);

    const handleZoomOut = useCallback(() => {
        const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
        if (currentIndex > 0) {
            setZoomLevel(ZOOM_LEVELS[currentIndex - 1]);
        }
    }, [zoomLevel]);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Draw waveform
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !buffer) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const displayWidth = canvas.width / dpr;
        const displayHeight = canvas.height / dpr;

        // Generate waveform data if not cached
        if (waveformDataRef.current.length === 0) {
            // For mobile, generate more data points for smoother scrolling
            const dataPoints = isMobile ? displayWidth * 4 : displayWidth * 2;
            waveformDataRef.current = getWaveformData(buffer, dataPoints);
        }

        const waveformData = waveformDataRef.current;
        const width = displayWidth;
        const height = displayHeight;
        const midY = height / 2;
        const progress = duration > 0 ? currentTime / duration : 0;

        // Clear canvas
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, width, height);

        if (waveformData.length === 0) return;

        // MOBILE: Fixed playhead at center, waveform scrolls
        // DESKTOP: Standard progress bar view
        const playheadX = isMobile ? width / 2 : progress * width;

        // Calculate offset for mobile scrolling waveform
        // On mobile, the waveform moves left as time progresses
        const mobileOffset = isMobile ? (progress * waveformData.length) - (waveformData.length * (width / 2) / (width * 2)) : 0;

        // Draw Live Visualizer Background (if active)
        if (frequencyData && frequencyData.length > 0) {
            const barWidth = width / 64;
            const barCount = 64;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            for (let i = 0; i < barCount; i++) {
                const value = frequencyData[i * 2] || 0;
                const barHeight = (value / 255) * height * 0.8;
                ctx.fillRect(i * barWidth, midY - barHeight / 2, barWidth - 1, barHeight);
            }
        }

        // Calculate view parameters (used for both pauses and waveform on mobile)
        // Apply zoom: higher zoom = more pixels per second = narrower time window
        const pixelsPerSecond = (width / duration) * zoomLevel;
        const viewStartTime = isMobile ? currentTime - (width / 2) / pixelsPerSecond : 0;

        // Draw pause highlights
        for (const pause of pauses) {
            if (!pause.selected) continue;

            let startX: number, endX: number;

            if (isMobile) {
                // Calculate pause positions relative to the scrolling view
                startX = (pause.start - viewStartTime) * pixelsPerSecond;
                endX = (pause.end - viewStartTime) * pixelsPerSecond;
            } else {
                startX = (pause.start / duration) * width;
                endX = (pause.end / duration) * width;
            }

            if (endX > 0 && startX < width) {
                ctx.fillStyle = `${COLORS.pauseHighlight}30`;
                ctx.fillRect(Math.max(0, startX), 0, Math.min(endX, width) - Math.max(0, startX), height);
            }
        }

        // Draw waveform with offset for mobile
        ctx.beginPath();

        if (isMobile) {
            // Mobile: Draw waveform that scrolls - fixed window centered on playhead
            // Uses pixelsPerSecond and viewStartTime calculated above

            for (let x = 0; x < width; x++) {
                const timeAtX = viewStartTime + (x / pixelsPerSecond);
                const dataProgress = timeAtX / duration;
                const dataIndex = Math.floor(dataProgress * waveformData.length);

                let amplitude = 0;
                if (dataIndex >= 0 && dataIndex < waveformData.length) {
                    amplitude = waveformData[dataIndex] || 0;
                }

                const y = midY - amplitude * (height * 0.4);
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            // Bottom half (mirror) for mobile
            for (let x = width - 1; x >= 0; x--) {
                const timeAtX = viewStartTime + (x / pixelsPerSecond);
                const dataProgress = timeAtX / duration;
                const dataIndex = Math.floor(dataProgress * waveformData.length);

                let amplitude = 0;
                if (dataIndex >= 0 && dataIndex < waveformData.length) {
                    amplitude = waveformData[dataIndex] || 0;
                }

                const y = midY + amplitude * (height * 0.4);
                ctx.lineTo(x, y);
            }
        } else {
            // Desktop: Standard full waveform view
            const step = waveformData.length / width;

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

            // Bottom half (mirror) for desktop
            for (let x = width - 1; x >= 0; x--) {
                const dataIndex = Math.floor(x * step);
                const amplitude = waveformData[dataIndex] || 0;
                const y = midY + amplitude * (height * 0.4);
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();

        // Gradient fill for waveform
        const gradient = ctx.createLinearGradient(0, 0, width, 0);

        if (isMobile) {
            // Mobile: Left side is played (bright), right side is unplayed (dim)
            // Playhead is at center
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.48, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.52, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
        } else {
            // Desktop: Standard progress gradient
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(Math.max(0, progress - 0.01), 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(Math.min(1, progress + 0.01), 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
        }

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw pause markers (dashed lines)
        ctx.lineWidth = 1;
        for (const pause of pauses) {
            if (!pause.selected) continue;

            let startX: number, endX: number;

            if (isMobile) {
                // Use same calculation as pause highlights
                startX = (pause.start - viewStartTime) * pixelsPerSecond;
                endX = (pause.end - viewStartTime) * pixelsPerSecond;
            } else {
                startX = (pause.start / duration) * width;
                endX = (pause.end / duration) * width;
            }

            if (endX > 0 && startX < width) {
                ctx.strokeStyle = COLORS.pauseHighlight;
                ctx.beginPath();
                ctx.setLineDash([4, 4]);
                if (startX >= 0 && startX <= width) {
                    ctx.moveTo(startX, 0);
                    ctx.lineTo(startX, height);
                }
                if (endX >= 0 && endX <= width) {
                    ctx.moveTo(endX, 0);
                    ctx.lineTo(endX, height);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // Draw playhead (fixed at center on mobile, moving on desktop)
        // Glow behind playhead
        const glowGradient = ctx.createRadialGradient(playheadX, midY, 0, playheadX, midY, 20);
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(playheadX - 20, 0, 40, height);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, height);
        ctx.stroke();

        // Draw playhead handle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(playheadX, 8, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY);
        ctx.stroke();

    }, [buffer, pauses, currentTime, duration, frequencyData, isMobile, zoomLevel]);

    // Animation Loop
    useEffect(() => {
        const animate = () => {
            draw();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Always animate on mobile for smooth scrolling, or when frequency data is present
        if (isMobile || (frequencyData && frequencyData.length > 0)) {
            animate();
        } else {
            draw();
        }

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [draw, frequencyData, isMobile]);

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

        let time: number;
        if (isMobile) {
            // On mobile, clicking translates to time relative to current position
            const clickOffset = (x - rect.width / 2) / rect.width; // -0.5 to 0.5
            time = currentTime + clickOffset * duration;
        } else {
            time = (x / rect.width) * duration;
        }

        onSeek(Math.max(0, Math.min(duration, time)));
    }, [duration, onSeek, isMobile, currentTime]);

    if (!buffer) {
        return (
            <div className="w-full h-32 bg-black rounded-lg flex items-center justify-center border border-white/10">
                <p className="text-white/30">No audio loaded</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Zoom Controls */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg p-1">
                <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel === ZOOM_LEVELS[0]}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4 text-white" />
                </button>
                <span className="text-xs text-white/70 font-mono w-8 text-center">{zoomLevel}x</span>
                <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4 text-white" />
                </button>
            </div>

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
        </div>
    );
}
