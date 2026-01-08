'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Scissors, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Landing page components
import { HeroSection } from '@/components/landing/HeroSection';
import { SectorShowcase } from '@/components/landing/SectorShowcase';
import { BentoFeaturesGrid } from '@/components/ui/bento-grid-01';
import { CapabilitiesGrid } from '@/components/ui/capabilities-grid';
import { UseCasesSlider } from '@/components/ui/use-cases-slider';
import { StatsSection } from '@/components/landing/StatsSection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { JsonLd, FAQJsonLd } from '@/components/JsonLd';

// Dashboard component
import { AudioEditor } from '@/components/dashboard/AudioEditor';

// Hooks and utilities
import { useAudioProcessing } from '@/hooks/useAudioProcessing';
import { useSilenceDetection } from '@/hooks/useSilenceDetection';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';
import { audioBufferToWav, formatTime } from '@/lib/audioUtils';
import { exportAudio, generateFilename, downloadBlob } from '@/lib/ffmpegHelper';
import { getKeepSegments } from '@/lib/silenceDetector';
import type { AudioFormat, AudioBitrate, PauseSegment } from '@/types/audio';

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Audio state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [cleanedBuffer, setCleanedBuffer] = useState<AudioBuffer | null>(null);

  // Hooks
  const { audioFile, status: loadStatus, error: loadError, processFile, reset: resetAudio } = useAudioProcessing();
  const { pauses, settings, status: detectStatus, timeSaved, updateSettings, detect, togglePause, selectAll, deselectAll, reset: resetDetection } = useSilenceDetection();

  // Setup audio visualizer
  const frequencyData = useAudioVisualizer(audioRef.current);

  // Setup audio URL when file loads
  useEffect(() => {
    if (audioFile?.buffer) {
      const blob = audioBufferToWav(audioFile.buffer);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile?.buffer]);

  // Auto-detect silence when audio loads
  useEffect(() => {
    if (audioFile?.buffer && loadStatus.stage === 'complete') {
      detect(audioFile.buffer);
    }
  }, [audioFile?.buffer, loadStatus.stage, detect]);

  // Audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  // Reset preview when pauses change
  useEffect(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setIsPreviewPlaying(false);
      setCleanedBuffer(null);
    }
  }, [pauses]);

  // Handlers
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
    if (v > 0) setIsMuted(false);
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, []);

  const handleMuteToggle = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleSkipBack = useCallback(() => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
  }, []);

  const handleSkipForward = useCallback(() => {
    if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
  }, []);

  const handlePreviewPause = useCallback((pause: PauseSegment) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, pause.start - 1);
    audioRef.current.play();
    setIsPlaying(true);
    const stopTime = pause.end + 1;
    const check = setInterval(() => {
      if (audioRef.current && audioRef.current.currentTime >= stopTime) {
        audioRef.current.pause();
        setIsPlaying(false);
        clearInterval(check);
      }
    }, 100);
  }, []);

  const handleRedetect = useCallback(() => {
    if (audioFile?.buffer) detect(audioFile.buffer);
  }, [audioFile?.buffer, detect]);

  const handlePlayCleanedPreview = useCallback(async () => {
    if (!audioFile?.buffer) return;
    if (isPreviewPlaying && previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
      return;
    }
    if (!previewUrl) {
      setIsGeneratingPreview(true);
      try {
        const segments = getKeepSegments(audioFile.buffer.duration, pauses);
        const sampleRate = audioFile.buffer.sampleRate;
        const numChannels = audioFile.buffer.numberOfChannels;
        const totalLength = segments.reduce((sum, seg) => sum + Math.floor((seg.end - seg.start) * sampleRate), 0);
        const newBuffer = new AudioContext().createBuffer(numChannels, totalLength, sampleRate);
        let offset = 0;
        for (const segment of segments) {
          const startSample = Math.floor(segment.start * sampleRate);
          const endSample = Math.floor(segment.end * sampleRate);
          const length = endSample - startSample;
          for (let ch = 0; ch < numChannels; ch++) {
            const sourceData = audioFile.buffer.getChannelData(ch);
            const destData = newBuffer.getChannelData(ch);
            for (let i = 0; i < length && (startSample + i) < sourceData.length; i++) {
              destData[offset + i] = sourceData[startSample + i];
            }
          }
          offset += length;
        }
        const blob = audioBufferToWav(newBuffer);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setCleanedBuffer(newBuffer);
        if (previewAudioRef.current) {
          previewAudioRef.current.src = url;
          await previewAudioRef.current.play();
          setIsPreviewPlaying(true);
        }
      } catch (err) {
        console.error('Preview generation failed:', err);
      } finally {
        setIsGeneratingPreview(false);
      }
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.currentTime = 0;
        await previewAudioRef.current.play();
        setIsPreviewPlaying(true);
      }
    }
  }, [audioFile?.buffer, pauses, previewUrl, isPreviewPlaying]);

  const handleDownload = useCallback(async (format: AudioFormat, bitrate: AudioBitrate) => {
    if (!audioFile?.buffer) return;
    setIsExporting(true);
    setExportProgress(0);
    try {
      const segments = getKeepSegments(audioFile.buffer.duration, pauses);
      const blob = await exportAudio(audioFile.buffer, segments, format, bitrate, (p) => setExportProgress(p));
      downloadBlob(blob, generateFilename(audioFile.name, format));
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [audioFile, pauses]);

  const handleReset = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setAudioUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    resetAudio();
    resetDetection();
  }, [resetAudio, resetDetection]);

  // Derived state
  const isLoading = loadStatus.isProcessing || detectStatus.isProcessing;
  const hasAudio = audioFile !== null;
  const duration = audioFile?.duration || 0;

  return (
    <div className="min-h-screen bg-black text-white noise">
      {/* SEO Structured Data */}
      <JsonLd type="SoftwareApplication" />
      <JsonLd type="Organization" />
      <FAQJsonLd />
      {/* Header - Only shown in dashboard mode */}
      {hasAudio && (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl shadow-2xl shadow-black/20">
            <div className="px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center shadow-lg">
                  <Scissors className="w-4 h-4 text-black" />
                </div>
                <span className="text-lg font-bold tracking-tight">SilentCut</span>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-white/60 hover:text-white">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New file
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={hasAudio ? "pt-24 relative" : "relative"}>
        {!hasAudio ? (
          /* Landing Page */
          <div>
            <HeroSection
              onFileSelect={processFile}
              isProcessing={isLoading}
              progress={loadStatus.progress || detectStatus.progress}
              error={loadError}
              isDetecting={detectStatus.isProcessing}
              detectProgress={detectStatus.progress}
            />
            <SectorShowcase />
            <BentoFeaturesGrid />
            <StatsSection />
            <UseCasesSlider />
            <CapabilitiesGrid />
            <PrivacySection />
            <CTASection
              onFileSelect={processFile}
              isProcessing={isLoading}
              progress={loadStatus.progress || detectStatus.progress}
              error={loadError}
              isDetecting={detectStatus.isProcessing}
              detectProgress={detectStatus.progress}
            />
            <Footer />
          </div>
        ) : (
          /* Dashboard */
          <AudioEditor
            audioFile={audioFile}
            buffer={audioFile?.buffer || null}
            frequencyData={frequencyData}
            pauses={pauses}
            settings={settings}
            timeSaved={timeSaved}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            volume={volume}
            playbackRate={playbackRate}
            isMuted={isMuted}
            isExporting={isExporting}
            exportProgress={exportProgress}
            isPreviewPlaying={isPreviewPlaying}
            isGeneratingPreview={isGeneratingPreview}
            cleanedBuffer={cleanedBuffer}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onPlaybackRateChange={handlePlaybackRateChange}
            onMuteToggle={handleMuteToggle}
            onSkipBack={handleSkipBack}
            onSkipForward={handleSkipForward}
            onTogglePause={togglePause}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onPreviewPause={handlePreviewPause}
            onSettingsChange={updateSettings}
            onRedetect={handleRedetect}
            onPlayCleanedPreview={handlePlayCleanedPreview}
            onDownload={handleDownload}
          />
        )}
      </main>

      {/* Hidden audio elements */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" style={{ display: 'none' }} />}
      <audio ref={previewAudioRef} preload="auto" style={{ display: 'none' }} onEnded={() => setIsPreviewPlaying(false)} />
    </div>
  );
}

