export default function Contact() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green1 mb-4">Contact Kahawa Trace</h1>
      <p className="mb-4 text-muted-foreground">
        We're here to support farmers and partners. Reach us through the details below or stop by our offices.
      </p>
      <div className="mb-6 space-y-2">
        <p className="text-card-foreground">
          <strong>Address:</strong> Kahawa Trace HQ, Nairobi, Kenya
        </p>
        <p className="text-card-foreground">
          <strong>Email:</strong>{" "}
          <a href="mailto:support@kahawatrace.co.ke" className="text-green2 hover:underline">
            support@kahawatrace.co.ke
          </a>
        </p>
        <p className="text-card-foreground">
          <strong>Phone:</strong>{" "}
          <a href="tel:+254742195920" className="text-green2 hover:underline">
            +254 742 195 920
          </a>
        </p>
      </div>
      <div className="w-full h-96 border border-border rounded-xl shadow-md overflow-hidden animate-fadeIn">
        <iframe
          title="Kahawa Trace HQ"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.19725242321!2d36.8219!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10fc8a5ddbb1%3A0x63c6c6b403a9a0f!2sNairobi%20CBD!5e0!3m2!1sen!2ske!4v1696600000000"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
