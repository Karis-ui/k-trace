// src/components/footers/HomeFooter.jsx
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, MapPin } from "lucide-react";
import AgriSmartLogo from "../../assets/1.jpg";

const HomeFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-green-100 via-green-200 to-green-300 text-gray-800">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <img src={AgriSmartLogo} alt="Logo" className="h-16 w-16 object-cover rounded-full border border-green-200" />
            <span className="text-xl font-bold text-green-900">KahawaTrace</span>
          </div>
          <p className="text-gray-700">Connecting coffee farmers, mills, buyers, and admins for a transparent coffee chain.</p>
          <div className="flex space-x-4">
            <Link to="/facebook"><Facebook className="h-5 w-5 text-gray-600 hover:text-blue-600" /></Link>
            <Link to="/twitter"><Twitter className="h-5 w-5 text-gray-600 hover:text-blue-600" /></Link>
            <Link to="/instagram"><Instagram className="h-5 w-5 text-gray-600 hover:text-pink-500" /></Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg text-green-900">Quick Links</h3>
          <ul className="space-y-2 mt-4">
            <li><Link to="/about" className="hover:text-green-800">About</Link></li>
            <li><Link to="/features" className="hover:text-green-800">Features</Link></li>
            <li><Link to="/contact" className="hover:text-green-800">Contact</Link></li>
            <li><Link to="/login" className="hover:text-green-800">Login</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-lg text-green-900">Support</h3>
          <ul className="space-y-2 mt-4">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg text-green-900">Contact</h3>
          <ul className="space-y-2 mt-4">
            <li><Mail className="inline h-4 w-4 mr-2 text-green-700" /> info@kahawatrace.co.ke</li>
            <li><MapPin className="inline h-4 w-4 mr-2 text-green-700" /> Nairobi, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-400 mt-8 pt-6 text-center text-gray-600">
        © {new Date().getFullYear()} KahawaTrace. All rights reserved.
      </div>
    </footer>
  );
};

export default HomeFooter;
