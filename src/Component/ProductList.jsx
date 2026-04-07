import React, { useState, useEffect, useRef, useCallback } from "react";
import products from "../data/products.json";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaWallet,
  FaArrowRight,
  FaFire,
  FaTimes,
  FaGift,
  FaCheckCircle,
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const ProductList = ({ user }) => {
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const productsPerPage = 5;

  // Bonus Product Data
  const bonusProduct = {
    "id": 1,
    "name": "মুলা প্যাকেজ",
    "price": 200,
    "dailyIncome": 5,
    "duration": "365 দিন",
    "totalIncome": 1825,
    "image": "https://i.ibb.co.com/QSfHsHx/image-111327-1606302419.jpg",
    "description": "মুলা চাষে দীর্ঘমেয়াদী বিনিয়োগ। কম ঝুঁকিতে প্রতিদিন নির্দিষ্ট আয় পাওয়ার সুযোগ।",
    isBonus: true
  };

  // Pre-load initial products instantly
  useEffect(() => {
    // Load first batch immediately
    const initialProducts = products.slice(0, productsPerPage);
    setVisibleProducts(initialProducts);
    setHasMore(products.length > productsPerPage);
  }, []);

  // Load more products when scrolling
  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // Use setTimeout with 0ms for instant loading (just for state update)
    // No artificial delay
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = 0;
      const endIndex = nextPage * productsPerPage;
      const newProducts = products.slice(0, endIndex);
      
      setVisibleProducts(newProducts);
      setPage(nextPage);
      setHasMore(endIndex < products.length);
      setLoading(false);
    }, 0);
  }, [page, loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "100px" // Load slightly before reaching the bottom
      }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, loadMoreProducts]);

  // Invest Function
  const handleInvest = (product) => {
    if (!user) {
      Swal.fire({
        title: "লগইন প্রয়োজন!",
        text: "বিনিয়োগ করতে লগইন করুন",
        icon: "warning",
        confirmButtonText: "লগইন",
        confirmButtonColor: "#059669",
      }).then(() => navigate("/login"));
      return;
    }

    // Special handling for bonus product
    if (product.isBonus) {
      if (claimedBonus) {
        Swal.fire({
          title: "ইতিমধ্যে ক্লেইম করেছেন!",
          text: "আপনি ইতিমধ্যে বোনাস প্যাকেজটি ক্লেইম করেছেন।",
          icon: "info",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#059669",
        });
        return;
      }

      Swal.fire({
        title: "ফ্রি বোনাস!",
        html: `
          <div class="text-center">
            <div class="text-6xl mb-3">🎁</div>
            <p><strong>${product.name}</strong></p>
            <p class="text-green-600 font-bold mt-2">দৈনিক আয়: ৳${product.dailyIncome}</p>
            <p class="text-sm text-gray-600 mt-2">মোট আয়: ৳${product.totalIncome}</p>
            <p class="text-xs text-gray-500 mt-2">কোনো বিনিয়োগ ছাড়াই!</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "ক্লেইম করুন 🎁",
        confirmButtonColor: "#f59e0b",
        cancelButtonText: "পরে দেখবেন",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          setClaimedBonus(true);
          Swal.fire({
            title: "অভিনন্দন! 🎉",
            text: `আপনি সফলভাবে বোনাস ক্লেইম করেছেন! দৈনিক ৳${product.dailyIncome} আয় শুরু করুন।`,
            icon: "success",
            confirmButtonText: "চলুন শুরু করি",
            confirmButtonColor: "#059669",
          });
        }
      });
      return;
    }

    // Regular product investment
    Swal.fire({
      title: "বিনিয়োগ নিশ্চিত করুন",
      html: `
        <p><strong>${product.name}</strong></p>
        <p class="text-lg font-bold text-green-600">৳${product.price}</p>
        <p class="text-sm text-gray-600 mt-2">দৈনিক আয়: ৳${product.dailyIncome}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "নিশ্চিত",
      confirmButtonColor: "#059669",
      cancelButtonText: "বাতিল",
    });
  };

  return (
    <>
      {/* Product Section */}
      <section className="py-6 px-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-4">
          🌱 বিনিয়োগ প্যাকেজ
        </h2>

        <div className="space-y-4">
          
          {/* 🔥 BONUS PRODUCT - FREE */}
          <div
            onClick={() => setSelectedProduct(bonusProduct)}
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-amber-400 relative"
          >
            {/* Bonus Badge */}
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <FaGift /> ফ্রি বোনাস
              </span>
            </div>

            <div className="flex">
              {/* Image */}
              <div className="w-28 h-28 relative">
                <img
                  src={bonusProduct.image}
                  alt="Free Bonus"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-500/20"></div>
              </div>

              {/* Info */}
              <div className="flex-1 p-3">
                <h3 className="text-sm font-bold text-amber-800">
                  {bonusProduct.name}
                </h3>

                <p className="text-[11px] text-orange-600 mt-1 flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" /> {bonusProduct.duration}
                </p>

                <div className="flex justify-between mt-2">
                  <div>
                    <p className="text-[10px] text-gray-500">দৈনিক আয়</p>
                    <p className="text-green-600 font-bold text-sm">
                      ৳ {bonusProduct.dailyIncome}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-gray-500">মোট আয়</p>
                    <p className="text-green-700 font-bold text-sm">
                      ৳ {bonusProduct.totalIncome}
                    </p>
                  </div>
                </div>

                {/* Free Tag */}
                <div className="mt-1">
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    সম্পূর্ণ ফ্রি
                  </span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleInvest(bonusProduct);
              }}
              disabled={claimedBonus}
              className={`w-full py-2 text-sm font-semibold flex justify-center items-center gap-2 transition-all duration-300 ${
                claimedBonus
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg"
              }`}
            >
              {claimedBonus ? (
                <>
                  <FaCheckCircle />
                  ইতিমধ্যে ক্লেইম করেছেন
                </>
              ) : (
                <>
                  <FaGift />
                  ফ্রি বোনাস ক্লেইম করুন 🎁
                  <FaArrowRight size={12} />
                </>
              )}
            </button>
          </div>

          {/* Regular Products - Instant loading */}
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex">
                {/* Image */}
                <div className="w-28 h-28 relative">
                  <img
                    src={product.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FaFire /> HOT
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 p-3">
                  <h3 className="text-sm font-bold">
                    {product.name}
                  </h3>

                  <p className="text-[11px] text-orange-500 mt-1">
                    ⏳ {product.duration}
                  </p>

                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-[10px] text-gray-500">দৈনিক আয়</p>
                      <p className="text-green-600 font-bold">
                        ৳ {product.dailyIncome}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-gray-500">মোট আয়</p>
                      <p className="text-green-700 font-bold">
                        ৳ {product.totalIncome}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleInvest(product);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 text-sm font-semibold flex justify-center items-center gap-2 hover:shadow-lg transition-all"
              >
                <FaWallet />
                এখনিই কিনুন ৳ {product.price}
                <FaArrowRight size={12} />
              </button>
            </div>
          ))}

          {/* Loading indicator and intersection observer target */}
          {hasMore && (
            <div 
              ref={loaderRef} 
              className="py-4 text-center"
            >
              {loading && (
                <div className="flex justify-center items-center gap-2 text-gray-500">
                  <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">লোড হচ্ছে...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 🔥 Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden animate-slideUp">
            {/* Image */}
            <div className="relative h-48">
              <img
                src={selectedProduct.image}
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
              />
              {selectedProduct.isBonus && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <FaGift /> ফ্রি
                </div>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">
                {selectedProduct.name}
              </h3>

              <p className="text-sm text-gray-600 mb-3">
                {selectedProduct.description}
              </p>

              {/* Info */}
              <div className="space-y-2 text-sm">
                {!selectedProduct.isBonus && (
                  <div className="flex justify-between">
                    <span>বিনিয়োগ</span>
                    <span className="font-bold text-green-600">
                      ৳ {selectedProduct.price}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>দৈনিক আয়</span>
                  <span className="font-bold">
                    ৳ {selectedProduct.dailyIncome}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>মেয়াদ</span>
                  <span>{selectedProduct.duration}</span>
                </div>

                <div className="flex justify-between">
                  <span>মোট আয়</span>
                  <span className="font-bold text-green-700">
                    ৳ {selectedProduct.totalIncome}
                  </span>
                </div>

                {selectedProduct.isBonus && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-green-700 font-semibold text-xs">
                      ✨ কোনো বিনিয়োগ ছাড়াই দৈনিক আয় করুন! ✨
                    </p>
                  </div>
                )}
              </div>

              {/* Button */}
              <button
                onClick={() => handleInvest(selectedProduct)}
                disabled={selectedProduct.isBonus && claimedBonus}
                className={`w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  selectedProduct.isBonus && claimedBonus
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : selectedProduct.isBonus
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
                }`}
              >
                {selectedProduct.isBonus ? (
                  claimedBonus ? (
                    <>
                      <FaCheckCircle />
                      ইতিমধ্যে ক্লেইম করেছেন
                    </>
                  ) : (
                    <>
                      <FaGift />
                      ফ্রি বোনাস ক্লেইম করুন
                    </>
                  )
                ) : (
                  <>
                    <FaWallet />
                    বিনিয়োগ করুন
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        /* Prevent white flash on scroll */
        body {
          background-color: #f9fafb;
        }
      `}</style>
    </>
  );
};

export default ProductList;