'use client';

import { useState, useCallback } from 'react';
import type { AudioFile, ProcessingStatus } from '@/types/audio';
import { loadAudioFile, validateAudioFile } from '@/lib/audioUtils';

interface UseAudioProcessingReturn {
    audioFile: AudioFile | null;
    status: ProcessingStatus;
    error: string | null;
    processFile: (file: File) => Promise<void>;
    reset: () => void;
}

export function useAudioProcessing(): UseAudioProcessingReturn {
    const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
    const [status, setStatus] = useState<ProcessingStatus>({
        isProcessing: false,
        progress: 0,
        stage: 'idle',
    });
    const [error, setError] = useState<string | null>(null);

    const processFile = useCallback(async (file: File) => {
        // Validate file
        const validation = validateAudioFile(file);
        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            return;
        }

        setError(null);
        setStatus({
            isProcessing: true,
            progress: 0,
            stage: 'loading',
            message: 'Loading audio file...',
        });

        try {
            const audio = await loadAudioFile(file, (progress) => {
                setStatus(prev => ({
                    ...prev,
                    progress,
                    message: progress < 50 ? 'Reading file...' : 'Decoding audio...',
                }));
            });

            setAudioFile(audio);
            setStatus({
                isProcessing: false,
                progress: 100,
                stage: 'complete',
                message: 'Audio loaded successfully',
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load audio');
            setStatus({
                isProcessing: false,
                progress: 0,
                stage: 'error',
                message: 'Failed to load audio',
            });
        }
    }, []);

    const reset = useCallback(() => {
        setAudioFile(null);
        setStatus({
            isProcessing: false,
            progress: 0,
            stage: 'idle',
        });
        setError(null);
    }, []);

    return {
        audioFile,
        status,
        error,
        processFile,
        reset,
    };
}
