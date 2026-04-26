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
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      }`}>
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow">
              <FaLeaf className="text-white text-sm" />
            </div>
            <span className={`font-semibold text-base ${
              scrolled ? "text-green-800" : "text-white"
            }`}>
              AgroFund
            </span>
          </div>

          {/* User/Login */}
          {user ? (
            <div className={`flex items-center gap-2 text-sm ${
              scrolled ? "text-gray-700" : "text-white"
            }`}>
              <FaUser size={14} />
              <span>{user?.name?.split(" ")[0] || "User"}</span>
            </div>
          ) : (
            <Link to="/login">
              <button className={`text-sm font-medium px-4 py-1.5 rounded-full border transition ${
                scrolled
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

         <div className="relative rounded-b-[30px] overflow-hidden shadow-lg h-[50vh] min-h-[320px] max-h-[500px]">
            
            {/* Images */}
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Banner"
                className={`absolute w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                  index === current
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
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === current
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
    </>
  );
};

export default HeroSection;