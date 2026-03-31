import { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa';

const HeroSection = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalInvestment: 0,
    totalProfit: 0
  });

  // Images array - moved inside component
  const images = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
  ];

  const [current, setCurrent] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Load user data
  useEffect(() => {
    // ইউজার ডাটা লোড করুন
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
    
    // স্ট্যাটস ডাটা লোড করুন (আপনার API বা localStorage থেকে)
    const statsData = JSON.parse(localStorage.getItem("userStats"));
    if (statsData) {
      setStats(statsData);
    } else {
      // উদাহরণ ডাটা
      setStats({
        totalBalance: 12500,
        totalInvestment: 10000,
        totalProfit: 2500
      });
    }
  }, []);

  return (
    <section className="relative h-[70vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
      {/* Slider Image */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Agro"
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay with User Card */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60">
        {/* User Info Card - Top Right */}
        {user && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.phone}</p>
                </div>
              </div>
              
              {/* Balance Card */}
              <div className="border-l pl-3 sm:pl-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">ব্যালেন্স</p>
                    <p className="text-lg sm:text-2xl font-bold text-teal-600">
                      ৳{user.balance || '0'}
                    </p>
                  </div>
                  <FaWallet className="text-2xl sm:text-3xl text-teal-500" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="h-full flex items-center justify-center text-center px-4">
          <div className="text-white max-w-3xl mx-auto animate-fade-in-up">
            {/* Welcome Message for Logged-in Users */}
            {user && (
              <div className="mb-4">
                <p className="text-sm sm:text-base text-green-300">
                  স্বাগতম, {user.name}! 👋
                </p>
              </div>
            )}
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              কৃষিতে বিনিয়োগ করুন, <br className="hidden sm:block" />
              ভবিষ্যৎ গড়ুন 🌾
            </h1>
            
            <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto px-2">
              AgroFund BD আপনাকে দিচ্ছে নিরাপদ ও লাভজনক কৃষি বিনিয়োগের সুযোগ
            </p>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button className="bg-green-600 hover:bg-green-700 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                {user ? 'বিনিয়োগ বাড়ান' : 'এখনই বিনিয়োগ করুন'}
              </button>
              
              <button className="border-2 border-white hover:bg-white/10 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300">
                {user ? 'আমার পোর্টফোলিও' : '了解更多'}
              </button>
            </div>
            
            {/* Public Stats */}
            {!user && (
              <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-green-400">৫০০+</div>
                  <div className="text-xs md:text-sm text-gray-200">বিনিয়োগকারী</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-green-400">১৫%</div>
                  <div className="text-xs md:text-sm text-gray-200">গড় রিটার্ন</div>
                </div>
                <div className="text-center col-span-2 md:col-span-1">
                  <div className="text-xl md:text-2xl font-bold text-green-400">১০০+</div>
                  <div className="text-xs md:text-sm text-gray-200">প্রকল্প</div>
                </div>
              </div>
            )}
            
            {/* User-specific Stats */}
            {user && stats && (
              <div className="mt-8 md:mt-12 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-200">মোট বিনিয়োগ</p>
                  <p className="text-lg sm:text-xl font-bold text-green-400">
                    ৳{stats.totalInvestment?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-200">মোট প্রফিট</p>
                  <p className="text-lg sm:text-xl font-bold text-green-400">
                    ৳{stats.totalProfit?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;