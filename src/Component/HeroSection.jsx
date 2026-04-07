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
import { HiCloudArrowDown } from "react-icons/hi2";
import { FcAbout } from "react-icons/fc";

const HeroSection = () => {
  const [user, setUser] = useState(null);

  const images = [
    "https://i.ibb.co.com/672R4zLk/121.jpg",
    "https://i.ibb.co.com/twQkhPMr/1a53f950c0c24024bb395bdfd678523b.jpg",
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
            className={`absolute w-full h-52 object-cover transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
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
              <p className="text-xs opacity-80">নাম</p>
              <h2 className="flex items-center gap-1 text-lg font-bold">
                <FaUser /> {user?.name || 1500}
              </h2>
            </div>

            <div>
              <p className="text-xs opacity-80">মোট আয়</p>
              <h2 className="flex items-center gap-1 text-lg font-bold text-green-300">
                <FaBangladeshiTakaSign /> {user?.balance || 5400}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Bottom Menu */}
      <div className="grid grid-cols-5 gap-3 mt-8 px-2">

        {/* Recharge */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-2xl text-white flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl cursor-pointer">
            <FaNewspaper className="text-2xl" />
          </div>
          <p className="mt-2 text-center text-gray-700 font-medium text-xs group-hover:text-yellow-600 transition-colors duration-200">রিচার্জ</p>
        </div>

        {/* Withdraw */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-2xl text-white flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl cursor-pointer">
            <FaBolt className="text-2xl" />
          </div>
          <p className="mt-2 text-center text-gray-700 font-medium text-xs group-hover:text-green-600 transition-colors duration-200">উত্তোলন</p>
        </div>

        {/* Bonus */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-green-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-lime-400 to-green-500 p-3 rounded-2xl text-white flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl cursor-pointer">
            <FaChartLine className="text-2xl" />
          </div>
          <p className="mt-2 text-center text-gray-700 font-medium text-xs group-hover:text-lime-600 transition-colors duration-200">বোনাস</p>
        </div>

        {/* About Us */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-red-400 to-pink-500 p-3 rounded-2xl text-white flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl cursor-pointer">
            <FcAbout className="text-2xl" />
          </div>
          <p className="mt-2 text-center text-gray-700 font-medium text-xs group-hover:text-red-500 transition-colors duration-200">আমাদের সম্পর্কে</p>
        </div>

        {/* App */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-2xl text-white flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl cursor-pointer">
            <HiCloudArrowDown className="text-2xl" />
          </div>
          <p className="mt-2 text-center text-gray-700 font-medium text-xs group-hover:text-blue-600 transition-colors duration-200">অ্যাপ</p>
        </div>

      </div>
     
    </section>
  );
};

export default HeroSection;