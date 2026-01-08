'use client';

import { useState } from 'react';
import { X, FileAudio } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { UploadZone } from '@/components/UploadZone';
import { WebGLHero } from '@/components/ui/webgl-hero';

interface HeroSectionProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
    progress: number;
    error: string | null;
    isDetecting: boolean;
    detectProgress: number;
}

export function HeroSection({
    onFileSelect,
    isProcessing,
    progress,
    error,
    isDetecting,
    detectProgress
}: HeroSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* WebGL Hero with integrated navigation */}
            <WebGLHero onTryFree={() => setIsModalOpen(true)} />

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => !isProcessing && !isDetecting && setIsModalOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-2xl mx-4 p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 shadow-2xl">
                        {/* Close button */}
                        {!isProcessing && !isDetecting && (
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        )}

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                                <FileAudio className="w-8 h-8 text-white/70" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Upload your audio</h2>
                            <p className="text-white/50">Drag and drop or click to select a file</p>
                        </div>

                        {/* Upload Zone */}
                        <UploadZone
                            onFileSelect={onFileSelect}
                            isProcessing={isProcessing}
                            progress={progress}
                            error={error}
                        />

                        {isDetecting && (
                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between text-sm text-white/50">
                                    <span>Analyzing audio...</span>
                                    <span>{Math.round(detectProgress)}%</span>
                                </div>
                                <Progress value={detectProgress} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
