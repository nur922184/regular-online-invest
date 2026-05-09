// components/TelegramNotice.jsx (আপডেটেড)

import React, { useState, useEffect } from 'react';
import { FaTelegramPlane, FaTimes, FaCheckCircle, FaBell, FaRocket } from 'react-icons/fa';

const TelegramNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const telegramNoticeHidden = localStorage.getItem('telegramNoticeHidden');
    
    if (!telegramNoticeHidden) {
      setIsVisible(true);
      
      // কাউন্টডাউন টাইমার
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleNeverShowAgain = () => {
    localStorage.setItem('telegramNoticeHidden', 'true');
    setIsVisible(false);
  };

  const handleJoinTelegram = () => {
    window.open('https://t.me/AgroFundBdOffical', '_blank');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
        
        {/* হেডার ব্যানার */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl p-4 text-center relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-yellow-400 rounded-full p-2 shadow-lg animate-bounce">
              <FaBell className="text-white text-xl" />
            </div>
          </div>
          <h3 className="text-white font-bold text-lg mt-2">বিশেষ আমন্ত্রণ!</h3>
        </div>

        {/* ক্লোজ বাটন */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white hover:text-gray-200 transition z-10"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* কন্টেন্ট */}
        <div className="p-6 text-center">
          {/* টেলিগ্রাম আইকন */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <FaTelegramPlane className="text-white text-4xl" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            টেলিগ্রাম চ্যানেলে জয়েন করুন! 🚀
          </h2>
          
          <p className="text-gray-500 text-sm mb-4">
            সবার আগে আপডেট পেতে এবং এক্সক্লুসিভ অফার পেতে এখনই জয়েন করুন
          </p>

          {/* বেনিফিট কার্ড */}
          <div className="grid grid-cols-1 gap-2 mb-5">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 flex items-center gap-2">
              <FaRocket className="text-blue-500 text-sm" />
              <span className="text-blue-700 text-xs font-medium">এক্সক্লুসিভ বোনাস অফার</span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 flex items-center gap-2">
              <FaCheckCircle className="text-blue-500 text-sm" />
              <span className="text-blue-700 text-xs font-medium">সাপোর্ট টিম ২৪/৭</span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 flex items-center gap-2">
              <FaCheckCircle className="text-blue-500 text-sm" />
              <span className="text-blue-700 text-xs font-medium">নতুন আপডেট সবার আগে</span>
            </div>
          </div>

          {/* জয়েন বাটন */}
          <button
            onClick={handleJoinTelegram}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 mb-3 flex items-center justify-center gap-2 group"
          >
            <FaTelegramPlane className="group-hover:translate-x-1 transition" />
            টেলিগ্রামে যোগ দিন
            {countdown > 0 && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {countdown}s
              </span>
            )}
          </button>

          {/* ফুটার */}
          <div className="flex justify-between items-center text-xs">
            <button
              onClick={handleNeverShowAgain}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              পরে মনে করিয়ে দিন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramNotice;