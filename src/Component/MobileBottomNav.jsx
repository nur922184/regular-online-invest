import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { SiSlideshare } from "react-icons/si";
import { FaProductHunt, FaTelegram } from "react-icons/fa6";
import { GrProjects } from "react-icons/gr";

export default function MobileBottomNav() {
  // Telegram channel link - replace with your actual channel link
  const TELEGRAM_CHANNEL_URL = "https://t.me/your_channel_username";

  const navItems = [
    { id: "home", path: "/", icon: <FaHome />, label: "হোম" },
    { id: "portfolio", path: "/my_product", icon: <FaProductHunt />, label: "পণ্য" },
    { id: "telegram", path: TELEGRAM_CHANNEL_URL, icon: <FaTelegram size={35} color="blue" />, label: "টেলিগ্রাম", isExternal: true },
    { id: "refer", path: "/refer", icon: <SiSlideshare />, label: "আমন্ত্রণ" },
    { id: "profile", path: "/profile", icon: <GrProjects />, label: "আমার" },
  ];

  const handleTelegramClick = (e, url) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* 🔵 Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl md:hidden z-50">
        <div className="flex justify-around items-center py-2 px-1">
          {navItems.map((item) => (
            item.isExternal ? (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => handleTelegramClick(e, item.path)}
                className="flex flex-col items-center text-sm transition-all duration-300 group relative"
              >
                <div className="text-2xl text-gray-500 group-hover:text-blue-500 transition-all duration-300 group-hover:scale-110">
                  {item.icon}
                </div>
                <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 font-medium">
                  {item.label}
                </span>
                {/* Animated indicator */}
                <div className="absolute -top-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 group-hover:w-6"></div>
              </a>
            ) : (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center text-sm transition-all duration-300 group relative ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-blue-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`text-2xl transition-all duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}>
                      {item.icon}
                    </div>
                    <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                      isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                    }`}>
                      {item.label}
                    </span>
                    {/* Active indicator bar */}
                    <div className={`absolute -top-1 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ${
                      isActive ? "w-6" : "w-0 group-hover:w-4"
                    }`}></div>
                    
                    {/* Active background effect */}
                    {isActive && (
                      <div className="absolute inset-0 -z-10 bg-blue-50 rounded-full scale-75 opacity-0 animate-pulse"></div>
                    )}
                  </>
                )}
              </NavLink>
            )
          ))}
        </div>
      </div>

      {/* 🟢 Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl flex-col p-4 z-50">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Dashboard
          </h2>
        </div>
        
        <div className="flex-1 space-y-1">
          {navItems.map((item) => (
            item.isExternal ? (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => handleTelegramClick(e, item.path)}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent hover:text-blue-600 group"
              >
                <div className="text-xl transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </a>
            ) : (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-transparent text-blue-600 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-blue-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`text-xl transition-all duration-300 ${
                      isActive ? "scale-110" : ""
                    }`}>
                      {item.icon}
                    </div>
                    <span className={`font-medium ${
                      isActive ? "font-semibold" : ""
                    }`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1 h-6 bg-blue-600 rounded-full"></div>
                    )}
                  </>
                )}
              </NavLink>
            )
          ))}
        </div>
        
        {/* Optional: Add version or footer info */}
        <div className="mt-auto pt-4 text-center text-xs text-gray-400">
          v1.0.0
        </div>
      </div>
    </>
  );
}