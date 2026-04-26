// components/TelegramSupport.jsx
import React from "react";
import {
  FaTelegramPlane,
  FaHeadset,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaRegSmile,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaWater,
  FaSun
} from "react-icons/fa";
import { SiTelegram } from "react-icons/si";

const TelegramSupport = () => {
  const supportLinks = [
    {
      id: 1,
      title: "অফিসিয়াল কাউন্টার সাইটস 01",
      description: "সরাসরি যোগাযোগ করুন",
      icon: FaTelegramPlane,
      link: "https://t.me/your_customer_service_bot",
      color: "#0088cc",
    },
    {
      id: 2,
      title: "অফিসিয়াল কাউন্টার সাইটস 02",
      description: "সাপোর্ট টিমের সাথে সংযোগ",
      icon: FaHeadset,
      link: "https://t.me/your_official_channel",
      color: "#26A5E4",
    },
    {
      id: 3,
      title: "অফিসিয়াল টেলিগ্রাম হাইলেন",
      description: "সকল আপডেট পান",
      icon: FaUsers,
      link: "https://t.me/your_official_group",
      color: "#20B2AA",
    },
    {
      id: 4,
      title: "টেলিগ্রাম অফিসিয়াল গ্রুপ",
      description: "কৃষি তথ্য ও পরামর্শ",
      icon: FaLeaf,
      link: "https://t.me/your_official_crop",
      color: "#4CAF50",
    }
  ];

  const handleTelegramClick = (link) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* কৃষি ব্যাকগ্রাউন্ড প্যাটার্ন */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co.com/XkYrj2g0/image.png')] bg-cover bg-center"></div>
        {/* প্রাকৃতিক প্যাটার্ন */}
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #4CAF50 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
        {/* ফসলের ছায়া */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-100/50 to-transparent"></div>
      </div>

      <div className="relative z-10 px-4 py-6 max-w-md mx-auto">
        {/* হেডার সেকশন - কৃষি থিম */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300">
              <SiTelegram className="text-white text-5xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
            <FaTractor className="text-green-600 text-xl" />
            সহায়তা কেন্দ্র
            <FaSeedling className="text-green-600 text-xl" />
          </h1>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <p className="text-xs text-green-600 font-medium">২৪/৭ কৃষি সহায়তা</p>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            কৃষি বিষয়ক যেকোনো সমস্যায় আমাদের সাপোর্ট টিম সাথে আছে
          </p>
        </div>

        {/* কার্ড লিস্ট - লম্বালম্বি */}
        <div className="space-y-4 mb-6">
          {supportLinks.map((item) => (
            <div
              key={item.id}
              onClick={() => handleTelegramClick(item.link)}
              className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md"
            >
              {/* কন্টেন্ট */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                    <item.icon style={{ color: item.color }} className="text-2xl" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {/* জয়েন নাও বাটন */}
                <div className="bg-green-600 px-3 py-1.5 rounded-lg ml-2 flex items-center gap-1">
                  <span className="text-white text-xs font-medium">Join Now</span>
                  <FaArrowRight className="text-white text-xs" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* স্ট্যাটাস বার */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FaClock className="text-white text-lg" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">সাপোর্ট সময়সূচী</p>
              <p className="text-white/80 text-xs">সোম-শনি: সকাল ৯টা - রাত ৯টা</p>
            </div>
            <div className="bg-green-400 px-3 py-1 rounded-full">
              <p className="text-white text-xs font-bold">অনলাইন</p>
            </div>
          </div>
        </div>

       

        {/* যোগাযোগের তথ্য */}
        <div className="text-center pt-2">
          <div className="flex justify-center gap-4 mb-3">
            <FaWater className="text-green-400 text-sm" />
            <FaSun className="text-yellow-500 text-sm" />
            <FaSeedling className="text-green-500 text-sm" />
            <FaTractor className="text-green-600 text-sm" />
          </div>
          <p className="text-gray-400 text-xs">
         
          </p>
          <p className="text-gray-300 text-[10px] mt-1">
            সাপোর্ট টাইম: সকাল ৯টা - রাত ৯টা 
          </p>
        </div>
      </div>

      {/* অ্যানিমেশন স্টাইল */}
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default TelegramSupport;