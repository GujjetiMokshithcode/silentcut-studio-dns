'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import type { PauseSegment, WaveformSettings } from '@/types/audio';
import { getWaveformData } from '@/lib/audioUtils';
import { COLORS } from '@/lib/constants';

interface UseWaveformReturn {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    settings: WaveformSettings;
    draw: (buffer: AudioBuffer, pauses: PauseSegment[], currentTime: number) => void;
    setZoom: (zoom: number) => void;
    setScrollPosition: (position: number) => void;
    getTimeFromX: (x: number, duration: number) => number;
}

export function useWaveform(): UseWaveformReturn {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [waveformData, setWaveformData] = useState<number[]>([]);
    const [settings, setSettings] = useState<WaveformSettings>({
        zoom: 1,
        scrollPosition: 0,
    });

    const draw = useCallback((
        buffer: AudioBuffer,
        pauses: PauseSegment[],
        currentTime: number
    ) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Update waveform data if needed
        if (waveformData.length === 0) {
            const data = getWaveformData(buffer, canvas.width * 2);
            setWaveformData(data);
        }

        const duration = buffer.duration;
        const width = canvas.width;
        const height = canvas.height;
        const midY = height / 2;

        // Clear canvas
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, width, height);

        if (waveformData.length === 0) return;

        // Draw pause highlights first (behind waveform)
        for (const pause of pauses) {
            if (!pause.selected) continue;

            const startX = (pause.start / duration) * width;
            const endX = (pause.end / duration) * width;

            ctx.fillStyle = `${COLORS.pauseHighlight}40`; // 25% opacity
            ctx.fillRect(startX, 0, endX - startX, height);
        }

        // Draw waveform
        ctx.beginPath();
        ctx.strokeStyle = COLORS.waveform;
        ctx.lineWidth = 1;

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

        // Draw mirror (below center line)
        for (let x = width - 1; x >= 0; x--) {
            const dataIndex = Math.floor(x * step);
            const amplitude = waveformData[dataIndex] || 0;
            const y = midY + amplitude * (height * 0.4);
            ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fillStyle = `${COLORS.waveform}80`;
        ctx.fill();
        ctx.stroke();

        // Draw pause markers on top
        for (const pause of pauses) {
            if (!pause.selected) continue;

            const startX = (pause.start / duration) * width;
            const endX = (pause.end / duration) * width;

            // Draw borders
            ctx.strokeStyle = COLORS.pauseHighlight;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(startX, 0);
            ctx.lineTo(startX, height);
            ctx.moveTo(endX, 0);
            ctx.lineTo(endX, height);
            ctx.stroke();
        }

        // Draw playhead
        const playheadX = (currentTime / duration) * width;
        ctx.strokeStyle = COLORS.foreground;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, height);
        ctx.stroke();

        // Draw playhead circle
        ctx.fillStyle = COLORS.foreground;
        ctx.beginPath();
        ctx.arc(playheadX, 10, 6, 0, Math.PI * 2);
        ctx.fill();

    }, [waveformData]);

    const setZoom = useCallback((zoom: number) => {
        setSettings(prev => ({ ...prev, zoom: Math.max(1, Math.min(10, zoom)) }));
    }, []);

    const setScrollPosition = useCallback((position: number) => {
        setSettings(prev => ({ ...prev, scrollPosition: Math.max(0, Math.min(1, position)) }));
    }, []);

    const getTimeFromX = useCallback((x: number, duration: number): number => {
        const canvas = canvasRef.current;
        if (!canvas) return 0;
        return (x / canvas.width) * duration;
    }, []);

    // Reset waveform data when component unmounts
    useEffect(() => {
        return () => {
            setWaveformData([]);
        };
    }, []);

    return {
        canvasRef,
        settings,
        draw,
        setZoom,
        setScrollPosition,
        getTimeFromX,
    };
}
