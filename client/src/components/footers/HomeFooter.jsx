// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Coffee, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-6 w-6 text-green-600" />
              <span className="font-bold text-gray-800 dark:text-white">K-Trace</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Empowering the coffee value chain through traceability.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-green-600">About Us</Link></li>
              <li><Link to="/help" className="text-gray-500 dark:text-gray-400 hover:text-green-600">Help Center</Link></li>
              <li><Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-green-600">Terms</Link></li>
              <li><Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-green-600">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@k-trace.com" className="text-gray-500 dark:text-gray-400 hover:text-green-600">support@k-trace.com</a></li>
              <li className="text-gray-500 dark:text-gray-400">+254 700 000 000</li>
              <li className="text-gray-500 dark:text-gray-400">Mon-Fri: 8AM - 5PM</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                <Twitter className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </a>
              <a href="#" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                <Linkedin className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </a>
              <a href="#" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                <Mail className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </a>
              <a href="#" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                <Github className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} K-Trace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}