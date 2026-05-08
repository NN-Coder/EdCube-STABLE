import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="flex flex-col items-center min-h-[60vh] px-[5%] py-12">
      <div className="w-full max-w-4xl bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
        <h1 className="text-4xl font-heading font-bold text-primary neon-glow mb-8 uppercase tracking-wider text-center">
          Terms of Service
        </h1>

        <div className="space-y-6 text-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using EdCube ("we", "us", "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">2. Description of Service</h2>
            <p>
              EdCube provides users with access to a collection of free online games, web proxies, and community features (the "Service"). You understand and agree that the Service is provided "AS-IS" and that we assume no responsibility for the timeliness, deletion, mis-delivery, or failure to store any user communications or personalization settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">3. User Conduct</h2>
            <p className="mb-2">You agree to not use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Upload, post, email, or otherwise transmit any content that is unlawful, harmful, threatening, abusive, harassing, or otherwise objectionable.</li>
              <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
              <li>Intentionally or unintentionally violate any applicable local, state, national, or international law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">4. Intellectual Property</h2>
            <p>
              The games available on EdCube are the property of their respective owners. We respect the intellectual property rights of others and expect our users to do the same. If you believe your work has been copied in a way that constitutes copyright infringement, please use our <Link href="/dmca" className="text-accent hover:underline">DMCA Takedown Form</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">5. Disclaimer of Warranties</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">6. Limitation of Liability</h2>
            <p>
              We shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from your use or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">7. Modifications to Service</h2>
            <p>
              We reserve the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
