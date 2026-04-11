import { useState, useEffect } from "react";
import {
  FaBangladeshiTakaSign,
  FaChartLine,
  FaUser,
} from "react-icons/fa6";
import { HiCloudArrowDown } from "react-icons/hi2";
import { FcAbout } from "react-icons/fc";
import { Link } from "react-router-dom";
import useUser from "../hooks/useUsers";
import { PiHandDepositDuotone, PiHandWithdrawDuotone } from "react-icons/pi";
import { FaComments } from "react-icons/fa";

const HeroSection = () => {
  const { user } = useUser();

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
                <FaBangladeshiTakaSign /> {user?.balance || 0}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Bottom Menu - Glassmorphism Style */}
      <div className="grid grid-cols-5 gap-4 mt-8 px-3">
        {/* Recharge */}
        <Link to={"/topup"}>
          <div className="group relative cursor-pointer">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"></div>

            {/* Icon Container */}
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-lg group-hover:shadow-2xl">
              <PiHandDepositDuotone className="text-3xl text-amber-400 drop-shadow-md group-hover:text-amber-300 transition-colors" />
            </div>

            {/* Label */}
            <p className="mt-2 text-center text-slate-600 font-semibold text-xs tracking-wide group-hover:text-amber-500 transition-all duration-200">
              রিচার্জ
            </p>
          </div>
        </Link>

        {/* Withdraw */}
        <Link to={"/withdraw"}>
          <div className="group relative cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-lg group-hover:shadow-2xl">
              <PiHandWithdrawDuotone className="text-3xl text-emerald-400 drop-shadow-md group-hover:text-emerald-300 transition-colors" />
            </div>
            <p className="mt-2 text-center text-slate-600 font-semibold text-xs tracking-wide group-hover:text-emerald-500 transition-all duration-200">
              উত্তোলন
            </p>
          </div>
        </Link>

        {/* Bonus */}
        <div className="group relative cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-green-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-lg group-hover:shadow-2xl">
            <FaChartLine className="text-3xl text-lime-400 drop-shadow-md group-hover:text-lime-300 transition-colors" />
          </div>
          <p className="mt-2 text-center text-slate-600 font-semibold text-xs tracking-wide group-hover:text-lime-500 transition-all duration-200">
            বোনাস
          </p>
        </div>

        {/* About Us */}
        <div className="group relative cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-lg group-hover:shadow-2xl">
            <FcAbout className="text-3xl text-rose-400 drop-shadow-md group-hover:text-rose-300 transition-colors" />
          </div>
          <p className="mt-2 text-center text-slate-600 font-semibold text-xs tracking-wide group-hover:text-rose-500 transition-all duration-200">
            সম্পর্কে
          </p>
        </div>

        {/* Support */}
        <div className="group relative cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-lg group-hover:shadow-2xl">
            <FaComments className="text-3xl text-sky-400 drop-shadow-md group-hover:text-sky-300 transition-colors" />
          </div>
          <p className="mt-2 text-center text-slate-600 font-semibold text-xs tracking-wide group-hover:text-sky-500 transition-all duration-200">
            সাপোর্ট
          </p>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;