'use client';

import { useEffect, useRef, useState } from 'react';

export function useAudioVisualizer(audioElement: HTMLAudioElement | null) {
    const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(0));
    const animationRef = useRef<number | null>(null);
    const contextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    useEffect(() => {
        if (!audioElement) return;

        try {
            // Re-use or create context
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!contextRef.current) {
                contextRef.current = new AudioContextClass();
            }

            const ctx = contextRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            // Create analyzer
            if (!analyserRef.current) {
                const analyser = ctx.createAnalyser();
                analyser.fftSize = 256; // Trade-off between resolution and speed
                analyserRef.current = analyser;
            }

            // Connect source if not already connected
            // Note: MediaElementAudioSourceNode can only be created once per element
            if (!sourceRef.current) {
                try {
                    const source = ctx.createMediaElementSource(audioElement);
                    source.connect(analyserRef.current!);
                    analyserRef.current!.connect(ctx.destination);
                    sourceRef.current = source;
                } catch (e) {
                    console.warn('Media element source already connected or failed:', e);
                }
            }

            const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);

            const animate = () => {
                if (analyserRef.current) {
                    analyserRef.current.getByteFrequencyData(dataArray);
                    // Clone to force re-render if using state
                    setFrequencyData(new Uint8Array(dataArray));
                }
                animationRef.current = requestAnimationFrame(animate);
            };

            const startAnimation = () => {
                cancelAnimationFrame(animationRef.current || 0);
                animationRef.current = requestAnimationFrame(animate);
            };

            const stopAnimation = () => {
                cancelAnimationFrame(animationRef.current || 0);
            };

            audioElement.addEventListener('play', startAnimation);
            audioElement.addEventListener('pause', stopAnimation);
            audioElement.addEventListener('ended', stopAnimation);

            return () => {
                stopAnimation();
                audioElement.removeEventListener('play', startAnimation);
                audioElement.removeEventListener('pause', stopAnimation);
                audioElement.removeEventListener('ended', stopAnimation);
            };

        } catch (err) {
            console.error('Failed to init visualizer:', err);
        }

    }, [audioElement]);

    return frequencyData;
}
