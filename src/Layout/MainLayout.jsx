import { Outlet } from "react-router-dom";
import Footer from "../Component/Footer";
import MobileBottomNav from "../Component/MobileBottomNav";



const MainLayout = () => {
  return (
    <div className="flex bg-white">

      {/* 🔹 Desktop Sidebar */}
      <div className="hidden md:block w-64">
       <MobileBottomNav></MobileBottomNav>
      </div>

      {/* 🔹 Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col">

        {/* Content */}
        <main className="flex-1 p-4 pb-20 md:pb-4 md:ml-0">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* 🔹 Mobile Bottom Nav */}
      <div className="md:hidden">
      <MobileBottomNav></MobileBottomNav>
      </div>

    </div>
  );
};

export default MainLayout;