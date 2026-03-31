import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="mb-6">
          <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <FaExclamationTriangle className="text-5xl text-white" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-gray-800 mb-2">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          পৃষ্ঠাটি পাওয়া যায়নি
        </h2>
        
        <p className="text-gray-500 mb-8">
          আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি আমাদের সার্ভারে নেই।<br />
          URL টি চেক করে আবার চেষ্টা করুন।
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <FaArrowLeft />
            <span>পেছনে</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
          >
            <FaHome />
            <span>হোম</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;