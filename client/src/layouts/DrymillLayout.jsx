import { Outlet } from "react-router-dom";
import DrymillHeader from "../components/headers/DrymillHeader";
import DrymillFooter from "../components/footers/DrymillFooter";
import DrymillSidebar from "../components/sidebars/DrymillSidebar";

const DrymillLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <DrymillHeader />
      <div className="flex flex-1">
        <DrymillSidebar />
        <main className="flex-1 ml-0 md:ml-64 p-6 transition-all duration-200">
          <Outlet />
        </main>
      </div>
      <DrymillFooter />
    </div>
  );
};

export default DrymillLayout;
