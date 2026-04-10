// components/TelegramSupport.jsx
import React from "react";
import {
  FaTelegramPlane,
  FaHeadset,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaRegSmile
} from "react-icons/fa";
import { SiTelegram } from "react-icons/si";

const TelegramSupport = () => {
  const supportLinks = [
    {
      id: 1,
      title: "ব্যক্তিগত সহায়তা",
      description: "সরাসরি মেসেজ করুন",
      icon: FaHeadset,
      link: "https://t.me/your_customer_service_bot",
      color: "#0088cc",
    },
    {
      id: 2,
      title: "আপডেট চ্যানেল",
      description: "নতুন তথ্য ও নোটিফিকেশন",
      icon: FaTelegramPlane,
      link: "https://t.me/your_official_channel",
      color: "#26A5E4",
    },
    {
      id: 3,
      title: "কমিউনিটি গ্রুপ",
      description: "সবার সাথে সংযোগ স্থাপন",
      icon: FaUsers,
      link: "https://t.me/your_official_group",
      color: "#20B2AA",
    }
  ];

  const handleTelegramClick = (link) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4 flex items-center justify-center">
      {/* Unique Background Pattern & Image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co.com/XkYrj2g0/image.png')] bg-cover bg-center opacity-20"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto w-full">
        {/* Modern Glassmorphism Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-2xl mb-5 transform hover:scale-105 transition-all duration-300">
            <SiTelegram className="text-white text-5xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            গ্রাহক সেবা
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-sm text-slate-300 font-medium">২৪/৭ অনলাইন সহায়তা</p>
          </div>
        </div>

        {/* Unique Holographic Cards */}
        <div className="space-y-5 mb-8">
          {supportLinks.map((item) => (
            <div
              key={item.id}
              onClick={() => handleTelegramClick(item.link)}
              className="group relative backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl cursor-pointer overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Animated gradient border on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                  <item.icon style={{ color: item.color }} className="text-3xl drop-shadow-md" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-0.5 tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm font-light">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-all">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                    <FaArrowRight className="text-white text-base" />
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-2.5 bg-black/20 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaTelegramPlane className="text-cyan-300 text-xs" />
                  <span className="text-xs text-slate-300 font-medium">টেলিগ্রাম</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-xs text-slate-400" />
                  <span className="text-xs text-slate-400 font-mono">১০:০০ - ২১:৩০</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Info Bar */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4 shadow-2xl mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <FaClock className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold tracking-wide">সাপোর্ট টাইমিং</p>
              <p className="text-white/80 text-xs">সোম-শনি: ১০:০০ - ২১:৩০</p>
            </div>
            <div className="bg-green-400/90 px-3 py-1.5 rounded-full shadow-sm">
              <p className="text-white text-xs font-bold">অনলাইন</p>
            </div>
          </div>
        </div>

        {/* Minimalist Quick Tips */}
        <div className="backdrop-blur-md bg-black/30 rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <FaRegSmile className="text-cyan-300 text-xl" />
            <h3 className="font-bold text-white text-base tracking-wide">দ্রুত সেবা পেতে</h3>
          </div>
          
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="text-cyan-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-slate-200 text-xs font-light">সঠিক তথ্য দিন, দ্রুত সমাধান পাবেন</p>
            </div>
            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="text-cyan-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-slate-200 text-xs font-light">সাপোর্ট সময়ের মধ্যে যোগাযোগ করুন</p>
            </div>
            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="text-cyan-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-slate-200 text-xs font-light">ধৈর্য সহকারে অপেক্ষা করুন, আমরা আছি আপনার পাশে</p>
            </div>
          </div>
        </div>

        {/* Elegant Footer */}
        <div className="mt-8 pt-4 text-center">
          <p className="text-slate-400 text-xs font-light tracking-wide">
            ইন্ট্রেক্স কাস্টমার সার্ভিস
          </p>
          <p className="text-slate-500 text-[10px] mt-1">
            সোম-শনি: ১০:০০ - ২১:৩০ | শুক্রবার: বন্ধ
          </p>
        </div>
      </div>
    </div>
  );
};

export default TelegramSupport;