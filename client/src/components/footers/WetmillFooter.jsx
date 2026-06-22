import React from "react";

const WetmillFooter = () => (
  <footer className="bg-green-100 text-center py-4 border-t border-green-200">
    <p className="text-sm text-green-700">
      © {new Date().getFullYear()} KahawaTrace Wetmill. All rights reserved.
    </p>
  </footer>
);

export default WetmillFooter;
