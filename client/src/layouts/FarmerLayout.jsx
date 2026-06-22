// src/layouts/FarmerLayout.jsx
import Header from "../components/headers/FarmerHeader";
import Footer from "../components/footers/FarmerFooter";

const FarmerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default FarmerLayout;
