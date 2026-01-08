// Audio file information
export interface AudioFile {
    name: string;
    size: number;
    duration: number;
    sampleRate: number;
    numberOfChannels: number;
    buffer: AudioBuffer;
}

// Detected pause/silence segment
export interface PauseSegment {
    id: string;
    start: number;  // Start time in seconds
    end: number;    // End time in seconds
    duration: number; // Duration in seconds
    avgDb: number;   // Average decibel level
    selected: boolean; // Whether to remove this pause
}

// Silence detection settings
export interface DetectionSettings {
    threshold: number;      // dB threshold (e.g., -40)
    minDuration: number;    // Minimum silence duration in seconds (DEPRECATED: alias for minPauseDuration)
    minPauseDuration: number; // Minimum silence duration
    minKeepDuration: number;  // Minimum silence to keep (padding)
    paddingBefore: number;    // Padding before silence
    paddingAfter: number;     // Padding after silence
}

// Download/export settings
export interface DownloadSettings {
    format: AudioFormat;
    bitrate: AudioBitrate;
}

// Supported audio formats
export type AudioFormat = 'mp3' | 'wav' | 'm4a' | 'ogg';

// Supported bitrates in kbps
export type AudioBitrate = 128 | 192 | 256 | 320;

// Playback state
export interface PlaybackState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    playbackRate: number;
    isMuted: boolean;
    onPlayPause: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
    onPlaybackRateChange: (rate: number) => void;
    onMuteToggle: () => void;
}

// Processing status
export interface ProcessingStatus {
    isProcessing: boolean;
    progress: number;  // 0-100
    stage: 'idle' | 'loading' | 'analyzing' | 'encoding' | 'complete' | 'error';
    message?: string;
}

// Waveform display settings
export interface WaveformSettings {
    zoom: number;
    scrollPosition: number;
}
