// src/pages/home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Coffee, Truck, Box, MapPin, ShoppingCart,
  CheckCircle, Star, BarChart3, Users
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import heroImage from "../../assets/hero-farmers.jpg";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

import farmerLogo from "../../assets/partners/farmer.jpg";
import nceLogo from "../../assets/partners/nairobi.jpg";
import fairtradeLogo from "../../assets/partners/fair.jpg";
import dormansLogo from "../../assets/partners/dormans.jpg";
import javaLogo from "../../assets/partners/java.jpg";
import kahawa1893Logo from "../../assets/partners/kahawa.jpg";
import icoLogo from "../../assets/partners/ico.jpg";

// ---- reusable scroll animation wrapper ----
const ScrollFadeIn = ({ children, variants }) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={controls}>
      {children}
    </motion.div>
  );
};

export default function Home() {
  // --- content data (coffee-first) ---
  const features = [
    { icon: Coffee, title: "Origin Verification", description: "Batch pages link to farms, cooperatives and producer notes." },
    { icon: BarChart3, title: "Fair Price Insights", description: "Transparent price breakdowns so producers get rewarded fairly." },
    { icon: Truck, title: "Shipment Tracking", description: "Track lots from farm gate to mill, roastery and port." },
    { icon: Users, title: "Cooperative Tools", description: "Member management, deliveries and payout records for co-ops." },
    { icon: Box, title: "Quality Records", description: "Attach lab reports, drying curves and cupping notes to each lot." },
    { icon: MapPin, title: "GPS Provenance", description: "Geotagged farms ensure accurate origin and certification support." }
  ];

  const benefits = [
    "Know the farmer behind every bag",
    "Get premiums for traceable lots",
    "Resolve disputes with clear provenance",
    "Speed procurement with buyer-ready lot pages",
    "Strengthen cooperative records",
    "Show quality data, not just claims"
  ];

  const testimonials = [
    { name: "Mwangi Kimani", location: "Nyeri County", text: "Verified Lot KAH-2025-089 attracted a buyer who paid 25% more after seeing our cupping notes.", rating: 5 },
    { name: "Amina Hassan", location: "Marsabit County", text: "Our cooperative won a roastery contract thanks to clear batch provenance and photos.", rating: 5 },
    { name: "Luis Fernandez", location: "Nairobi, Buyer", text: "I review origin maps and lab notes before bidding — KahawaTrace saves time and risk.", rating: 5 }
  ];

  const partners = [
    { name: "Kenya Coffee Farmers Cooperative Union", logo: farmerLogo },
    { name: "Nairobi Coffee Exchange", logo: nceLogo },
    { name: "Fairtrade International", logo: fairtradeLogo },
    { name: "Dormans Coffee Ltd", logo: dormansLogo },
    { name: "Java House Roasters", logo: javaLogo },
    { name: "Kahawa 1893 Exporters", logo: kahawa1893Logo },
    { name: "International Coffee Organization", logo: icoLogo },
  ];

  const journey = [
    { key: 'farm', title: 'Farm', desc: 'Harvest and initial sorting by the farmer', icon: Coffee, colorFrom: '#14532d', colorTo: '#22c55e' },
    { key: 'coop', title: 'Cooperative', desc: 'Deliveries, member records and aggregated lots', icon: Users, colorFrom: '#22c55e', colorTo: '#bbf7d0' },
    { key: 'mill', title: 'Mill & Processing', desc: 'Processing method, drying profile and lab checks', icon: Box, colorFrom: '#14532d', colorTo: '#22c55e' },
    { key: 'transport', title: 'Transport', desc: 'Track shipments from origin to buyer or port', icon: Truck, colorFrom: '#22c55e', colorTo: '#14532d' },
    { key: 'roast', title: 'Roastery', desc: 'Roast profiles and cupping notes attached to the lot', icon: BarChart3, colorFrom: '#14532d', colorTo: '#22c55e' },
    { key: 'shop', title: 'Shop & Cup', desc: 'Final sale, QR code scans show full provenance', icon: ShoppingCart, colorFrom: '#22c55e', colorTo: '#bbf7d0' }
  ];

  const stats = [
    { id: 'farmers', label: 'Farmers Traced', value: 10000 },
    { id: 'coops', label: 'Cooperatives', value: 250 },
    { id: 'batches', label: 'Batches Traced', value: 4200 }
  ];

  const faq = [
    { q: 'How do I trace a batch?', a: 'Enter the batch ID on the quick trace box to view origin, lab tests and producer notes.' },
    { q: 'Who can use KahawaTrace?', a: 'Farmers, cooperatives, exporters, roasters and buyers — anyone who needs reliable provenance.' },
    { q: 'Is certification supported?', a: 'Yes. Geotagged farms and lab records help streamline certification and audits.' }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((s) => (s + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);

  const [openFaq, setOpenFaq] = useState(null);

  // --- animation variants ---
  const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const fadeLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };
  const fadeRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };
  const zoomIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green3 to-white">
      <style>{`
        .btn-kt { background: linear-gradient(90deg,#14532d,#22c55e); }
        .btn-kt:hover { filter: brightness(1.05); }
        .stat-pill { background: rgba(34,197,94,0.08); }
      `}</style>

      {/* HERO */}
      <ScrollFadeIn variants={zoomIn}>
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-green1">
                KahawaTrace, Traceable Coffee from Farm to Cup
              </h1>
              <p className="text-lg text-gray-700">
                Attach GPS, lab reports, cupping notes and photos to every lot. Buyers see provenance, farmers capture value.
              </p>

              <div className="flex gap-4 mt-4">
                <Link to="/signup"><Button className="btn-kt text-white px-6 py-3 rounded-lg">Get Started</Button></Link>
                <Link to="/analytics"><Button className="bg-white border px-6 py-3 rounded-lg">View stats</Button></Link>
              </div>
            </div>
            <div className="relative">
              <object
                type="image/svg+xml"
                data="/KahawaTrace.svg"
                className="rounded-3xl shadow-2xl h-[420px] lg:h-[520px] w-full"
              >
                Your browser does not support SVG
              </object>
            </div>



          </div>
        </section>
      </ScrollFadeIn>

      {/* FEATURES */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10 text-green1">Coffee-Centric Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <ScrollFadeIn key={i} variants={fadeUp}>
                  <Card className="hover:shadow-xl transition-transform">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#14532d,#22c55e)' }}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green1">{f.title}</h3>
                          <p className="text-sm text-gray-600">{f.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollFadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <ScrollFadeIn variants={fadeLeft}>
        <section className="py-20 bg-green3/20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4 text-green1">Why KahawaTrace?</h2>
            <p className="text-gray-700 mb-6">We make provenance simple for farmers and visible for buyers — so quality and trust get rewarded.</p>
            <ul className="space-y-3">
              {benefits.map((b, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green1" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollFadeIn>

      {/* JOURNEY */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6 text-green1">Trace the Coffee Journey</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {journey.map((step) => {
              const Icon = step.icon;
              return (
                <ScrollFadeIn key={step.key} variants={fadeUp}>
                  <div className="p-6 rounded-2xl text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${step.colorFrom}, ${step.colorTo})` }}>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-white/12"><Icon className="h-6 w-6 text-white" /></div>
                      <div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-sm mt-2">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                </ScrollFadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <ScrollFadeIn variants={fadeRight}>
        <section className="py-12 bg-green3/20">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold mb-6 text-green1">
              Partners & Certifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-center">
              {partners.map((p, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex flex-col items-center space-y-2 bg-white rounded-lg p-4 shadow-md hover:shadow-lg"
                >
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-green1">
                      {p.name}
                    </div>
                  )}
                  <p className="text-sm text-gray-600">{p.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      {/* TESTIMONIALS */}
      <ScrollFadeIn variants={fadeUp}>
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8 text-green1">Coffee Community Voices</h2>
            {testimonials.map((t, i) => (
              <div key={i} className={`${i === activeTestimonial ? 'block' : 'hidden'}`}>
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">{[...Array(t.rating)].map((_, j) => <Star key={j} className="h-5 w-5 text-yellow-400" />)}</div>
                    <p className="italic text-gray-700">"{t.text}"</p>
                    <h3 className="mt-4 font-bold text-green1">{t.name}</h3>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </ScrollFadeIn>

      {/* FAQ */}
      <ScrollFadeIn variants={fadeLeft}>
        <section className="py-16 bg-green3/10">
          <div className="container mx-auto px-6 max-w-3xl">
            <h3 className="text-2xl font-bold mb-6 text-green1">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <div key={i} className="p-4 rounded-lg bg-white shadow-sm">
                  <button className="w-full text-left flex justify-between items-center" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-semibold">{f.q}</span>
                    <span className="text-gray-500">{openFaq === i ? '-' : '+'}</span>
                  </button>
                  {openFaq === i && <p className="mt-3 text-gray-600">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      {/* FINAL CTA */}
      <ScrollFadeIn variants={zoomIn}>
        <section className="py-20 text-white text-center" style={{ background: 'linear-gradient(90deg,#14532d,#22c55e)' }}>
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">Ready to Trace Your Coffee?</h2>
            <p className="mb-6 text-lg max-w-2xl mx-auto">Create lot pages with GPS, lab, and cupping notes — build trust with buyers who pay for provenance.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/signup"><Button className="bg-white text-green1 px-6 py-3 rounded-lg">Start Tracing</Button></Link>
              <Link to="/contact"><Button className="bg-transparent border border-white px-6 py-3 rounded-lg">Contact Sales</Button></Link>
            </div>
          </div>
        </section>
      </ScrollFadeIn>
    </div>
  );
}
