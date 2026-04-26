// FooterSimple.jsx - Super Simple
import React from 'react';
import { FaLeaf, FaFacebook, FaTelegram, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-md mx-auto px-4 py-5 text-center">
        
        {/* লোগো */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <FaLeaf className="text-green-300 text-xl" />
          <span className="text-lg font-bold">AgroFund</span>
        </div>

        {/* লিংক */}
        <div className="flex flex-wrap justify-center gap-4 text-xs mb-3">
          <a href="#" className="text-green-300 hover:text-white">হোম</a>
          <a href="#" className="text-green-300 hover:text-white">বিনিয়োগ</a>
          <a href="#" className="text-green-300 hover:text-white">সাপোর্ট</a>
          <a href="#" className="text-green-300 hover:text-white">যোগাযোগ</a>
        </div>

        {/* সোশ্যাল */}
        <div className="flex justify-center gap-3 mb-3">
          <a href="#" className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center">
            <FaFacebook className="text-white text-xs" />
          </a>
          <a href="#" className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center">
            <FaTelegram className="text-white text-xs" />
          </a>
        </div>

        {/* কপিরাইট */}
        <p className="text-green-400 text-[10px]">
          © {new Date().getFullYear()} AgroFund. All rights reserved.
        </p>

        {/* স্ক্রল টপ বাটন */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 w-9 h-9 bg-green-600 rounded-full shadow-md flex items-center justify-center"
        >
          <FaArrowUp className="text-white text-xs" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;