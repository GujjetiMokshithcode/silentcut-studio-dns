'use client';

import { TextRoll } from "@/components/ui/animated-menu";

const sectors = [
    'AI Voices',
    'ElevenLabs',
    'PlayHT',
    'Podcasts',
    'Audiobooks',
    'Lectures',
    'Voiceovers',
    'Narrations',
    'Courses',
    'Interviews',
    'Dubbing',
    'Videos',
];

export function SectorShowcase() {
    return (
        <section className="relative bg-black overflow-hidden py-24">
            {/* Background */}
            <div className="absolute inset-0 bg-black" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Eyebrow */}
                <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-white/50 font-medium mb-4">
                    We fix pauses in
                </p>

                {/* Animated sector list */}
                <ul className="flex flex-col items-start gap-1">
                    {sectors.map((sector, index) => (
                        <li
                            key={index}
                            className="cursor-pointer"
                        >
                            <TextRoll
                                className="text-[10vw] md:text-[7vw] font-medium leading-[0.95] tracking-tight uppercase text-white/40 hover:text-white/80 transition-colors"
                            >
                                {sector}
                            </TextRoll>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}




