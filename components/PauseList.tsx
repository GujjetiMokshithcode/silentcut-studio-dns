'use client';

import { Play, Check, X, Clock, Trash2 } from 'lucide-react';
import type { PauseSegment } from '@/types/audio';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTime } from '@/lib/audioUtils';

interface PauseListProps {
    pauses: PauseSegment[];
    timeSaved: number;
    onToggle: (id: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onPreview: (pause: PauseSegment) => void;
}

export function PauseList({ pauses, timeSaved, onToggle, onSelectAll, onDeselectAll, onPreview }: PauseListProps) {
    const selectedCount = pauses.filter((p) => p.selected).length;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-white/40" />
                        Pauses to Remove
                    </h2>
                    <span className="text-xs text-white/40">{pauses.length} found</span>
                </div>
            </div>

            {/* Bulk Actions */}
            <div className="p-3 flex gap-2 border-b border-white/10">
                <Button variant="outline" size="sm" onClick={onSelectAll} className="flex-1 text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    All
                </Button>
                <Button variant="outline" size="sm" onClick={onDeselectAll} className="flex-1 text-xs">
                    <X className="w-3 h-3 mr-1" />
                    None
                </Button>
            </div>

            {/* List */}
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {pauses.length === 0 ? (
                        <div className="text-center py-12 text-white/30">
                            <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
                            <p>No pauses detected</p>
                            <p className="text-xs mt-1">Try adjusting settings</p>
                        </div>
                    ) : (
                        pauses.map((pause) => (
                            <div
                                key={pause.id}
                                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer
                  ${pause.selected
                                        ? 'bg-red-500/10 border border-red-500/20'
                                        : 'bg-white/[0.02] border border-transparent hover:border-white/10'}
                `}
                                onClick={() => onToggle(pause.id)}
                            >
                                <Checkbox checked={pause.selected} onCheckedChange={() => onToggle(pause.id)} />

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium font-mono">
                                        {formatTime(pause.start)} → {formatTime(pause.end)}
                                    </p>
                                    <p className="text-xs text-white/40">{pause.duration.toFixed(1)}s</p>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); onPreview(pause); }}
                                    className="shrink-0 w-8 h-8"
                                >
                                    <Play className="w-3 h-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
