'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, ArrowLeft, Settings, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaveformDisplay } from '@/components/WaveformDisplay';
import { PlaybackControls } from '@/components/PlaybackControls';
import { PauseList } from '@/components/PauseList';
import { DownloadPanel } from '@/components/DownloadPanel';
import { SettingsModal } from '@/components/SettingsModal';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { PauseSegment, AudioFormat, AudioBitrate, AudioFile, DetectionSettings } from '@/types/audio';

interface AudioEditorProps {
    audioFile: AudioFile | null;
    pauses: PauseSegment[];
    settings: DetectionSettings;
    timeSaved: number;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    volume: number;
    playbackRate: number;
    isMuted: boolean;
    isExporting: boolean;
    exportProgress: number;
    isPreviewPlaying: boolean;
    isGeneratingPreview: boolean;
    cleanedBuffer: AudioBuffer | null;
    onPlayPause: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
    onPlaybackRateChange: (rate: number) => void;
    onMuteToggle: () => void;
    onSkipBack: () => void;
    onSkipForward: () => void;
    onTogglePause: (id: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onPreviewPause: (pause: PauseSegment) => void;
    onSettingsChange: (settings: DetectionSettings) => void;
    onRedetect: () => void;
    onPlayCleanedPreview: () => void;
    onDownload: (format: AudioFormat, bitrate: AudioBitrate) => void;
    buffer: AudioBuffer | null;
    frequencyData?: Uint8Array;
}

export function AudioEditor({
    audioFile,
    pauses,
    settings,
    timeSaved,
    currentTime,
    duration,
    isPlaying,
    volume,
    playbackRate,
    isMuted,
    isExporting,
    exportProgress,
    isPreviewPlaying,
    isGeneratingPreview,
    cleanedBuffer,
    onPlayPause,
    onSeek,
    onVolumeChange,
    onPlaybackRateChange,
    onMuteToggle,
    onSkipBack,
    onSkipForward,
    onTogglePause,
    onSelectAll,
    onDeselectAll,
    onPreviewPause,
    onSettingsChange,
    onRedetect,
    onPlayCleanedPreview,
    onDownload,
    buffer,
    frequencyData,
}: AudioEditorProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'pauses' | 'export'>('pauses');
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Reset view when file changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [audioFile]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.location.reload()}
                            className="hidden sm:flex"
                        >
                            <ArrowLeft className="w-5 h-5 text-white/70" />
                        </Button>
                        <div>
                            <h1 className="text-sm font-medium text-white/90 truncate max-w-[200px] sm:max-w-md">
                                {audioFile?.name || 'Untitled Project'}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                <span>{pauses.filter(p => p.selected).length} cuts</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-green-400">{timeSaved.toFixed(1)}s saved</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsSettingsOpen(true)}
                            className="gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Button>
                        <Button
                            size="sm"
                            className="gap-2 bg-white text-black hover:bg-white/90"
                            onClick={() => isMobile && setActiveTab('export')}
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-4 lg:p-6 lg:h-[calc(100vh-64px)] overflow-hidden">
                <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 h-full">

                    {/* Left Panel: Waveform & Controls */}
                    <div className="flex flex-col gap-6 h-full overflow-y-auto lg:overflow-visible">
                        {/* Waveform Card */}
                        <motion.div
                            className="flex-1 min-h-[250px] sm:min-h-[300px] bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col relative overflow-hidden group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {/* Decorative background gradients */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="flex-1 relative z-10 flex flex-col justify-center">
                                <WaveformDisplay
                                    buffer={buffer}
                                    pauses={pauses}
                                    currentTime={currentTime}
                                    duration={duration}
                                    onSeek={onSeek}
                                    frequencyData={frequencyData}
                                />
                            </div>

                            <div className="mt-8 relative z-10">
                                <PlaybackControls
                                    isPlaying={isPlaying}
                                    currentTime={currentTime}
                                    duration={duration}
                                    volume={volume}
                                    playbackRate={playbackRate}
                                    isMuted={isMuted}
                                    onPlayPause={onPlayPause}
                                    onSeek={onSeek}
                                    onVolumeChange={onVolumeChange}
                                    onPlaybackRateChange={onPlaybackRateChange}
                                    onMuteToggle={onMuteToggle}
                                    onSkipBack={onSkipBack}
                                    onSkipForward={onSkipForward}
                                />
                            </div>
                        </motion.div>

                        {/* Mobile Stats / Hints */}
                        <motion.div
                            className="lg:hidden grid grid-cols-2 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                                <p className="text-xs text-white/40 mb-1">Time Saved</p>
                                <p className="text-xl font-bold text-green-400">{timeSaved.toFixed(1)}s</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                                <p className="text-xs text-white/40 mb-1">Pauses Removed</p>
                                <p className="text-xl font-bold text-white">{pauses.filter(p => p.selected).length}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Panel: Tools */}
                    <motion.div
                        className="flex flex-col gap-6 h-full overflow-hidden"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Tab Switcher (Mobile) */}
                        <div className="lg:hidden flex p-1 bg-white/5 rounded-lg mb-2">
                            {(['pauses', 'export'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/50 hover:text-white/80'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Pause List */}
                        <div className={`
                            flex-1 bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden flex flex-col
                            ${isMobile && activeTab !== 'pauses' ? 'hidden' : 'flex'}
                        `}>
                            <PauseList
                                pauses={pauses}
                                timeSaved={timeSaved}
                                onToggle={onTogglePause}
                                onSelectAll={onSelectAll}
                                onDeselectAll={onDeselectAll}
                                onPreview={onPreviewPause}
                            />
                        </div>

                        {/* Download Panel */}
                        <div className={`
                            ${isMobile && activeTab !== 'export' ? 'hidden' : 'block'}
                        `}>
                            <DownloadPanel
                                isDisabled={pauses.filter(p => p.selected).length === 0}
                                isProcessing={isExporting}
                                progress={exportProgress}
                                onDownload={onDownload}
                            />
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Modals */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onSettingsChange={onSettingsChange}
                onRedetect={onRedetect}
            />
        </div>
    );
}
