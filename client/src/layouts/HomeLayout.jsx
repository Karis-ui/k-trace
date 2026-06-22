// src/layouts/HomeLayout.jsx
import HomeHeader from "../components/headers/HomeHeader";
import HomeFooter from "../components/footers/HomeFooter";

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <main className="flex-1">{children}</main>
      <HomeFooter />
    </div>
  );
};

export default HomeLayout;
