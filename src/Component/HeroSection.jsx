import { useState, useEffect } from "react";
import {
  FaUser,
  FaLeaf,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useUser from "../hooks/useUsers";

const HeroSection = () => {
  const { user } = useUser();

  const images = [
    "https://i.ibb.co.com/672R4zLk/121.jpg",
    "https://i.ibb.co.com/twQkhPMr/1a53f950c0c24024bb395bdfd678523b.jpg",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format",
  ];

  const [current, setCurrent] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    {
      id: 1,
      name: "রিচার্জ",
      link: "/topup",
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135706.png",
      bgGradient: "from-emerald-400 to-green-500",
    },
    {
      id: 2,
      name: "উত্তোলন",
      link: "/withdraw",
      icon: "https://cdn-icons-png.flaticon.com/512/5024/5024665.png",
      bgGradient: "from-green-400 to-emerald-500",
    },
    {
      id: 3,
      name: "দল",
      link: "/refer",
      icon: "https://static.vecteezy.com/system/resources/previews/028/263/400/non_2x/color-icon-for-cultural-vector.jpg",
      bgGradient: "from-teal-400 to-green-500",
    },
    {
      id: 4,
      name: "ইতিহাস",
      link: "/transition_history",
      icon: "https://cdn-icons-png.flaticon.com/512/3209/3209265.png",
      bgGradient: "from-cyan-400 to-teal-500",
    },
    {
      id: 5,
      name: "সাপোর্ট",
      link: "/support",
      icon: "https://cdn-icons-png.flaticon.com/512/1077/1077063.png",
      bgGradient: "from-sky-400 to-cyan-500",
    },
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
        : "bg-transparent py-4"
        }`}>
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow">
              <FaLeaf className="text-white text-sm" />
            </div>
            <span className={`font-semibold text-base ${scrolled ? "text-green-800" : "text-white"
              }`}>
              AgroFund
            </span>
          </div>

          {/* User/Login */}
          {user ? (
            <div className={`flex items-center gap-2 text-sm ${scrolled ? "text-gray-700" : "text-white"
              }`}>
              <FaUser size={14} />
              <span>{user?.name?.split(" ")[0] || "User"}</span>
            </div>
          ) : (
            <Link to="/login">
              <button className={`text-sm font-medium px-4 py-1.5 rounded-full border transition ${scrolled
                ? "text-green-600 border-green-600 hover:bg-green-50"
                : "text-white border-white hover:bg-white/20"
                }`}>
                লগইন
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 via-white to-green-50">
        <div className="max-w-full mx-auto">

          <div className="relative rounded-b-[30px] overflow-hidden shadow-lg h-[50vh] min-h-[220px] max-h-[300px]">

            {/* Images */}
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Banner"
                className={`absolute w-full h-full object-cover transition-all duration-1000 ease-in-out ${index === current
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-110"
                  }`}
              />
            ))}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full p-5">

              {/* Balance Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-5 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xs">আপনার ব্যালেন্স</p>
                    <p className="text-white font-semibold text-2xl mt-1">
                      ৳ {user?.balance?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs">
                    Active
                  </div>
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 pb-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === current
                      ? "w-6 bg-white"
                      : "w-2 bg-white/40"
                      }`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>
      {/* বটম মেনু - PNG আইকন সহ */}
      <div className="max-w-md mx-auto px-2 py-4">

        <div className="grid grid-cols-5 gap-2">

          {menuItems.map((item) => (
            <Link to={item.link} key={item.id}>
              <div className="flex flex-col items-center justify-center p-2 bg-green-50 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">

                {/* Icon */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.bgGradient} flex items-center justify-center`}>
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-8 h-8 rounded-full object-contain"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/6466/6466947.png";
                    }}
                  />
                </div>

                {/* Text */}
                <p className="text-[10px] mt-1 text-gray-700 font-medium text-center">
                  {item.name}
                </p>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </>
  );
};

export default HeroSection;