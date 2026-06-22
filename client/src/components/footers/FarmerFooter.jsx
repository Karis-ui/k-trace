// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  Sprout, Facebook, Twitter, Instagram, Mail, Phone, MapPin 
} from "lucide-react";
import AgriSmartLogo from "../../assets/1.jpg"; 

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-100 via-green-200 to-green-300 text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              
              <img
                  src={AgriSmartLogo}
                    alt="AgriSmart Logo"
                       className="h-16 w-17 object-cover rounded-full border border-green-200 object-cover hidden md:block"
                          />
              <span className="text-xl font-roboto-slab font-bold text-green-900">KahawaTrace</span>
            </div>
            <p className="text-gray-700 font-roboto">
              Empowering Kenyan coffee farmers with smart technology for better tracking of their produce and payment processing.
            </p>
            <div className="flex space-x-4">
              <Link to="/facebook" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="/twitter" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="/instagram" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-roboto-slab font-semibold text-lg text-green-900">Quick Links</h3>
            <ul className="space-y-2 font-roboto">
              <li><Link to="/crop-advice" className="text-gray-700 hover:text-blue-600 transition-colors">Crop Advice</Link></li>
              <li><Link to="/marketplace" className="text-gray-700 hover:text-blue-600 transition-colors">Market Access</Link></li>
              <li><Link to="/weather" className="text-gray-700 hover:text-blue-600 transition-colors">Weather Alerts</Link></li>
              <li><Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-roboto-slab font-semibold text-lg text-green-900">Support</h3>
            <ul className="space-y-2 font-roboto">
              <li><Link to="/help" className="text-gray-700 hover:text-blue-600 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-gray-700 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-700 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-roboto-slab font-semibold text-lg text-green-900">Contact Info</h3>
            <div className="space-y-3 font-roboto">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-700" />
                <span className="text-gray-700">+254 742 195 920</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-700" />
                <span className="text-gray-700">support@Kahawatrace.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-green-700" />
                <span className="text-gray-700">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-400 mt-8 pt-8 text-center">
          <p className="text-gray-600 font-roboto">
            © 2025 KahawaTrace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
