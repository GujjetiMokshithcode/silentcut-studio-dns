'use client';

import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatTime } from '@/lib/audioUtils';
import { PLAYBACK_SPEEDS } from '@/lib/constants';

interface PlaybackControlsProps {
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
    onSkipBack: () => void;
    onSkipForward: () => void;
}

export function PlaybackControls({
    isPlaying, currentTime, duration, volume, playbackRate, isMuted,
    onPlayPause, onSeek, onVolumeChange, onPlaybackRateChange, onMuteToggle, onSkipBack, onSkipForward,
}: PlaybackControlsProps) {
    return (
        <div className="space-y-6">
            {/* Seekbar */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-white/50 w-14 text-right">{formatTime(currentTime)}</span>
                <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={([v]) => onSeek(v)} className="flex-1" />
                <span className="text-sm font-mono text-white/50 w-14">{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                {/* Playback */}
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={onSkipBack}>
                        <SkipBack className="w-5 h-5" />
                    </Button>

                    <button
                        onClick={onPlayPause}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black ml-0.5" />}
                    </button>

                    <Button variant="ghost" size="icon" onClick={onSkipForward}>
                        <SkipForward className="w-5 h-5" />
                    </Button>
                </div>

                {/* Volume & Speed */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Volume - hidden on mobile, visible on sm+ */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={onMuteToggle}>
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </Button>
                        <Slider value={[isMuted ? 0 : volume]} max={100} step={1} onValueChange={([v]) => onVolumeChange(v)} className="w-20" />
                    </div>

                    {/* Mute button only on mobile */}
                    <Button variant="ghost" size="icon" onClick={onMuteToggle} className="sm:hidden">
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-14 font-mono text-xs">
                                {playbackRate}×
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {PLAYBACK_SPEEDS.map((s) => (
                                <DropdownMenuItem key={s} onClick={() => onPlaybackRateChange(s)}>
                                    {s}×
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
