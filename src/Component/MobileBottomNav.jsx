import { NavLink } from "react-router-dom";
import { FaHome, FaChartLine, FaWallet, FaUser, FaAddressBook } from "react-icons/fa";

export default function MobileBottomNav() {
  // const [active, setActive] = useState("home");

 const navItems = [
    { id: "home", path: "/", icon: <FaHome />, label: "হোম" },
    { id: "refer", path: "/refer", icon: <FaChartLine />, label: "আমন্ত্রণ" },
    { id: "portfolio", path: "/about", icon: <FaAddressBook />, label: "সম্পর্কে" },
    { id: "profile", path: "/profile", icon: <FaUser />, label: "Profile" },
  ];


 return (
    <>
      {/* 🔵 Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md md:hidden">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-sm transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 scale-110"
                    : "text-gray-400 hover:text-blue-500"
                }`
              }
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-xs">{item.label}</span>
              {/** Active indicator */}
              <div
                className={`w-6 h-1 rounded-full mt-1 transition-all duration-300 ${
                  window.location.pathname === item.path
                    ? "bg-blue-600"
                    : "bg-transparent"
                }`}
              ></div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* 🟢 Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-lg flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`
            }
          >
            <div className="text-lg">{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
}