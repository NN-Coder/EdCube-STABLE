import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center min-h-[60vh] px-[5%] py-12">
      <div className="w-full max-w-4xl bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
        <h1 className="text-4xl font-heading font-bold text-primary neon-glow mb-8 uppercase tracking-wider text-center">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">1. Information We Collect</h2>
            <p className="mb-2">When you use EdCube, we may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Account Information:</strong> When you create an account, we collect your email address, username, and optionally a profile picture.</li>
              <li><strong>Usage Data:</strong> We automatically collect information about how you interact with our website, including the games you play, time spent, and pages visited.</li>
              <li><strong>Device Information:</strong> We may collect device-specific information such as your operating system, browser type, and IP address.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">2. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide, maintain, and improve our services and games.</li>
              <li>Personalize your experience on EdCube.</li>
              <li>Respond to your comments, questions, and customer service requests.</li>
              <li>Monitor and analyze usage trends and activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">5. Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete the information we have on you. You can manage your account information directly from your <Link href="/account" className="text-accent hover:underline">Account Settings</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-3">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
