// src/layouts/WetmillLayout.jsx
import WetmillHeader from "../components/headers/WetmillHeader";
import WetmillFooter from "../components/footers/WetmillFooter";

const WetmillLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <WetmillHeader />
      <main className="flex-1">{children}</main>
      <WetmillFooter />
    </div>
  );
};

export default WetmillLayout;
