'use client';

import { useCallback, useState } from 'react';
import { Upload, FileAudio, AlertCircle, Music, AudioWaveform, Mic, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_EXTENSIONS, MAX_FILE_SIZE } from '@/lib/constants';
import { formatFileSize } from '@/lib/audioUtils';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    isProcessing?: boolean;
    progress?: number;
    error?: string | null;
}

// Animated waveform bars
function AnimatedWaveform() {
    return (
        <div className="flex items-center gap-[3px] h-8">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-white/40 rounded-full"
                    animate={{
                        height: [8, 20 + Math.random() * 12, 8],
                    }}
                    transition={{
                        duration: 0.8 + Math.random() * 0.4,
                        repeat: Infinity,
                        delay: i * 0.05,
                    }}
                />
            ))}
        </div>
    );
}

// Floating icons animation
function FloatingIcons() {
    const icons = [
        { Icon: Music, x: '10%', y: '20%', delay: 0 },
        { Icon: AudioWaveform, x: '85%', y: '15%', delay: 0.5 },
        { Icon: Mic, x: '15%', y: '75%', delay: 1 },
        { Icon: Volume2, x: '80%', y: '70%', delay: 1.5 },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {icons.map(({ Icon, x, y, delay }, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: x, top: y }}
                    animate={{
                        y: [0, -10, 0],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay,
                    }}
                >
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white/10" />
                </motion.div>
            ))}
        </div>
    );
}

export function UploadZone({ onFileSelect, isProcessing = false, progress = 0, error = null }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) onFileSelect(files[0]);
    }, [onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) onFileSelect(files[0]);
    }, [onFileSelect]);

    return (
        <motion.div
            className={cn(
                'relative rounded-2xl md:rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer group overflow-hidden',
                'flex flex-col items-center justify-center',
                'p-8 sm:p-12 md:p-16',
                'min-h-[280px] sm:min-h-[320px] md:min-h-[360px]',
                isDragging
                    ? 'border-white bg-white/[0.08] scale-[1.02]'
                    : 'border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]',
                isProcessing && 'pointer-events-none',
                error && 'border-red-500/50 bg-red-500/[0.02]'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
            whileHover={{ scale: isProcessing ? 1 : 1.01 }}
            whileTap={{ scale: isProcessing ? 1 : 0.99 }}
        >
            {/* Background effects */}
            <FloatingIcons />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

            {/* Glow effect on drag */}
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>

            <input
                id="file-input"
                type="file"
                accept={SUPPORTED_EXTENSIONS.join(',')}
                onChange={handleFileInput}
                className="hidden"
                disabled={isProcessing}
            />

            <AnimatePresence mode="wait">
                {isProcessing ? (
                    <motion.div
                        key="processing"
                        className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-xs relative z-10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        {/* Animated icon */}
                        <div className="relative">
                            <motion.div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 flex items-center justify-center bg-white/[0.03]"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <FileAudio className="w-7 h-7 sm:w-8 sm:h-8 text-white/80" />
                            </motion.div>

                            {/* Pulsing rings */}
                            <motion.div
                                className="absolute inset-0 rounded-full border border-white/20"
                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-full border border-white/20"
                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-lg sm:text-xl font-medium text-white/90">Processing audio...</p>
                            <p className="text-sm text-white/50 mt-1">{Math.round(progress)}% complete</p>
                        </div>

                        {/* Enhanced progress bar */}
                        <div className="w-full space-y-2">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-white/60 to-white rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <AnimatedWaveform />
                        </div>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        className="flex flex-col items-center gap-4 relative z-10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <motion.div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-red-500/30 flex items-center justify-center bg-red-500/[0.05]"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" />
                        </motion.div>
                        <div className="text-center px-4">
                            <p className="text-lg sm:text-xl font-medium text-red-400">{error}</p>
                            <p className="text-sm text-white/50 mt-2">Tap to try again</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="upload"
                        className="flex flex-col items-center gap-4 sm:gap-6 relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Upload icon with animation */}
                        <motion.div
                            className={cn(
                                'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 flex items-center justify-center transition-all',
                                isDragging
                                    ? 'border-white bg-white/10'
                                    : 'border-white/20 group-hover:border-white/40 bg-white/[0.03]'
                            )}
                            animate={isDragging ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                animate={isDragging ? { y: [-5, 0, -5] } : { y: [0, -3, 0] }}
                                transition={{ duration: isDragging ? 0.4 : 2, repeat: Infinity }}
                            >
                                <Upload className={cn(
                                    'w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-colors',
                                    isDragging ? 'text-white' : 'text-white/60 group-hover:text-white'
                                )} />
                            </motion.div>
                        </motion.div>

                        {/* Text content */}
                        <div className="text-center">
                            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white/90">
                                {isDragging ? 'Drop it here!' : 'Drop audio file here'}
                            </p>
                            <p className="text-sm sm:text-base text-white/50 mt-1 sm:mt-2">
                                or <span className="text-white/70 underline underline-offset-2">browse files</span>
                            </p>
                        </div>

                        {/* Format badges */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                            {['MP3', 'WAV', 'M4A', 'OGG', 'FLAC'].map((f, i) => (
                                <motion.span
                                    key={f}
                                    className="px-3 py-1.5 text-xs sm:text-sm border border-white/20 rounded-full text-white/60 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    {f}
                                </motion.span>
                            ))}
                        </div>

                        {/* File size info */}
                        <p className="text-xs sm:text-sm text-white/30">
                            Max file size: {formatFileSize(MAX_FILE_SIZE)}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-white/10 rounded-tl" />
            <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-white/10 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-white/10 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-white/10 rounded-br" />
        </motion.div>
    );
}
