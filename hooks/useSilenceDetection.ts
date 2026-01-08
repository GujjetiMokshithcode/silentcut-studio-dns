'use client';

import { useState, useCallback, useEffect } from 'react';
import type { PauseSegment, DetectionSettings, ProcessingStatus } from '@/types/audio';
import { detectSilence, calculateTimeSaved, filterPausesByDuration } from '@/lib/silenceDetector';
import { DEFAULT_DETECTION_SETTINGS } from '@/lib/constants';

interface UseSilenceDetectionReturn {
    pauses: PauseSegment[];
    settings: DetectionSettings;
    status: ProcessingStatus;
    timeSaved: number;
    updateSettings: (settings: Partial<DetectionSettings>) => void;
    detect: (buffer: AudioBuffer) => Promise<void>;
    togglePause: (id: string) => void;
    selectAll: () => void;
    deselectAll: () => void;
    selectByDuration: (minDuration: number) => void;
    reset: () => void;
}

export function useSilenceDetection(): UseSilenceDetectionReturn {
    const [pauses, setPauses] = useState<PauseSegment[]>([]);
    const [settings, setSettings] = useState<DetectionSettings>(DEFAULT_DETECTION_SETTINGS);
    const [status, setStatus] = useState<ProcessingStatus>({
        isProcessing: false,
        progress: 0,
        stage: 'idle',
    });
    const [timeSaved, setTimeSaved] = useState(0);

    // Update time saved when pauses change
    useEffect(() => {
        setTimeSaved(calculateTimeSaved(pauses));
    }, [pauses]);

    const detect = useCallback(async (buffer: AudioBuffer) => {
        setStatus({
            isProcessing: true,
            progress: 0,
            stage: 'analyzing',
            message: 'Detecting silence...',
        });

        try {
            const detectedPauses = await detectSilence(
                buffer,
                settings,
                (progress) => {
                    setStatus(prev => ({
                        ...prev,
                        progress,
                        message: `Analyzing audio... ${Math.round(progress)}%`,
                    }));
                }
            );

            setPauses(detectedPauses);
            setStatus({
                isProcessing: false,
                progress: 100,
                stage: 'complete',
                message: `Found ${detectedPauses.length} pauses`,
            });
        } catch (err) {
            setStatus({
                isProcessing: false,
                progress: 0,
                stage: 'error',
                message: err instanceof Error ? err.message : 'Detection failed',
            });
        }
    }, [settings]);

    const updateSettings = useCallback((newSettings: Partial<DetectionSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    const togglePause = useCallback((id: string) => {
        setPauses(prev =>
            prev.map(p => (p.id === id ? { ...p, selected: !p.selected } : p))
        );
    }, []);

    const selectAll = useCallback(() => {
        setPauses(prev => prev.map(p => ({ ...p, selected: true })));
    }, []);

    const deselectAll = useCallback(() => {
        setPauses(prev => prev.map(p => ({ ...p, selected: false })));
    }, []);

    const selectByDuration = useCallback((minDuration: number) => {
        setPauses(prev => filterPausesByDuration(prev, minDuration));
    }, []);

    const reset = useCallback(() => {
        setPauses([]);
        setSettings(DEFAULT_DETECTION_SETTINGS);
        setStatus({
            isProcessing: false,
            progress: 0,
            stage: 'idle',
        });
        setTimeSaved(0);
    }, []);

    return {
        pauses,
        settings,
        status,
        timeSaved,
        updateSettings,
        detect,
        togglePause,
        selectAll,
        deselectAll,
        selectByDuration,
        reset,
    };
}
