interface JsonLdProps {
    type: 'WebApplication' | 'SoftwareApplication' | 'Organization' | 'WebPage';
}

const siteUrl = 'https://silentcut.studio';

export function JsonLd({ type }: JsonLdProps) {
    const schemas = {
        SoftwareApplication: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'SilentCut Studio',
            description: 'Remove pauses and dead air from audio instantly. Perfect for podcasters, YouTubers, AI voice users, and content creators. 100% browser-based, privacy-first.',
            url: siteUrl,
            image: `${siteUrl}/og-image.png`,
            applicationCategory: 'AudioApplication',
            operatingSystem: 'Web',
            softwareVersion: '1.0',
            downloadUrl: siteUrl,
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '150',
            },
            featureList: [
                'Remove pauses from any audio file',
                'Perfect for podcasts and YouTube videos',
                'Fix AI voice pacing issues (ElevenLabs, Murf, etc)',
                'Visual waveform editor with zoom',
                '100% local processing - files never leave device',
                'Instant results in under 60 seconds',
                'Multiple export formats (MP3, WAV, M4A, OGG)',
                'No account required',
                'Free to use',
            ],
            permissions: 'Uses browser local storage only',
        },
        WebApplication: {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'SilentCut Studio',
            description: 'Remove pauses from ElevenLabs and AI voice audio instantly.',
            url: siteUrl,
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Any',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
            },
            browserRequirements: 'Requires JavaScript. WebAssembly support recommended.',
        },
        Organization: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SilentCut Studio',
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            description: 'Post-processing tool for ElevenLabs and AI voice audio. Fix synthetic voice pause issues instantly.',
            foundingDate: '2024',
            contactPoint: {
                '@type': 'ContactPoint',
                email: 'mokshith.icon4u@gmail.com',
                contactType: 'Customer Support',
            },
            sameAs: [],
        },
        WebPage: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Remove Pauses from ElevenLabs & AI Voices | SilentCut Studio',
            description: 'Fix ElevenLabs pause issues instantly. Remove unnatural pauses from AI voice audio in seconds.',
            url: siteUrl,
            isPartOf: {
                '@type': 'WebSite',
                name: 'SilentCut Studio',
                url: siteUrl,
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schemas[type]),
            }}
        />
    );
}

export function FAQJsonLd() {
    const faqData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Why does ElevenLabs audio sound rushed?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ElevenLabs voices often ignore punctuation and create unnatural pauses. This makes the speech sound robotic and rushed. SilentCut automatically fixes this by removing unwanted pauses.',
                },
            },
            {
                '@type': 'Question',
                name: 'How do I remove pauses from ElevenLabs audio?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Upload your ElevenLabs audio to SilentCut, adjust the sensitivity, preview the results, and download the cleaned audio. Takes less than 60 seconds.',
                },
            },
            {
                '@type': 'Question',
                name: 'Is my audio private on SilentCut?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, 100% private. All processing happens in your browser using FFmpeg WASM. Your files never leave your device.',
                },
            },
            {
                '@type': 'Question',
                name: 'Does SilentCut work with other AI voices?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. SilentCut works with any synthetic voice including Google TTS, Microsoft Azure, Murf, Resemble, and others.',
                },
            },
            {
                '@type': 'Question',
                name: 'Do I need to sign up or pay?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No sign-up required. SilentCut is free to try. Premium features available for power users.',
                },
            },
            {
                '@type': 'Question',
                name: 'Can I use SilentCut for YouTube voiceovers?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! SilentCut is perfect for YouTube creators using AI voices. Clean up voiceovers and make your content sound more professional.',
                },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(faqData),
            }}
        />
    );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
    const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbData),
            }}
        />
    );
}
