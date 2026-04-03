import { useState, useEffect } from 'react';
import { FaLeaf, FaTractor } from 'react-icons/fa';

const HeroSection = () => {
  const [user, setUser] = useState(null);

  const images = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&auto=format",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  return (
    <section className="relative h-[55vh] overflow-hidden">
      {/* Background Slider */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={img} alt="Agro Fund" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
        
        {/* Logo */}
        <div className="mb-5">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-3">
            <img 
              src="/agro-fund-logo.png" 
              alt="Agro Fund" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span className="text-white text-3xl">🌾</span>';
              }}
            />
          </div>
          
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <FaLeaf className="text-green-400" />
            <span>Agro Fund</span>
            <FaTractor className="text-green-400" />
          </h1>
          <p className="text-green-300 text-sm mt-1 font-medium">কৃষকের বিশ্বস্ত সঙ্গী</p>
        </div>

        {/* User Welcome */}
        {user && (
          <p className="text-white/90 text-base mb-2">
            স্বাগতম, {user.name?.split(' ')[0]}! 👋
          </p>
        )}

        {/* Tagline */}
        <p className="text-white/80 text-sm max-w-xs">
          নিরাপদ ও লাভজনক কৃষি বিনিয়োগ
        </p>

        {/* Buttons */}
        <div className="mt-5 flex gap-3">
          <button className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg text-white">
            {user ? 'বিনিয়োগ বাড়ান' : 'বিনিয়োগ করুন'}
          </button>
          
          <button className="border border-white/40 hover:bg-white/10 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all text-white">
            {user ? 'পোর্টফোলিও' : 'বিস্তারিত'}
          </button>
        </div>

        {/* Stats */}
        {!user ? (
          <div className="mt-6 flex gap-8 justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">৫০০+</div>
              <div className="text-xs text-white/60">বিনিয়োগকারী</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">১৫%</div>
              <div className="text-xs text-white/60">গড় রিটার্ন</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">১০০+</div>
              <div className="text-xs text-white/60">প্রকল্প</div>
            </div>
          </div>
        ) : user.balance && (
          <div className="mt-5 bg-white/15 backdrop-blur-md rounded-xl px-5 py-2.5">
            <p className="text-white/70 text-xs">আপনার ব্যালেন্স</p>
            <p className="text-white font-bold text-xl">৳ {user.balance?.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1 rounded-full transition-all ${
              index === current ? "w-8 bg-green-500" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;