'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        UnicornStudio?: {
            isInitialized?: boolean;
            init?: () => void;
        };
    }
}

export function AudioTransition() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (scriptLoaded.current) return;
        scriptLoaded.current = true;

        if (!window.UnicornStudio) {
            window.UnicornStudio = { isInitialized: false };
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.0/dist/unicornStudio.umd.js';
            script.onload = () => {
                if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
                    window.UnicornStudio.init?.();
                    window.UnicornStudio.isInitialized = true;
                }
            };
            document.head.appendChild(script);
        }
    }, []);

    return (
        <section className="relative w-full h-[50vh] overflow-hidden bg-black">
            {/* Unicorn Studio Canvas - Scaled to hide watermark */}
            <div className="absolute inset-0 overflow-hidden">
                {/* 
                    CSS Masking technique to hide watermark:
                    - Scale the embed to 110% 
                    - Use negative margins to center
                    - Parent overflow:hidden clips the watermark outside bounds
                */}
                <div
                    ref={containerRef}
                    data-us-project="xzxO56CJPoKASXo20h4m"
                    className="absolute w-[130%] h-[130%] -left-[15%] -top-[15%]"
                    style={{
                        transform: 'scale(1.25)',
                        transformOrigin: 'center center',
                    }}
                />
            </div>

            {/* Overlay Text - Minimal */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white/85 text-center leading-tight px-6">
                    Micro-pauses break the illusion.
                </h2>
                <p className="text-lg md:text-xl text-white/50 mt-3">
                    We remove them.
                </p>
            </div>

            {/* Top gradient for transition from CTA section */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />

            {/* Bottom gradient to cover any remaining watermark edges */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
