export default function Help() {
  const faqs = [
    { q: "How do I update my farm profile?", a: "Go to the Farmers section, open your profile, and click 'Edit Details' to update your information." },
    { q: "How can I track coffee deliveries?", a: "Visit the Deliveries page to see records of your coffee harvests and transport history." },
    { q: "Where can I view market prices for coffee?", a: "Check the Market Dashboard for real-time coffee prices and trends." },
    { q: "Can I register new farmers?", a: "Yes, use the 'Add Farmer' option in the sidebar to onboard new members." },
    { q: "Who do I contact for support?", a: "Go to the Help page and use the 'Contact Support' button to reach the Kahawa Trace team." },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green1 mb-4">Help & FAQs</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="p-4 border border-border rounded-xl shadow-md bg-card animate-fadeIn"
          >
            <h2 className="font-semibold text-green2">{faq.q}</h2>
            <p className="text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
