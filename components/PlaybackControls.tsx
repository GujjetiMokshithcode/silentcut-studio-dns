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

                    <Button size="lg" onClick={onPlayPause} className="w-14 h-14">
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </Button>

                    <Button variant="ghost" size="icon" onClick={onSkipForward}>
                        <SkipForward className="w-5 h-5" />
                    </Button>
                </div>

                {/* Volume & Speed */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={onMuteToggle}>
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </Button>
                        <Slider value={[isMuted ? 0 : volume]} max={100} step={1} onValueChange={([v]) => onVolumeChange(v)} className="w-20" />
                    </div>

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
