import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'Privacy Policy | SilentCut Studio',
    description: 'Privacy Policy for SilentCut Studio. We prioritize your privacy with 100% local processing.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/20">
            <JsonLd type="WebPage" />
            <div className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="mb-12">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/70 mb-6">
                        Privacy First
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-white/50">Last updated: January 2026</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">1. Local Processing Only</h2>
                        <p className="text-white/70 leading-relaxed">
                            SilentCut operates with a strictly <strong>local-first</strong> architecture. When you use our service, your audio files are processed entirely within your web browser using WebAssembly technology.
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
                            <li>Your audio files never leave your device</li>
                            <li>We do not upload your content to any server</li>
                            <li>We do not store, analyze, or listen to your audio</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">2. Data Collection</h2>
                        <p className="text-white/70 leading-relaxed">
                            We collect minimal, anonymous data to improve the service:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
                            <li><strong>Usage Analytics:</strong> We use Vercel Analytics to track page views and basic interactions (e.g., number of files processed) to understand usage patterns. This data is aggregated and does not identify individuals.</li>
                            <li><strong>Performance Metrics:</strong> We use Vercel Speed Insights to monitor website performance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">3. Cookies and Local Storage</h2>
                        <p className="text-white/70 leading-relaxed">
                            We use local storage solely to save your preferences (such as theme or editor settings) to enhance your experience. We do not use cookies for tracking or advertising purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">4. Third-Party Services</h2>
                        <p className="text-white/70 leading-relaxed">
                            Our website is hosted on Vercel. Please refer to <a href="https://vercel.com/legal/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Vercel's Privacy Policy</a> for more information on how they handle data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">5. Contact Us</h2>
                        <p className="text-white/70 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:mokshith.icon4u@gmail.com" className="text-primary hover:underline">mokshith.icon4u@gmail.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
