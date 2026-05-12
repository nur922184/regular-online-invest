// components/TelegramNotice.jsx (ছোট ও স্ট্যান্ডার্ড সাইজ)

import React, { useState, useEffect } from 'react';
import { FaTelegramPlane, FaTimes, FaBell } from 'react-icons/fa';
import { SiTelegram } from 'react-icons/si';

const TelegramNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const telegramNoticeHidden = localStorage.getItem('telegramNoticeHidden');
    const lastShown = localStorage.getItem('telegramNoticeLastShown');
    const now = new Date().getTime();
    
    if (!telegramNoticeHidden) {
      if (lastShown && (now - parseInt(lastShown)) < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
      setIsVisible(true);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 500);
      
      return () => clearInterval(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 200);
  };

  const handleRemindLater = () => {
    localStorage.setItem('telegramNoticeLastShown', new Date().getTime().toString());
    handleClose();
  };

  const handleNeverShowAgain = () => {
    localStorage.setItem('telegramNoticeHidden', 'true');
    handleClose();
  };

  const handleJoinTelegram = () => {
    window.open('https://t.me/AgroFundBdOffical', '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm">
      <div 
        className={`relative bg-white rounded-xl w-full max-w-[300px] shadow-lg transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* ক্লোজ বাটন */}
        <button
          onClick={handleClose}
          className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
        >
          <FaTimes className="text-gray-500 text-[8px]" />
        </button>

        {/* হেডার */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-t-xl py-2.5 px-3 text-center">
          <div className="flex justify-center mb-1">
            <div className="bg-yellow-400 rounded-full p-1.5 shadow">
              <FaBell className="text-white text-[10px]" />
            </div>
          </div>
          <h3 className="text-white font-bold text-[11px]">📢 আমন্ত্রণ!</h3>
        </div>

        {/* কন্টেন্ট */}
        <div className="p-3 text-center">
          {/* টেলিগ্রাম আইকন */}
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow">
              <SiTelegram className="text-white text-lg" />
            </div>
          </div>

          <h2 className="text-sm font-bold text-gray-800 mb-0.5">
            আমাদের সাথে যোগাযোগ করুন
          </h2>
          
          <p className="text-green-600 text-[10px] font-medium mb-0.5">
            AgroFund যোগদানে স্বাগতম
          </p>
          
          <p className="text-gray-400 text-[9px] mb-2 leading-tight">
            আমরা আশা করি আপনি AgroFund একজন গুরুত্বপূর্ণ সদস্য হতে পারবেন।
          </p>

          {/* চ্যানেল লিংক */}
          <div className="bg-gray-50 rounded-lg p-1.5 mb-2 border border-gray-100">
            <p className="text-gray-500 text-[8px] mb-0.5">📎 চ্যানেলে যোগদান করুন</p>
            <p className="text-blue-500 text-[9px] font-mono break-all">t.me/AgroFundBdOffical</p>
          </div>

          {/* জয়েন বাটন */}
          <button
            onClick={handleJoinTelegram}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg text-[11px] font-medium transition-all active:scale-95 mb-2 flex items-center justify-center gap-1.5"
          >
            <FaTelegramPlane size={10} />
            টেলিগ্রামে যোগ দিন
            {countdown > 0 && (
              <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[9px]">
                {countdown}s
              </span>
            )}
          </button>

          {/* ফুটার বাটন */}
          <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-gray-100">
            <button
              onClick={handleNeverShowAgain}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              {/* আর দেখাবেন না */}
            </button>
            <button
              onClick={handleRemindLater}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              পরে মনে করিয়ে দিন
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce {
          animation: bounce 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TelegramNotice;