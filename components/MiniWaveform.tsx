'use client';

import { useRef, useEffect } from 'react';
import { getWaveformData } from '@/lib/audioUtils';

interface MiniWaveformProps {
    buffer: AudioBuffer | null;
    className?: string;
    color?: string;
    height?: number;
}

export function MiniWaveform({ buffer, className = '', color = '#ffffff', height = 40 }: MiniWaveformProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !buffer) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const h = rect.height;
        const midY = h / 2;

        // Clear
        ctx.clearRect(0, 0, width, h);

        // Get waveform data
        const waveformData = getWaveformData(buffer, Math.floor(width * 2));
        if (waveformData.length === 0) return;

        // Draw waveform
        const step = waveformData.length / width;

        ctx.beginPath();

        // Top half
        for (let x = 0; x < width; x++) {
            const dataIndex = Math.floor(x * step);
            const amplitude = waveformData[dataIndex] || 0;
            const y = midY - amplitude * (h * 0.4);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        // Bottom half (mirror)
        for (let x = width - 1; x >= 0; x--) {
            const dataIndex = Math.floor(x * step);
            const amplitude = waveformData[dataIndex] || 0;
            const y = midY + amplitude * (h * 0.4);
            ctx.lineTo(x, y);
        }

        ctx.closePath();

        // Fill with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(0.5, `${color}80`);
        gradient.addColorStop(1, `${color}40`);
        ctx.fillStyle = gradient;
        ctx.fill();

    }, [buffer, color]);

    if (!buffer) {
        return (
            <div className={`flex items-center justify-center text-white/20 text-xs ${className}`} style={{ height }}>
                No audio data
            </div>
        );
    }

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width: '100%', height }}
        />
    );
}
