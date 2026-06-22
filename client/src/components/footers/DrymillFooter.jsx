const DrymillFooter = () => (
  <footer className="bg-green-100 text-center py-5 border-t border-green-200">
    <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-green-700 text-sm">
      <p>© {new Date().getFullYear()} KahawaTrace Drymill. All rights reserved.</p>
      <a href="/drymill/help" className="hover:text-green-800 transition-colors duration-200">Help Center</a>
      <a href="/drymill/privacy" className="hover:text-green-800 transition-colors duration-200">Privacy Policy</a>
      <a href="/drymill/contact" className="hover:text-green-800 transition-colors duration-200">Contact Support</a>
    </div>
  </footer>
);

export default DrymillFooter;
