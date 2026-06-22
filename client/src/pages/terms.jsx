export default function Terms() {
  return (
    <div className="p-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-green1 mb-4">Terms and Conditions</h1>
      <p className="mb-4 text-muted-foreground">
        By using <span className="font-semibold text-green2">Kahawa Trace</span>, you agree to the following
        terms and conditions. These guidelines are designed to protect our farmers, partners, and platform
        users while ensuring transparency and accountability in the coffee supply chain.
      </p>

      <div className="space-y-4">
        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInLeft">
          <h2 className="font-semibold text-green2 mb-2">Account Responsibilities</h2>
          <p className="text-muted-foreground">
            All users must provide accurate and up-to-date information when registering or updating their
            farm profiles. Sharing false or misleading details may result in suspension or termination of
            your account.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInRight">
          <h2 className="font-semibold text-green2 mb-2">Use of Services</h2>
          <p className="text-muted-foreground">
            Kahawa Trace provides tools to track coffee deliveries, market prices, and farmer records.
            Information provided through the platform is for reference only and should be independently
            verified before making business or trading decisions.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInLeft">
          <h2 className="font-semibold text-green2 mb-2">Limitations of Liability</h2>
          <p className="text-muted-foreground">
            While we strive to provide accurate and timely information, Kahawa Trace is not responsible
            for financial, business, or crop losses arising from reliance on outdated or incorrect data.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInRight">
          <h2 className="font-semibold text-green2 mb-2">Compliance with Local Laws</h2>
          <p className="text-muted-foreground">
            All users must comply with Kenyan agricultural laws and international trade regulations where
            applicable. Kahawa Trace does not endorse or permit any illegal activities on the platform.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInLeft">
          <h2 className="font-semibold text-green2 mb-2">Intellectual Property</h2>
          <p className="text-muted-foreground">
            The Kahawa Trace platform, logo, and system features are protected by intellectual property
            laws. Unauthorized reproduction, distribution, or modification is strictly prohibited.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInRight">
          <h2 className="font-semibold text-green2 mb-2">Termination of Access</h2>
          <p className="text-muted-foreground">
            Kahawa Trace reserves the right to suspend or terminate accounts that violate these terms or
            misuse the platform in ways that could harm the community or coffee supply chain integrity.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInLeft">
          <h2 className="font-semibold text-green2 mb-2">Changes to Terms</h2>
          <p className="text-muted-foreground">
            These Terms and Conditions may be updated from time to time. Continued use of the platform
            after updates indicates acceptance of the revised terms.
          </p>
        </div>

        <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow animate-slideInRight">
          <h2 className="font-semibold text-green2 mb-2">Contact Us</h2>
          <p className="text-muted-foreground">
            For questions about these Terms, please contact our support team at{" "}
            <a href="mailto:legal@kahawatrace.co.ke" className="text-green2 hover:underline">
              legal@kahawatrace.co.ke
            </a>.
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground italic">
        Last updated: October 2025
      </p>
    </div>
  );
}
