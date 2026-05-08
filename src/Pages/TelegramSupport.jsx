// components/TelegramSupport.jsx - আপডেটেড ভার্সন

import React, { useState } from "react";
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
  FaSun,
  FaQuestionCircle,
  FaRobot,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaUserFriends,
  FaGift,
  FaStar,
  FaHandsHelping
} from "react-icons/fa";
import { SiTelegram } from "react-icons/si";

const TelegramSupport = () => {
  const [copied, setCopied] = useState(false);

  const supportLinks = [
    {
      id: 1,
      title: "অফিসিয়াল টেলিগ্রাম চ্যানেল",
      description: "সকল আপডেট, অফার ও নোটিফিকেশন পান",
      icon: FaTelegramPlane,
      link: "https://t.me/AgroFundBdOffical",
      color: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50",
      badge: "আপডেট",
      badgeColor: "bg-cyan-100 text-cyan-700"
    },
    {
      id: 2,
      title: "সাপোর্ট গ্রুপ",
      description: " পরামর্শ ও সমস্যার সমাধান",
      icon: FaHeadset,
      link: "https://t.me/AgroSupport1",
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
      badge: "সাপোর্ট",
      badgeColor: "bg-green-100 text-green-700"
    }
  ];



  const handleTelegramClick = (link) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const copyLink = () => {
    navigator.clipboard.writeText("https://t.me/AgroFundBdOffical");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-green-50">
      {/* ডেকোরেটিভ ব্যাকগ্রাউন্ড */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* ফসলের প্যাটার্ন */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leafPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 10 L35 20 L30 30 L25 20 Z" fill="#4CAF50" opacity="0.3"/>
                <path d="M30 50 L35 40 L30 30 L25 40 Z" fill="#4CAF50" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leafPattern)"/>
          </svg>
        </div>
        {/* গ্রেডিয়েন্ট ওভারলে */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-100/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-100/20 to-transparent"></div>
      </div>

      <div className="relative z-10 px-4 py-6 max-w-md mx-auto">
        
        {/* হেডার সেকশন - এনিমেটেড */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4 group">
            {/* রিং এফেক্ট */}
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-40 animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            
            {/* মেইন আইকন */}
            <div className="relative w-28 h-28 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
              <SiTelegram className="text-white text-6xl drop-shadow-lg" />
              {/* পার্টিকেল এফেক্ট */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-300 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
            <FaTractor className="text-green-600 text-xl animate-pulse" />
            সহায়তা কেন্দ্র
            <FaSeedling className="text-green-600 text-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          </h1>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <p className="text-xs text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
              🟢 ২৪/৭ কৃষি সহায়তা
            </p>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 max-w-xs mx-auto">
           যেকোনো সমস্যায় আমাদের সাপোর্ট টিম সাথে আছে। 
            টেলিগ্রামে জয়েন করে সরাসরি যোগাযোগ করুন।
          </p>
        </div>
        {/* কার্ড লিস্ট - আপডেটেড */}
        <div className="space-y-4 mb-6">
          {supportLinks.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleTelegramClick(item.link)}
              className="group bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* ব্যাজ বার */}
              <div className={`px-3 py-1.5 ${item.bg} border-b border-green-100 flex justify-between items-center`}>
                <span className={`text-[10px] font-semibold ${item.badgeColor} px-2 py-0.5 rounded-full`}>
                  {item.badge}
                </span>
                <span className="text-[9px] text-gray-400 flex items-center gap-1">
                  <FaTelegramPlane size={8} />
                  টেলিগ্রাম
                </span>
              </div>
              
              {/* কন্টেন্ট */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* আইকন বক্স */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-all`}>
                    <item.icon className="text-white text-2xl" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-base mb-1 flex items-center gap-1">
                      {item.title}
                      <span className="text-green-500 text-[8px]">● সক্রিয়</span>
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* মেম্বার কাউন্ট */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-[8px]">👨‍🌾</div>
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[8px]">👩‍🌾</div>
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[8px]">🌾</div>
                      </div>
                      <span className="text-[9px] text-gray-400">৫০০+ অনলাইন</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* বাটন সেকশন */}
              <div className="bg-gray-50 px-4 py-2 border-t border-green-100 flex justify-between items-center">
                <span className="text-[9px] text-gray-400 flex items-center gap-1">
                  <FaCheckCircle size={8} className="text-green-500" />
                  ভেরিফাইড গ্রুপ
                </span>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-md group-hover:shadow-lg transition-all">
                  <span className="text-white text-xs font-semibold">জয়েন নাও</span>
                  <FaArrowRight className="text-white text-xs group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* লিংক কপি সেকশন */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-lg mb-6 transform hover:scale-[1.01] transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FaGlobe className="text-white text-lg" />
            </div>
            <div className="flex-1">
              <p className="text-white text-xs font-semibold mb-1">গ্রুপ লিংক কপি করুন</p>
              <div className="flex items-center gap-2">
                <code className="bg-white/10 px-2 py-1 rounded text-white text-[9px] flex-1 truncate">
                  t.me/AgroFundBdOffical
                </code>
                <button
                  onClick={copyLink}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-green-400' : 'bg-white/20 hover:bg-white/30'} text-white`}
                >
                  {copied ? "কপি হয়েছে ✓" : "কপি"}
                </button>
              </div>
            </div>
          </div>
        </div>

       
       

        {/* সাপোর্ট সময়সূচী */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <FaClock className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 text-xs font-semibold">সাপোর্ট সময়সূচী</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-green-600 text-[9px] flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                 প্রতিদিন সকাল 10টা - রাত 10 টা
                </span>
              
              </div>
            </div>
            <div className="bg-green-100 px-2 py-1 rounded-full">
              <p className="text-green-700 text-[9px] font-bold flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                অনলাইন
              </p>
            </div>
          </div>
        </div>

        {/* হেল্পলাইন তথ্য */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 shadow-sm border border-amber-200 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FaHandsHelping className="text-amber-600 text-sm" />
            <h4 className="text-amber-800 font-semibold text-xs">জরুরি সহায়তা</h4>
          </div>
          <p className="text-amber-700 text-[10px] leading-relaxed">
            কোন জরুরি সমস্যায় সরাসরি টেলিগ্রামে মেসেজ করুন। আমাদের সাপোর্ট টিম ২৪/৭ আপনার জন্য প্রস্তুত।
           যেকোনো সমস্যার সমাধান পেতে দ্বিধা করবেন না।
          </p>
        </div>

        {/* কৃষি থিম ফুটার */}
        <div className="text-center pt-2">
          <div className="flex justify-center gap-4 mb-3">
            <FaWater className="text-green-400 text-sm animate-pulse" />
            <FaSun className="text-yellow-500 text-sm animate-spin" style={{ animationDuration: '10s' }} />
            <FaSeedling className="text-green-500 text-sm animate-bounce" style={{ animationDuration: '2s' }} />
            <FaTractor className="text-green-600 text-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-gray-400 text-[10px]">
            🌾 স্বাস্থ্যবান ফসল, সমৃদ্ধ কৃষক 🌾
          </p>
          <p className="text-gray-300 text-[9px] mt-1 flex items-center justify-center gap-1">
            <FaTelegramPlane size={8} />
            টেলিগ্রাম সাপোর্ট 24/7
            <FaHeadset size={8} />
          </p>
        </div>
      </div>

      {/* কাস্টম অ্যানিমেশন */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 10s linear infinite;
        }
        
        @keyframes ping {
          0% { transform: scale(0.95); opacity: 0.8; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        details > summary {
          list-style: none;
        }
        
        details > summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TelegramSupport;