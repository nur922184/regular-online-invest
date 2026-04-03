import React, { useEffect, useState } from "react";
import HeroSection from "../Component/HeroSection";
import { useNavigate } from "react-router-dom";
// import { FaChartLine, FaCalendarAlt, FaPercentage, FaTakaSign, FaEye, FaTimes, FaWallet, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaArrowRight, FaCalendarAlt, FaChartLine, FaEye, FaPercentage, FaTimes, FaWallet } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  // 12 টি প্রোডাক্ট
  const products = [
    {
      id: 1,
      name: "ধান চাষ",
      fullName: "ধান চাষ প্রজেক্ট",
      image: "https://agrogoln.com/wp-content/uploads/2015/10/%E0%A6%A7%E0%A6%BE%E0%A6%A8-%E0%A6%9A%E0%A6%BE%E0%A6%B7%E0%A7%87-%E0%A6%B8%E0%A6%BE%E0%A6%B0-%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%AF%E0%A6%BC%E0%A7%8B%E0%A6%97%E0%A7%87-2-1024x577.jpg",
      price: 5000,
      profit: 15,
      duration: "৬ মাস",
      returnPeriod: "মাসিক",
      description: "উচ্চ ফলনশীল ধানের চাষে বিনিয়োগ করুন। আধুনিক পদ্ধতিতে চাষাবাদ করা হয়।"
    },
    {
      id: 2,
      name: "মাছ চাষ",
      fullName: "মাছ চাষ প্রজেক্ট",
      image: "https://livestockanimalnews.com/wp-content/uploads/2024/07/fish-5.png",
      price: 10000,
      profit: 18,
      duration: "৪ মাস",
      returnPeriod: "মাসিক",
      description: "পাঙ্গাস ও তেলাপিয়া মাছ চাষে লাভজনক বিনিয়োগ।"
    },
    {
      id: 3,
      name: "গরু পালন",
      fullName: "গরু পালন প্রজেক্ট",
      image: "https://farmsandfarmer24.com/wp-content/uploads/2020/07/Cow-Farm_The-Dhaka-Report-643x336.jpg",
      price: 20000,
      profit: 20,
      duration: "৮ মাস",
      returnPeriod: "মেয়াদ শেষে",
      description: "দেশী ও সংকর গরু মোটাতাজাকরণ প্রকল্প।"
    },
    {
      id: 4,
      name: "মুরগি পালন",
      fullName: "মুরগি পালন প্রজেক্ট",
      image: "https://cdn.tuko.co.ke/images/1120/61d7b06322cfdafd.jpeg?v=1",
      price: 3000,
      profit: 12,
      duration: "৩ মাস",
      returnPeriod: "মাসিক",
      description: "লেয়ার ও ব্রয়লার মুরগি পালনে স্বল্পমেয়াদী বিনিয়োগ।"
    },
    {
      id: 5,
      name: "সবজি চাষ",
      fullName: "সবজি চাষ প্রজেক্ট",
      image: "https://www.agriculturelearning.com/wp-content/uploads/2018/11/Squash-Cultivation-768x427.jpg",
      price: 4000,
      profit: 14,
      duration: "৩ মাস",
      returnPeriod: "মাসিক",
      description: "মৌসুমী সবজি চাষে স্বল্পমেয়াদী বিনিয়োগ।"
    },
    {
      id: 6,
      name: "ফল বাগান",
      fullName: "ফল বাগান প্রজেক্ট",
      image: "https://minnetonkaorchards.com/wp-content/uploads/2022/09/Honey-600x400.jpg",
      price: 15000,
      profit: 25,
      duration: "১২ মাস",
      returnPeriod: "মেয়াদ শেষে",
      description: "আম, লিচু ও কাঠাল বাগানে দীর্ঘমেয়াদী বিনিয়োগ।"
    },
    {
      id: 7,
      name: "মসলা চাষ",
      fullName: "মসলা চাষ প্রজেক্ট",
      image: "https://imrorwxhrornlq5q.ldycdn.com/cloud/lmBpjKnllpSRrkjriplqjo/Spices-drying.jpg",
      price: 6000,
      profit: 22,
      duration: "৫ মাস",
      returnPeriod: "মাসিক",
      description: "আদা, হলুদ ও মরিচ চাষে লাভজনক বিনিয়োগ।"
    },
    {
      id: 8,
      name: "হাঁস পালন",
      fullName: "হাঁস পালন প্রজেক্ট",
      image: "https://www.shutterstock.com/shutterstock/videos/1032753746/thumb/1.jpg?ip=x480",
      price: 3500,
      profit: 16,
      duration: "৩ মাস",
      returnPeriod: "মাসিক",
      description: "হাঁস পালন ও ডিম উৎপাদন প্রকল্প।"
    },
    {
      id: 9,
      name: "ছাগল পালন",
      fullName: "ছাগল পালন প্রজেক্ট",
      image: "https://media.istockphoto.com/id/1290247717/photo/indian-brown-and-black-village-goats.jpg?s=170667a&w=0&k=20&c=NGIQVB4IB0WHa323OseqaoGkAzC6vfXiWRzs5IGvods=",
      price: 8000,
      profit: 19,
      duration: "৬ মাস",
      returnPeriod: "মাসিক",
      description: "ব্ল্যাক বেঙ্গল ছাগল পালন প্রকল্প।"
    },
    {
      id: 10,
      name: "মৌ চাষ",
      fullName: "মৌ চাষ প্রজেক্ট",
      image: "https://siouxhoney.com/wp-content/uploads/2015/04/earthday-featured.jpg",
      price: 12000,
      profit: 30,
      duration: "৬ মাস",
      returnPeriod: "মাসিক",
      description: "মধু উৎপাদনে লাভজনক বিনিয়োগ।"
    },
    {
      id: 11,
      name: "নীল চাষ",
      fullName: "নীল চাষ প্রজেক্ট",
      image: "https://thaifreezedry.com/wp-content/uploads/OG-model.jpg",
      price: 7000,
      profit: 17,
      duration: "৪ মাস",
      returnPeriod: "মাসিক",
      description: "নীল ফুল ও রং উৎপাদন প্রকল্প।"
    },
    {
      id: 12,
      name: "ঘাস উৎপাদন",
      fullName: "ঘাস উৎপাদন প্রজেক্ট",
      image: "https://www.shutterstock.com/image-photo/indian-man-cutting-grass-sickle-600nw-2196883111.jpg",
      price: 4500,
      profit: 13,
      duration: "২ মাস",
      returnPeriod: "মাসিক",
      description: "গবাদি পশুর খাদ্য হিসেবে ঘাস উৎপাদন।"
    }
  ];

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleInvest = (product) => {
    setIsModalOpen(false);
    if (!user) {
      Swal.fire({
        title: "লগইন প্রয়োজন!",
        text: "বিনিয়োগ করতে অনুগ্রহ করে লগইন করুন",
        icon: "warning",
        confirmButtonText: "লগইন করুন",
        confirmButtonColor: "#059669"
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    Swal.fire({
      title: "বিনিয়োগ নিশ্চিত করুন",
      html: `
        <div class="text-left">
          <p><strong>${product.fullName}</strong></p>
          <p>বিনিয়োগের পরিমাণ: ৳${product.price.toLocaleString()}</p>
          <p>প্রত্যাশিত লাভ: ${product.profit}%</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "নিশ্চিত করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#059669"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("সফল!", "আপনার বিনিয়োগ সম্পন্ন হয়েছে", "success");
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Hero Section */}
      <HeroSection />


      {/* Products Section - 2 Columns on Mobile */}
      <section className="py-6 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">বিনিয়োগ প্রজেক্টসমূহ</h2>
          <p className="text-gray-500 text-sm mt-1">আপনার পছন্দের প্রজেক্টে বিনিয়োগ করুন</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 active:scale-98"
            >
              {/* Product Image */}
              <div className="h-28 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {product.profit}%
                </div>
              </div>

              {/* Product Info */}
              <div className="p-2.5">
                <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">{product.fullName}</h3>

                {/* Price */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-500">মূল্য</span>
                  <span className="text-xs font-bold text-green-600">৳{product.price.toLocaleString()}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-500">মেয়াদ</span>
                  <span className="text-[10px] font-medium text-gray-700">{product.duration}</span>
                </div>

                {/* Return */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500">রিটার্ন</span>
                  <span className="text-[10px] font-medium text-emerald-600">{product.returnPeriod}</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="flex-1 bg-gray-100 text-green-700 py-1.5 rounded-lg text-[10px] font-medium hover:bg-gray-200 transition flex items-center justify-center gap-1"
                  >
                    <FaEye size={8} />
                    বিস্তারিত
                  </button>
                  <button
                    onClick={() => handleInvest(product)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-1.5 rounded-lg text-[10px] font-medium hover:from-green-700 transition"
                  >
                    বিনিয়োগ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Features Section - Mobile Optimized */}
      <section className="py-8 px-4">
        <div className="grid grid-cols-1 gap-3 max-w-6xl mx-auto">
          <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h3 className="text-sm font-bold text-green-700">বাস্তব প্রজেক্ট</h3>
              <p className="text-gray-500 text-xs">বাস্তব কৃষি খামারের ভিত্তিতে</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-2">
              <span className="text-xl">💰</span>
              <div>
                <h3 className="text-xs font-bold text-green-700">লাভ ভাগাভাগি</h3>
                <p className="text-gray-500 text-[10px]">সবার মাঝে লাভ ভাগ</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-2">
              <span className="text-xl">🔒</span>
              <div>
                <h3 className="text-xs font-bold text-green-700">নিরাপদ</h3>
                <p className="text-gray-500 text-[10px]">সুরক্ষিত প্ল্যাটফর্ম</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section - Mobile Optimized */}
      <section className="py-8 px-4 bg-gradient-to-r from-green-700 to-emerald-700">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-5">কেন Agro Fund?</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-2xl font-bold text-yellow-300">১০০০+</div>
              <p className="text-white/80 text-[10px] mt-1">বিনিয়োগকারী</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-300">৫০+</div>
              <p className="text-white/80 text-[10px] mt-1">সক্রিয় প্রজেক্ট</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-300">৯৫%</div>
              <p className="text-white/80 text-[10px] mt-1">সফলতা হার</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Product Details */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 animate-fadeIn">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="relative h-48">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.fullName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.fullName}</h3>
              <p className="text-gray-600 text-sm mb-5">{selectedProduct.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaBangladeshiTakaSign className="text-green-600" />
                    <span className="text-sm">বিনিয়োগ মূল্য</span>
                  </div>
                  <div className="font-bold text-lg text-green-600">৳{selectedProduct.price.toLocaleString()}</div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaPercentage className="text-green-600" />
                    <span className="text-sm">প্রত্যাশিত লাভ</span>
                  </div>
                  <div className="font-semibold text-emerald-600">{selectedProduct.profit}%</div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-green-600" />
                    <span className="text-sm">মেয়াদকাল</span>
                  </div>
                  <div className="font-semibold text-gray-700">{selectedProduct.duration}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaChartLine className="text-green-600" />
                    <span className="text-sm">রিটার্ন</span>
                  </div>
                  <div className="font-semibold text-gray-700">{selectedProduct.returnPeriod}</div>
                </div>
              </div>

              {/* Expected Return Calculator */}
              <div className="bg-green-50 rounded-xl p-4 mb-5">
                <p className="text-sm text-green-800 font-semibold mb-2">প্রত্যাশিত রিটার্ন:</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">মোট রিটার্ন</span>
                  <span className="text-xl font-bold text-green-700">
                    ৳{(selectedProduct.price + (selectedProduct.price * selectedProduct.profit / 100)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">মূলধন + লাভ</span>
                  <span className="text-xs text-green-600">লাভ: ৳{(selectedProduct.price * selectedProduct.profit / 100).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => handleInvest(selectedProduct)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-700 transition"
              >
                <FaWallet size={16} />
                বিনিয়োগ করুন
                <FaArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Home;