// AboutUs.jsx - Simple & Effective
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaHandHoldingUsd,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaTractor,
  FaSeedling,
  FaArrowRight,
  FaCheckCircle,
  FaMoneyBillWave,
  FaUserPlus,
  FaGift,
  FaWhatsapp,
  FaFacebook,
  FaEnvelope
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AboutUs = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: FaHandHoldingUsd,
      title: "কৃষি বিনিয়োগ",
      desc: "কৃষি খাতে বিনিয়োগ করুন এবং নিয়মিত আয় করুন",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: FaChartLine,
      title: "নিশ্চিত রিটার্ন",
      desc: "প্রতিদিন ৫% থেকে ১৫% পর্যন্ত নিশ্চিত আয়",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: FaUsers,
      title: "রেফারেল প্রোগ্রাম",
      desc: "বন্ধুদের আমন্ত্রণ জানিয়ে ১০% কমিশন আয় করুন",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: FaShieldAlt,
      title: "১০০% নিরাপদ",
      desc: "আপনার বিনিয়োগ সম্পূর্ণ সুরক্ষিত ও স্বচ্ছ",
      color: "from-green-600 to-emerald-600"
    }
  ];

  const benefits = [
    { text: "ন্যূনতম ২০০ টাকা উত্তোলন করতে পারবেন", icon: FaCheckCircle },
    { text: "২৪/৭ কাস্টমার সাপোর্ট", icon: FaCheckCircle },
    { text: "বিকাশ ও নগদে লেনদেন", icon: FaCheckCircle },
    { text: "প্রতিদিন আয় ক্লেইম করার সুযোগ", icon: FaCheckCircle },
    { text: "৩ লেভেলের রেফারেল কমিশন (১০%, ৫%, ২%)", icon: FaCheckCircle },
    { text: "লেভেল অনুযায়ী বোনাস (২০০ + ২০০ + ২০০)", icon: FaCheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-4 py-5">
        
        {/* হেডার */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg mb-3">
            <FaLeaf className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">AgroFund</h1>
          <p className="text-green-600 text-sm mt-1">আপনার কৃষি বিনিয়োগ সঙ্গী</p>
        </div>

        {/* কি কি করতে পারবেন */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-5 mb-5">
          <h2 className="text-lg font-bold text-green-800 mb-4 text-center">
            🌾 AgroFund তে যা যা করতে পারবেন
          </h2>
          
          <div className="space-y-4">
            {services.map((service, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <service.icon className="text-white text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{service.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* লাভ ও সুবিধা */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-5 mb-5">
          <h2 className="text-lg font-bold text-green-800 mb-4 text-center">
            🎁 লাভ ও সুবিধা সমূহ
          </h2>
          
          <div className="space-y-2">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <benefit.icon className="text-green-500 text-sm mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-xs">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* কমিশন স্ট্রাকচার */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-5 shadow-md mb-5">
          <h2 className="text-lg font-bold text-white text-center mb-4">
            💰 রেফারেল কমিশন স্ট্রাকচার
          </h2>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-white/20 rounded-lg p-2">
              <div className="text-white font-bold text-2xl">10%</div>
              <p className="text-white/80 text-[10px] mt-1">Level 1</p>
            </div>
            <div className="text-center bg-white/20 rounded-lg p-2">
              <div className="text-white font-bold text-2xl">5%</div>
              <p className="text-white/80 text-[10px] mt-1">Level 2</p>
            </div>
            <div className="text-center bg-white/20 rounded-lg p-2">
              <div className="text-white font-bold text-2xl">2%</div>
              <p className="text-white/80 text-[10px] mt-1">Level 3</p>
            </div>
          </div>
          
          <div className="mt-3 text-center bg-white/10 rounded-lg p-2">
            <p className="text-white text-[11px]">প্রতিটি ডিপোজিটের উপর</p>
            <p className="text-white font-bold text-sm">সরাসরি আপনার ব্যালেন্সে যুক্ত হবে</p>
          </div>
        </div>

        {/* বোনাস সিস্টেম */}
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-5">
          <h2 className="text-lg font-bold text-amber-800 text-center mb-3">
            🏆 লেভেল বোনাস
          </h2>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <span className="text-gray-700 text-xs">Level 1 (30 জন)</span>
              </div>
              <span className="text-amber-600 font-bold text-sm">৳২০০</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <span className="text-gray-700 text-xs">Level 2 (60 জন)</span>
              </div>
              <span className="text-amber-600 font-bold text-sm">৳২০০</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <span className="text-gray-700 text-xs">Level 3 (120 জন)</span>
              </div>
              <span className="text-amber-600 font-bold text-sm">৳২০০</span>
            </div>
          </div>
        </div>

        {/* CTA বাটন */}
        <div className="space-y-3 mb-5">
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold text-sm transition active:scale-95 flex items-center justify-center gap-2"
          >
            <FaUserPlus size={14} />
            এখনই অ্যাকাউন্ট খুলুন
          </button>
          
          <button
            onClick={() => navigate('/topup')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold text-sm transition active:scale-95 flex items-center justify-center gap-2"
          >
            <FaMoneyBillWave size={14} />
            বিনিয়োগ শুরু করুন
          </button>
        </div>

        {/* যোগাযোগ */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
          <h3 className="text-green-800 font-semibold text-sm text-center mb-3">যোগাযোগ করুন</h3>
          <div className="flex justify-center gap-4">
            <a href="https://wa.me/8801XXXXXXXXX" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition">
              <FaWhatsapp size={18} />
            </a>
            <a href="https://facebook.com" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition">
              <FaFacebook size={18} />
            </a>
            <a href="mailto:info@agrofund.com" className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
              <FaEnvelope size={18} />
            </a>
          </div>
          <p className="text-center text-gray-400 text-[10px] mt-3">
            সাপোর্ট: ০১XXXXXXXXX (সকাল ৯টা - রাত ৯টা)
          </p>
        </div>

        {/* ফুটার */}
        <div className="text-center mt-5 pt-3 border-t border-green-100">
          <div className="flex justify-center gap-2 mb-1">
            <FaLeaf className="text-green-400 text-xs" />
            <FaSeedling className="text-green-500 text-xs" />
            <FaTractor className="text-green-600 text-xs" />
          </div>
          <p className="text-gray-400 text-[10px]">AgroFund - আপনার কৃষি সঙ্গী</p>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;