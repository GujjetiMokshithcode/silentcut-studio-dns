import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'Terms of Service | SilentCut Studio',
    description: 'Terms of Service for SilentCut Studio.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/20">
            <JsonLd type="WebPage" />
            <div className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="mb-12">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/70 mb-6">
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-white/50">Last updated: January 2026</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
                        <p className="text-white/70 leading-relaxed">
                            By accessing and using SilentCut Studio, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
                        <p className="text-white/70 leading-relaxed">
                            SilentCut provides a browser-based audio editing tool specializing in automated silence removal. The service is provided "as is" and "as available".
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">3. User Conduct</h2>
                        <p className="text-white/70 leading-relaxed">
                            You agree to use SilentCut only for lawful purposes. You are solely responsible for the audio content you process using our tool. Since processing happens locally on your device, we do not claim any ownership or control over your content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">4. Intellectual Property</h2>
                        <p className="text-white/70 leading-relaxed">
                            The SilentCut interface, branding, and code usage are the intellectual property of SilentCut Studio. You typically retain copyright of any content you create or process using the tool.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">5. Disclaimer of Warranties</h2>
                        <p className="text-white/70 leading-relaxed">
                            SilentCut Studio expressly disclaims all warranties of any kind, whether express or implied. We make no warranty that the service will meet your requirements or that the service will be uninterrupted, timely, secure, or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">6. Limitation of Liability</h2>
                        <p className="text-white/70 leading-relaxed">
                            In no event shall SilentCut Studio be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from the use or the inability to use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">7. Changes to Terms</h2>
                        <p className="text-white/70 leading-relaxed">
                            We reserve the right to modify these terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">8. Contact Information</h2>
                        <p className="text-white/70 leading-relaxed">
                            Questions about the Terms of Service should be sent to us at: <a href="mailto:mokshith.icon4u@gmail.com" className="text-primary hover:underline">mokshith.icon4u@gmail.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
