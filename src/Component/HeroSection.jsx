import { useState, useEffect } from "react";
import {
  FaBangladeshiTakaSign,
  FaChartLine,
  FaNewspaper,
  FaBolt,
  FaUser,
} from "react-icons/fa6";
import { MdOutlineAppRegistration } from "react-icons/md";
import { AiFillGift } from "react-icons/ai";

const HeroSection = () => {
  const [user, setUser] = useState(null);

  const images = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&auto=format",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format",
  ];

  const [current, setCurrent] = useState(0);

  // slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  return (
    <section className="p-4 bg-gray-100">

      {/* App Name */}
      <h2 className="text-xl font-bold text-green-700 mb-3">
        AgroFund
      </h2>

      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">

        {/* Image Slider */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={`absolute w-full h-52 object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-4 h-52 flex flex-col justify-between text-white">

          {/* Top Title */}
          <div>
            <h3 className="text-lg font-bold">AgroFund</h3>
            <p className="text-xs opacity-80">সবজি প্রকল্প</p>
          </div>

          {/* User Data */}
          <div className="space-y-2">
            <div>
              <p className="text-xs opacity-80">Name</p>
              <h2 className="flex items-center gap-1 text-lg font-bold">
                <FaUser /> {user?.name || 1500}
              </h2>
            </div>

            <div>
              <p className="text-xs opacity-80">TOTAL INCOME</p>
              <h2 className="flex items-center gap-1 text-lg font-bold text-green-300">
                <FaBangladeshiTakaSign /> {user?.balance|| 5400}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="grid grid-cols-5 gap-4 mt-6 text-center text-xs">

        <div>
          <div className="bg-yellow-400 p-3 rounded-xl text-white flex justify-center">
            <FaNewspaper />
          </div>
          <p className="mt-1">নিউজ</p>
        </div>

        <div>
          <div className="bg-green-500 p-3 rounded-xl text-white flex justify-center">
            <FaBolt />
          </div>
          <p className="mt-1">জমা</p>
        </div>

        <div>
          <div className="bg-lime-500 p-3 rounded-xl text-white flex justify-center">
            <FaChartLine />
          </div>
          <p className="mt-1">বোনাস</p>
        </div>

        <div>
          <div className="bg-red-400 p-3 rounded-xl text-white flex justify-center">
            <AiFillGift />
          </div>
          <p className="mt-1">অটচার</p>
        </div>

        <div>
          <div className="bg-blue-500 p-3 rounded-xl text-white flex justify-center">
            <MdOutlineAppRegistration />
          </div>
          <p className="mt-1">অ্যাপ</p>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;