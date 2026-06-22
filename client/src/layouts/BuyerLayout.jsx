// src/layouts/BuyerLayout.jsx
import BuyerHeader from "../components/headers/BuyerHeader";
import BuyerFooter from "../components/footers/BuyerFooter";

const BuyerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <BuyerHeader />
      <main className="flex-1">{children}</main>
      <BuyerFooter />
    </div>
  );
};

export default BuyerLayout;
