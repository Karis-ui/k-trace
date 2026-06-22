export default function Privacy() {
  return (
    <div className="p-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-green1 mb-4">Privacy Policy</h1>
      <p className="mb-4 text-muted-foreground">
        At <span className="font-semibold text-green2">Kahawa Trace</span>, we respect your privacy and are
        committed to safeguarding the personal information of farmers, partners, and users of our platform.
        This policy explains how we collect, use, and protect your data.
      </p>

      <div className="space-y-4">
        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInLeft">
          <h2 className="font-semibold text-green2 mb-2">Information We Collect</h2>
          <p className="text-muted-foreground">
            We only gather data that is necessary to provide our services, such as farmer registration
            details, delivery records, and platform usage statistics.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInRight">
          <h2 className="font-semibold text-green2 mb-2">How We Use Your Data</h2>
          <p className="text-muted-foreground">
            Your information helps us provide accurate market insights, trace coffee deliveries,
            and ensure transparency across the supply chain. We never sell your data to third parties.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInLeft">
          <h2 className="font-semibold text-green2 mb-2">Data Security</h2>
          <p className="text-muted-foreground">
            All data is stored securely with industry-standard encryption methods. Only authorized personnel
            can access sensitive records to support your needs.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInRight">
          <h2 className="font-semibold text-green2 mb-2">Your Rights</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>You may request to view or update your data at any time.</li>
            <li>You can request permanent deletion of your account and data.</li>
            <li>You may opt out of receiving notifications or marketing messages.</li>
          </ul>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInLeft">
          <h2 className="font-semibold text-green2 mb-2">Cookies</h2>
          <p className="text-muted-foreground">
            We use cookies to enhance your experience and improve platform performance.
            You can disable cookies in your browser settings without losing access to core features.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInRight">
          <h2 className="font-semibold text-green2 mb-2">Contact Us</h2>
          <p className="text-muted-foreground">
            For any questions regarding this policy, please contact our support team at{" "}
            <a href="mailto:privacy@kahawatrace.co.ke" className="text-green2 hover:underline">
              privacy@kahawatrace.co.ke
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
