'use client';

import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { DetectionSettings } from '@/types/audio';
import { THRESHOLD_MIN, THRESHOLD_MAX, DURATION_MIN, DURATION_MAX } from '@/lib/constants';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: DetectionSettings;
    onSettingsChange: (settings: DetectionSettings) => void;
    onRedetect: () => void;
}

const DEFAULT_SETTINGS: DetectionSettings = {
    threshold: -40,
    minPauseDuration: 0.5,
    minDuration: 0.5, // Legacy support
    minKeepDuration: 0.1,
    paddingBefore: 0.1,
    paddingAfter: 0.1
};

export function SettingsModal({
    isOpen,
    onClose,
    settings,
    onSettingsChange,
    onRedetect,
}: SettingsModalProps) {
    const handleReset = () => {
        onSettingsChange(DEFAULT_SETTINGS);
    };

    const handleApply = () => {
        onRedetect();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-black/90 border-white/10 text-white backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Detection Settings</DialogTitle>
                    <DialogDescription className="text-white/50">
                        Adjust how silence is detected in your audio file.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Threshold */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-white/90">
                                Silence Threshold
                            </label>
                            <span className="text-sm text-white font-mono">
                                {settings.threshold} dB
                            </span>
                        </div>
                        <Slider
                            value={[settings.threshold]}
                            min={THRESHOLD_MIN}
                            max={THRESHOLD_MAX}
                            step={1}
                            onValueChange={([value]) => onSettingsChange({ ...settings, threshold: value })}
                        />
                        <p className="text-xs text-white/40">
                            Lower values detect quieter sounds as silence. Default: -40 dB
                        </p>
                    </div>

                    {/* Minimum Duration */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-white/90">
                                Minimum Duration
                            </label>
                            <span className="text-sm text-white font-mono">
                                {settings.minPauseDuration.toFixed(1)} s
                            </span>
                        </div>
                        <Slider
                            value={[settings.minPauseDuration]}
                            min={DURATION_MIN}
                            max={DURATION_MAX}
                            step={0.1}
                            onValueChange={([value]) => onSettingsChange({ ...settings, minPauseDuration: value })}
                        />
                        <p className="text-xs text-white/40">
                            Pauses shorter than this will be ignored. Default: 0.5 s
                        </p>
                    </div>

                    {/* Padding Before/After */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white/90">Padding Before</label>
                            <Slider
                                value={[settings.paddingBefore * 1000]}
                                min={0}
                                max={500}
                                step={10}
                                onValueChange={([v]) => onSettingsChange({ ...settings, paddingBefore: v / 1000 })}
                            />
                            <p className="text-xs text-white/40 text-right font-mono">{(settings.paddingBefore * 1000).toFixed(0)}ms</p>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white/90">Padding After</label>
                            <Slider
                                value={[settings.paddingAfter * 1000]}
                                min={0}
                                max={500}
                                step={10}
                                onValueChange={([v]) => onSettingsChange({ ...settings, paddingAfter: v / 1000 })}
                            />
                            <p className="text-xs text-white/40 text-right font-mono">{(settings.paddingAfter * 1000).toFixed(0)}ms</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleReset} className="border-white/10 hover:bg-white/5 hover:text-white">
                        Reset Default
                    </Button>
                    <Button onClick={handleApply} className="bg-white text-black hover:bg-white/90">
                        Apply & Detect
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
