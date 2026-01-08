import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { AudioFormat, AudioBitrate } from '@/types/audio';
import { audioBufferToWav } from './audioUtils';

let ffmpeg: FFmpeg | null = null;
let isLoading = false;

/**
 * Initialize FFmpeg WASM
 */
export async function initFFmpeg(
    onProgress?: (progress: number) => void
): Promise<FFmpeg> {
    if (ffmpeg && ffmpeg.loaded) {
        return ffmpeg;
    }

    if (isLoading) {
        // Wait for loading to complete
        while (isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (ffmpeg && ffmpeg.loaded) {
            return ffmpeg;
        }
    }

    isLoading = true;

    try {
        ffmpeg = new FFmpeg();

        ffmpeg.on('progress', ({ progress }) => {
            onProgress?.(progress * 100);
        });

        // Load FFmpeg core from CDN using direct URLs
        // Use umd version which works better with bundlers
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        await ffmpeg.load({
            coreURL: `${baseURL}/ffmpeg-core.js`,
            wasmURL: `${baseURL}/ffmpeg-core.wasm`,
        });

        isLoading = false;
        return ffmpeg;
    } catch (error) {
        isLoading = false;
        throw new Error(`Failed to load FFmpeg: ${error}`);
    }
}

/**
 * Get FFmpeg codec and extension for format
 */
function getCodecForFormat(format: AudioFormat): { codec: string; ext: string } {
    switch (format) {
        case 'mp3':
            return { codec: 'libmp3lame', ext: 'mp3' };
        case 'wav':
            return { codec: 'pcm_s16le', ext: 'wav' };
        case 'm4a':
            return { codec: 'aac', ext: 'm4a' };
        case 'ogg':
            return { codec: 'libvorbis', ext: 'ogg' };
        default:
            return { codec: 'libmp3lame', ext: 'mp3' };
    }
}

/**
 * Export audio with selected pauses removed
 */
export async function exportAudio(
    buffer: AudioBuffer,
    segments: { start: number; end: number }[],
    format: AudioFormat,
    bitrate: AudioBitrate,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    const ff = await initFFmpeg();

    onProgress?.(10);

    // Create a new audio buffer with only the keep segments
    const sampleRate = buffer.sampleRate;
    const numChannels = buffer.numberOfChannels;

    // Calculate total length of kept segments
    const totalLength = segments.reduce((sum, seg) => {
        return sum + Math.floor((seg.end - seg.start) * sampleRate);
    }, 0);

    // Create new buffer
    const audioContext = new OfflineAudioContext(numChannels, totalLength, sampleRate);
    const newBuffer = audioContext.createBuffer(numChannels, totalLength, sampleRate);

    // Copy segments
    let offset = 0;
    for (const segment of segments) {
        const startSample = Math.floor(segment.start * sampleRate);
        const endSample = Math.floor(segment.end * sampleRate);
        const length = endSample - startSample;

        for (let ch = 0; ch < numChannels; ch++) {
            const sourceData = buffer.getChannelData(ch);
            const destData = newBuffer.getChannelData(ch);

            for (let i = 0; i < length && (startSample + i) < sourceData.length; i++) {
                destData[offset + i] = sourceData[startSample + i];
            }
        }
        offset += length;
    }

    onProgress?.(30);

    // Convert to WAV
    const wavBlob = audioBufferToWav(newBuffer);
    const wavData = await fetchFile(wavBlob);

    onProgress?.(50);

    // Write input file
    await ff.writeFile('input.wav', wavData);

    onProgress?.(60);

    // Get codec info
    const { codec, ext } = getCodecForFormat(format);
    const outputFile = `output.${ext}`;

    // Build FFmpeg command
    const args = ['-i', 'input.wav'];

    if (format !== 'wav') {
        args.push('-c:a', codec);
        args.push('-b:a', `${bitrate}k`);
    }

    args.push('-y', outputFile);

    // Run FFmpeg
    await ff.exec(args);

    onProgress?.(90);

    // Read output file
    const data = await ff.readFile(outputFile);

    // Cleanup
    await ff.deleteFile('input.wav');
    await ff.deleteFile(outputFile);

    onProgress?.(100);

    // Return as blob
    const mimeTypes: Record<AudioFormat, string> = {
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        m4a: 'audio/mp4',
        ogg: 'audio/ogg',
    };

    // Ensure data is a proper ArrayBuffer for Blob
    let blobData: BlobPart;
    if (data instanceof Uint8Array) {
        // Create a copy to ensure we have a regular ArrayBuffer
        blobData = new Uint8Array(data) as unknown as BlobPart;
    } else {
        blobData = new TextEncoder().encode(data as string) as unknown as BlobPart;
    }

    return new Blob([blobData], { type: mimeTypes[format] });
}

/**
 * Generate download filename
 */
export function generateFilename(
    originalName: string,
    format: AudioFormat
): string {
    const baseName = originalName.replace(/\.[^.]+$/, '');
    const timestamp = new Date().toISOString().slice(0, 10);
    return `${baseName}_silentcut_${timestamp}.${format}`;
}

/**
 * Trigger file download
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
