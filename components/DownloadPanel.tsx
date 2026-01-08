'use client';

import { useState } from 'react';
import { Download, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AudioFormat, AudioBitrate } from '@/types/audio';
import { DOWNLOAD_FORMATS, BITRATES } from '@/lib/constants';

interface DownloadPanelProps {
    isDisabled: boolean;
    isProcessing: boolean;
    progress: number;
    onDownload: (format: AudioFormat, bitrate: AudioBitrate) => void;
}

export function DownloadPanel({ isDisabled, isProcessing, progress, onDownload }: DownloadPanelProps) {
    const [format, setFormat] = useState<AudioFormat>('mp3');
    const [bitrate, setBitrate] = useState<AudioBitrate>(192);

    const selectedFormat = DOWNLOAD_FORMATS.find((f) => f.value === format);
    const selectedBitrate = BITRATES.find((b) => b.value === bitrate);

    return (
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-sm font-medium mb-4 text-white/60">Export Settings</h3>

            <div className="space-y-4">
                {/* Format & Bitrate */}
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex-1 justify-between">
                                {selectedFormat?.label || 'MP3'}
                                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {DOWNLOAD_FORMATS.map((f) => (
                                <DropdownMenuItem key={f.value} onClick={() => setFormat(f.value)}>
                                    {f.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {format !== 'wav' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex-1 justify-between">
                                    {selectedBitrate?.label || '192k'}
                                    <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {BITRATES.map((b) => (
                                    <DropdownMenuItem key={b.value} onClick={() => setBitrate(b.value)}>
                                        {b.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Progress */}
                {isProcessing && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-white/50">
                            <span>Encoding...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} />
                    </div>
                )}

                {/* Download Button */}
                <Button
                    className="w-full"
                    size="lg"
                    disabled={isDisabled || isProcessing}
                    onClick={() => onDownload(format, bitrate)}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Encoding...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4 mr-2" />
                            Download {selectedFormat?.label}
                        </>
                    )}
                </Button>

                {isDisabled && !isProcessing && (
                    <p className="text-xs text-center text-white/30">Select at least one pause to remove</p>
                )}
            </div>
        </div>
    );
}
