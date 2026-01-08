import type { PauseSegment, DetectionSettings } from '@/types/audio';
import { generateId } from './audioUtils';
import { ANALYSIS_CHUNK_SIZE } from './constants';

/**
 * Detects silent segments in an AudioBuffer
 */
export async function detectSilence(
    buffer: AudioBuffer,
    settings: DetectionSettings,
    onProgress?: (progress: number) => void
): Promise<PauseSegment[]> {
    const { threshold, minDuration } = settings;
    const sampleRate = buffer.sampleRate;
    const channelData = buffer.getChannelData(0); // Use first channel

    const pauses: PauseSegment[] = [];
    const chunkSize = ANALYSIS_CHUNK_SIZE;
    const totalChunks = Math.ceil(channelData.length / chunkSize);

    let silenceStart: number | null = null;
    let silenceDbSum = 0;
    let silenceSamples = 0;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, channelData.length);

        // Calculate RMS for this chunk
        let sum = 0;
        for (let i = start; i < end; i++) {
            sum += channelData[i] * channelData[i];
        }
        const rms = Math.sqrt(sum / (end - start));

        // Convert to dB
        const db = rms > 0 ? 20 * Math.log10(rms) : -100;

        const isSilent = db < threshold;
        const currentTime = start / sampleRate;

        if (isSilent) {
            if (silenceStart === null) {
                silenceStart = currentTime;
                silenceDbSum = 0;
                silenceSamples = 0;
            }
            silenceDbSum += db;
            silenceSamples++;
        } else {
            if (silenceStart !== null) {
                const silenceEnd = currentTime;
                const duration = silenceEnd - silenceStart;

                if (duration >= minDuration) {
                    pauses.push({
                        id: generateId(),
                        start: silenceStart,
                        end: silenceEnd,
                        duration,
                        avgDb: silenceSamples > 0 ? silenceDbSum / silenceSamples : -100,
                        selected: true, // Default to selected for removal
                    });
                }

                silenceStart = null;
            }
        }

        // Report progress
        if (onProgress && chunkIndex % 100 === 0) {
            onProgress((chunkIndex / totalChunks) * 100);
        }

        // Yield to prevent UI blocking
        if (chunkIndex % 1000 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    // Handle silence at the end of the file
    if (silenceStart !== null) {
        const silenceEnd = channelData.length / sampleRate;
        const duration = silenceEnd - silenceStart;

        if (duration >= minDuration) {
            pauses.push({
                id: generateId(),
                start: silenceStart,
                end: silenceEnd,
                duration,
                avgDb: silenceSamples > 0 ? silenceDbSum / silenceSamples : -100,
                selected: true,
            });
        }
    }

    onProgress?.(100);

    return pauses;
}

/**
 * Calculates total time that will be saved by removing selected pauses
 */
export function calculateTimeSaved(pauses: PauseSegment[]): number {
    return pauses
        .filter(p => p.selected)
        .reduce((sum, p) => sum + p.duration, 0);
}

/**
 * Gets the segments to keep (inverse of selected pauses)
 */
export function getKeepSegments(
    duration: number,
    pauses: PauseSegment[]
): { start: number; end: number }[] {
    const selectedPauses = pauses
        .filter(p => p.selected)
        .sort((a, b) => a.start - b.start);

    if (selectedPauses.length === 0) {
        return [{ start: 0, end: duration }];
    }

    const segments: { start: number; end: number }[] = [];
    let lastEnd = 0;

    for (const pause of selectedPauses) {
        if (pause.start > lastEnd) {
            segments.push({ start: lastEnd, end: pause.start });
        }
        lastEnd = pause.end;
    }

    if (lastEnd < duration) {
        segments.push({ start: lastEnd, end: duration });
    }

    return segments;
}

/**
 * Filters pauses by duration threshold
 */
export function filterPausesByDuration(
    pauses: PauseSegment[],
    minDuration: number
): PauseSegment[] {
    return pauses.map(pause => ({
        ...pause,
        selected: pause.duration >= minDuration,
    }));
}
