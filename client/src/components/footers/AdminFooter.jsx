const AdminFooter = () => {
  return (
    <footer className="bg-white/70 backdrop-blur-md border-t border-green-200 shadow-inner">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
        
        {/* Left - Branding */}
        <p className="text-sm text-green-700 font-medium">
          © {new Date().getFullYear()} KahawaTrace · Empowering Farmers with Data
        </p>

        {/* Center - Quick Links */}
        <div className="flex space-x-4 text-sm">
          <a href="/admin/dashboard" className="text-green-600 hover:text-green-800">
            Dashboard
          </a>
          <a href="/admin/farmers" className="text-green-600 hover:text-green-800">
            Farmers
          </a>
          <a href="/admin/wetmills" className="text-green-600 hover:text-green-800">
            Wetmills
          </a>
          <a href="/admin/settings" className="text-green-600 hover:text-green-800">
            Settings
          </a>
        </div>

        {/* Right - Version */}
        <p className="text-xs text-gray-500">
          v1.0.0
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;
