import type { AudioFile } from '@/types/audio';
import { SUPPORTED_UPLOAD_FORMATS, MAX_FILE_SIZE, SUPPORTED_EXTENSIONS } from './constants';

/**
 * Validates an uploaded file
 */
export function validateAudioFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: `File exceeds 100MB limit (${formatFileSize(file.size)})` };
    }

    // Check file type
    const isValidType = SUPPORTED_UPLOAD_FORMATS.includes(file.type);
    const hasValidExtension = SUPPORTED_EXTENSIONS.some(ext =>
        file.name.toLowerCase().endsWith(ext)
    );

    if (!isValidType && !hasValidExtension) {
        return {
            valid: false,
            error: 'Format not supported. Try MP3, WAV, M4A, OGG, or WEBM'
        };
    }

    return { valid: true };
}

/**
 * Loads an audio file into an AudioBuffer
 */
export async function loadAudioFile(
    file: File,
    onProgress?: (progress: number) => void
): Promise<AudioFile> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = (event.loaded / event.total) * 50; // First 50% for reading
                onProgress(progress);
            }
        };

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                if (!arrayBuffer) {
                    throw new Error('Failed to read file');
                }

                onProgress?.(60);

                // Create audio context
                const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

                onProgress?.(70);

                // Decode audio data
                const buffer = await audioContext.decodeAudioData(arrayBuffer);

                onProgress?.(100);

                const audioFile: AudioFile = {
                    name: file.name,
                    size: file.size,
                    duration: buffer.duration,
                    sampleRate: buffer.sampleRate,
                    numberOfChannels: buffer.numberOfChannels,
                    buffer,
                };

                resolve(audioFile);
            } catch {
                reject(new Error('Unable to decode audio file. The file may be corrupted.'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read the file'));
        };

        reader.readAsArrayBuffer(file);
    });
}

/**
 * Formats seconds to MM:SS or HH:MM:SS
 */
export function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '00:00';

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats file size to human readable string
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates an audio element from an AudioBuffer
 */
export function createAudioElement(buffer: AudioBuffer): HTMLAudioElement {
    const audioContext = new AudioContext();
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    // Convert AudioBuffer to WAV blob
    const wavBlob = audioBufferToWav(buffer);
    const url = URL.createObjectURL(wavBlob);

    const audio = new Audio(url);
    return audio;
}

/**
 * Converts AudioBuffer to WAV Blob
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;

    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Write audio data
    const channels: Float32Array[] = [];
    for (let i = 0; i < numChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
            const sample = Math.max(-1, Math.min(1, channels[ch][i]));
            const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, intSample, true);
            offset += 2;
        }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
}

/**
 * Extracts waveform data from AudioBuffer for visualization
 */
export function getWaveformData(buffer: AudioBuffer, samples: number = 1000): number[] {
    const channelData = buffer.getChannelData(0); // Use first channel
    const blockSize = Math.floor(channelData.length / samples);
    const waveformData: number[] = [];

    for (let i = 0; i < samples; i++) {
        const start = i * blockSize;
        let sum = 0;

        for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[start + j] || 0);
        }

        waveformData.push(sum / blockSize);
    }

    // Normalize
    const max = Math.max(...waveformData, 0.001);
    return waveformData.map(v => v / max);
}
