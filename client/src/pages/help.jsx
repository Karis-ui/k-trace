// src/pages/common/Help.jsx
import React, { useState } from "react";
import {
  HelpCircle, MessageCircle, Mail, Phone,
  ChevronDown, ChevronUp, BookOpen, Video,
  Search, ExternalLink
} from "lucide-react";
import CommonPageLayout from "../layouts/commonLayout";

export default function Help() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I register as a farmer?",
      answer: "You can register through our USSD code *384# or via the mobile app. You'll need your ID number, phone number, and farming location."
    },
    {
      id: 2,
      question: "How is coffee graded?",
      answer: "Coffee is graded using SCAA standards. Factors include aroma, flavor, acidity, body, and overall quality score."
    },
    {
      id: 3,
      question: "When do I get paid?",
      answer: "Payouts are processed within 7-14 days after grading is completed. You'll receive an SMS notification when your payment is ready."
    },
    {
      id: 4,
      question: "How do I check my payout status?",
      answer: "You can check your payout status in your farmer dashboard under 'My Payouts' section, or via USSD."
    },
    {
      id: 5,
      question: "What happens if my coffee is rejected?",
      answer: "If your coffee doesn't meet quality standards, you'll receive feedback and guidance on improvement. You can also appeal the decision."
    },
    {
      id: 6,
      question: "How do I contact support?",
      answer: "You can reach our support team via email at support@k-trace.com, phone at +254 700 000 000, or use the live chat feature."
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <CommonPageLayout
      title="Help & Support"
      subtitle="Find answers to common questions and get assistance"
      breadcrumbs={[
        { label: "Home", url: "/" },
        { label: "Help" }
      ]}
    >
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for help topics..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:shadow-md transition">
          <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900 dark:text-white">Live Chat</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Chat with our support team</p>
          <button className="mt-2 text-sm text-green-600 dark:text-green-400 hover:underline">Start Chat</button>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:shadow-md transition">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900 dark:text-white">Email Us</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">support@k-trace.com</p>
          <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">Send Email</button>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:shadow-md transition">
          <Phone className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900 dark:text-white">Call Us</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">+254 700 000 000</p>
          <button className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline">Call Now</button>
        </div>
      </div>

      {/* FAQs */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
              {expandedFaq === faq.id ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedFaq === faq.id && (
              <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Helpful Links */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Helpful Resources</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
            <BookOpen className="h-4 w-4" /> User Guide
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
            <Video className="h-4 w-4" /> Video Tutorials
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
            <ExternalLink className="h-4 w-4" /> Community Forum
          </button>
        </div>
      </div>
    </CommonPageLayout>
  );
}