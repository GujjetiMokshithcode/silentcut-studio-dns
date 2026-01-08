import type { AudioFormat, AudioBitrate, DetectionSettings } from '@/types/audio';

// Silence detection defaults
export const DEFAULT_DETECTION_SETTINGS: DetectionSettings = {
    threshold: -40,
    minDuration: 0.5,
    minPauseDuration: 0.5,
    minKeepDuration: 0.1,
    paddingBefore: 0.1,
    paddingAfter: 0.1
};

export const THRESHOLD_MIN = -50;
export const THRESHOLD_MAX = -20;
export const DURATION_MIN = 0.2;
export const DURATION_MAX = 5.0;

// Supported formats
export const SUPPORTED_UPLOAD_FORMATS = [
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave',
    'audio/x-wav', 'audio/m4a', 'audio/x-m4a', 'audio/mp4',
    'audio/ogg', 'audio/webm',
];

export const SUPPORTED_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.ogg', '.webm'];
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const DOWNLOAD_FORMATS: { value: AudioFormat; label: string }[] = [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAV' },
    { value: 'm4a', label: 'M4A' },
    { value: 'ogg', label: 'OGG' },
];

export const BITRATES: { value: AudioBitrate; label: string }[] = [
    { value: 128, label: '128k' },
    { value: 192, label: '192k' },
    { value: 256, label: '256k' },
    { value: 320, label: '320k' },
];

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

// Monochrome palette
export const COLORS = {
    background: '#000000',
    foreground: '#ffffff',
    waveform: '#ffffff',
    pauseHighlight: '#ff3333',
    muted: '#888888',
    border: '#222222',
};

export const ANALYSIS_CHUNK_SIZE = 512;
export const FFT_SIZE = 2048;
