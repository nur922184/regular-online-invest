// ProductList.jsx - পেজিনেশন বাটন সহ (নেক্সট/প্রিভিয়াস)

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaLeaf,
  FaSeedling,
  FaTractor,
  FaSpinner,
  FaClock,
  FaChartLine,
  FaArrowRight,
  FaGift,
  FaCheckCircle,
  FaCrown,
  FaDatabase,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const ProductList = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();

  // স্টেট ম্যানেজমেন্ট
  const [products, setProducts] = useState([]);
  const [freeProduct, setFreeProduct] = useState(null);
  const [paidProducts, setPaidProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasClaimedFreeProduct, setHasClaimedFreeProduct] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const productsPerPage = 6; // প্রতি পৃষ্ঠায় ৬ টি পণ্য
  const userId = user?._id;
  const balance = user?.balance || 0;

  // পেজিনেশন ক্যালকুলেশন
  const totalPages = Math.ceil(paidProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = paidProducts.slice(startIndex, endIndex);

  // ✅ ক্যাশ ফাংশন
  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem('product_cache');
      if (cached) {
        const { data, timestamp, expiry } = JSON.parse(cached);
        if (Date.now() - timestamp < 300000) { // 5 minutes
          return data;
        }
      }
    } catch (error) {
      console.error("ক্যাশ লোড করতে সমস্যা:", error);
    }
    return null;
  }, []);

  const saveToCache = useCallback((data) => {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
        expiry: 300000
      };
      localStorage.setItem('product_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error("ক্যাশ সেভ করতে সমস্যা:", error);
    }
  }, []);

  // ✅ ফ্রি প্রোডাক্ট চেক করা
  useEffect(() => {
    const checkFreeProductClaimed = async () => {
      if (!userId) return;
      
      const cachedClaim = localStorage.getItem(`free_claimed_${userId}`);
      if (cachedClaim) {
        setHasClaimedFreeProduct(JSON.parse(cachedClaim));
        return;
      }
      
      try {
        const res = await fetch(
          `https://investify-backend.vercel.app/api/investments/user/${userId}`
        );
        const data = await res.json();
        
        if (data.success && data.investments) {
          const hasFree = data.investments.some(
            (inv) => inv.productType === "free" || inv.amount === 0
          );
          setHasClaimedFreeProduct(hasFree);
          localStorage.setItem(`free_claimed_${userId}`, JSON.stringify(hasFree));
        }
      } catch (error) {
        console.error("ফ্রি প্রোডাক্ট চেক করতে সমস্যা:", error);
      }
    };
    
    checkFreeProductClaimed();
  }, [userId]);

  // ✅ API থেকে সকল পণ্য লোড করা
  useEffect(() => {
    const fetchProducts = async () => {
      if (isDataLoaded) return;
      
      try {
        setInitialLoading(true);
        
        const cachedData = loadFromCache();
        if (cachedData) {
          // console.log("ক্যাশ থেকে ডাটা লোড করা হচ্ছে...");
          const { free, paid } = cachedData;
          setFreeProduct(free);
          setPaidProducts(paid);
          setIsDataLoaded(true);
          setInitialLoading(false);
          return;
        }

        console.log("API থেকে ডাটা লোড করা হচ্ছে...");
        const res = await fetch(
          "https://investify-backend.vercel.app/api/products/all"
        );
        const data = await res.json();

        let list = (data.products || data.data || data || []).map((p) => ({
          ...p,
          id: p._id || p.id,
        }));

        const free = list.find(p => p.type === "free") || null;
        const paid = list.filter(p => p.type !== "free").sort((a, b) => a.price - b.price);

        setFreeProduct(free);
        setPaidProducts(paid);
        
        saveToCache({ free, paid });
        setIsDataLoaded(true);
        
      } catch (error) {
        console.error("পণ্য লোড করতে সমস্যা:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: "পণ্য লোড করা যায়নি। ইন্টারনেট সংযোগ চেক করুন।",
          confirmButtonColor: "#16a34a"
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProducts();
  }, [loadFromCache, saveToCache, isDataLoaded]);

  // ✅ পেজ পরিবর্তন ফাংশন
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ পেজ নম্বর জেনারেট করা
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // ✅ ম্যানুয়াল রিফ্রেশ
  const handleManualRefresh = useCallback(() => {
    localStorage.removeItem('product_cache');
    setIsDataLoaded(false);
    setCurrentPage(1);
    setPaidProducts([]);
    window.location.reload();
  }, []);

  // মডাল ফাংশন
  const openModal = (product) => {
    if (product.type === "free" && hasClaimedFreeProduct) {
      Swal.fire({
        icon: "info",
        title: "ইতিমধ্যে নিয়েছেন!",
        text: "আপনি বিআইপি প্যাকেজটি ইতিমধ্যে নিয়ে ফেলেছেন। প্রতিটি ইউজার শুধুমাত্র একবার এই প্যাকেজ নিতে পারবেন।",
        confirmButtonColor: "#16a34a"
      });
      return;
    }
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // পণ্য কেনার ফাংশন
  const handlePurchase = async (product) => {
    if (!userId) {
      closeModal();
      return Swal.fire({
        icon: "warning",
        title: "লগইন করুন",
        text: "পণ্য কেনার জন্য লগইন প্রয়োজন",
        confirmButtonColor: "#16a34a"
      });
    }

    if (processing) return;
    setProcessing(true);

    try {
      if (product.type !== "free" && balance < product.price) {
        closeModal();
        return Swal.fire({
          icon: "error",
          title: "পর্যাপ্ত ব্যালেন্স নেই",
          text: `আপনার ব্যালেন্স: ৳${balance.toLocaleString()}`,
          confirmButtonColor: "#ef4444"
        });
      }

      const requestBody = {
        userId: userId,
        productId: product._id,
        productName: product.name,
        amount: product.type === "free" ? 0 : product.price,
        dailyIncome: product.dailyIncome,
        duration: product.duration,
        totalIncome: product.totalIncome,
        productType: product.type === "free" ? "free" : "paid"
      };

      const res = await fetch(
        "https://investify-backend.vercel.app/api/investments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "বিনিয়োগ ব্যর্থ হয়েছে");
      }

      if (data.success) {
        closeModal();

        if (product.type === "free") {
          setHasClaimedFreeProduct(true);
          localStorage.setItem(`free_claimed_${userId}`, JSON.stringify(true));
        }

        if (onUserUpdate && data.newBalance) {
          onUserUpdate({ ...user, balance: data.newBalance });
        }

        Swal.fire({
          icon: "success",
          title: product.type === "free" ? "অভিনন্দন! 🎁" : "অভিনন্দন! 🎉",
          text: data.message || (product.type === "free" ? "বিআইপি প্যাকেজ সফলভাবে নেওয়া হয়েছে!" : "বিনিয়োগ সফল হয়েছে"),
          confirmButtonColor: "#16a34a",
          timer: 2000
        }).then(() => {
          navigate("/my_product");
        });
      } else {
        throw new Error(data.message);
      }

    } catch (err) {
      console.error("Purchase error:", err);
      closeModal();
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: err.message || "বিনিয়োগ করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setProcessing(false);
    }
  };

  // নম্বর ফরম্যাট
  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  // প্রোডাক্ট কার্ড কম্পোনেন্ট
  const ProductCard = ({ product }) => (
    <div
      onClick={() => openModal(product)}
      className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-[0.99]"
    >
      <div className="flex">
        <img
          src={product.image}
          alt={product.name}
          className="w-28 h-28 object-cover"
          onError={(e) => {
            e.target.src = "https://i.ibb.co.com/JhvzjC8/1.jpg";
          }}
        />
        <div className="flex-1 p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-1">{product.name}</h3>
          <p className="text-green-600 font-bold text-sm">মূল্য ৳ {formatNumber(product.price)}</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="text-blue-500 flex items-center gap-1">
              <FaClock size={10} />
              {product.duration}
            </span>
            <span className="text-green-500 flex items-center gap-1">
              <FaChartLine size={10} />
              দৈনিক ৳{formatNumber(product.dailyIncome)}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-green-50 px-3 py-2 border-t border-green-100">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">মোট আয়: <span className="text-purple-600 font-bold">৳ {formatNumber(product.totalIncome)}</span></span>
          <span className="bg-green-500 text-white text-sm flex items-center gap-1 px-4 py-0.5 rounded-full">
            কিনুন
            <FaArrowRight size={10} />
          </span>
        </div>
      </div>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-3" />
          <p className="text-green-600 text-sm">পণ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-4 py-2">

        {/* হেডার ও রিফ্রেশ বাটন */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <FaSeedling className="text-green-500 text-lg" />
            <h1 className="text-lg font-bold text-green-700">পণ্যের তালিকা</h1>
          </div>
          <button
            onClick={handleManualRefresh}
            className="text-xs text-gray-400 hover:text-green-600 flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm"
          >
            <FaDatabase size={10} />
            ক্যাশ রিফ্রেশ
          </button>
        </div>

        {/* ========== ফ্রি/বিআইপি প্রোডাক্ট সেকশন ========== */}
        {freeProduct && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <FaCrown size={12} />
                বিশেষ অফার
              </span>
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <FaGift size={10} />
                বিআইপি
              </span>
            </div>
            
            <div
              onClick={() => !hasClaimedFreeProduct && openModal(freeProduct)}
              className={`bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg border-2 border-amber-400 overflow-hidden cursor-pointer transition-all ${
                hasClaimedFreeProduct ? "opacity-75 cursor-not-allowed" : "active:scale-[0.99] hover:shadow-xl"
              }`}
            >
              <div className="flex relative">
                <div className="absolute left-2 top-2 z-10">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <FaGift size={8} />
                    সম্পূর্ণ ফ্রি!
                  </span>
                </div>
                
                <img
                  src={freeProduct.image}
                  alt={freeProduct.name}
                  className="w-28 h-28 object-cover"
                  onError={(e) => {
                    e.target.src = "https://i.ibb.co.com/JhvzjC8/1.jpg";
                  }}
                />
                <div className="flex-1 p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-1">
                      <FaCrown className="text-amber-500 text-xs" />
                      {freeProduct.name}
                    </h3>
                    {hasClaimedFreeProduct && (
                      <span className="text-green-500 text-[10px] flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                        <FaCheckCircle size={10} />
                        প্রাপ্ত
                      </span>
                    )}
                  </div>
                  
                  <p className="font-bold text-amber-600 text-sm">
                    ফ্রি (বিআইপি অফার)
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-blue-500 flex items-center gap-1">
                      <FaClock size={10} />
                      {freeProduct.duration}
                    </span>
                    <span className="text-green-500 flex items-center gap-1">
                      <FaChartLine size={10} />
                      দৈনিক ৳{formatNumber(freeProduct.dailyIncome)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-3 py-2 border-t border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">
                    মোট আয়: 
                    <span className="font-bold text-amber-700">
                      ৳ {formatNumber(freeProduct.totalIncome)}
                    </span>
                  </span>
                  <span className={`text-sm flex items-center gap-1 px-4 py-0.5 rounded-full ${
                    hasClaimedFreeProduct 
                      ? "bg-gray-400 text-white cursor-not-allowed" 
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  }`}>
                    {hasClaimedFreeProduct ? "প্রাপ্ত" : "ফ্রি ক্লেইম করুন"}
                    {!hasClaimedFreeProduct && <FaArrowRight size={10} />}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== বিনিয়োগ লিস্ট টাইটেল ========== */}
        <div className="mb-3">
          <h2 className="text-lg font-bold text-green-700 flex items-center gap-2">
            <FaSeedling className="text-green-500" />
            বিনিয়োগ লিস্ট
            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {paidProducts.length} টি প্যাকেজ
            </span>
          </h2>
          <div className="w-12 h-0.5 bg-green-500 rounded-full mt-1"></div>
        </div>

        {/* ========== পেইড পণ্যের তালিকা ========== */}
        {currentProducts.length > 0 ? (
          <div className="space-y-4">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl">
            <p className="text-gray-500 text-sm">কোন পণ্য পাওয়া যায়নি</p>
          </div>
        )}

        {/* ========== পেজিনেশন বাটন ========== */}
        {totalPages > 1 && (
          <div className="mt-6 mb-4">
            <div className="flex items-center justify-center gap-2">
              {/* প্রিভিয়াস বাটন */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                <FaChevronLeft size={12} />
              </button>

              {/* পেজ নম্বর */}
              <div className="flex gap-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && goToPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-green-600 text-white shadow-md"
                        : page === '...'
                        ? "bg-transparent text-gray-400 cursor-default"
                        : "bg-gray-100 text-gray-700 hover:bg-green-100"
                    }`}
                    disabled={page === '...'}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* নেক্সট বাটন */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                <FaChevronRight size={12} />
              </button>
            </div>

            {/* পেজ ইনফো */}
            <div className="text-center mt-3">
              <p className="text-[10px] text-gray-400">
                পৃষ্ঠা {currentPage} / {totalPages} | মোট {paidProducts.length} টি পণ্য
              </p>
            </div>
          </div>
        )}

        {/* পণ্য কেনার মডাল */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-sm bg-white rounded-2xl shadow-xl p-4 animate-fadeIn ${
              selectedProduct.type === "free" ? "ring-2 ring-amber-300" : ""
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-800">
                  {selectedProduct.type === "free" ? "🎁 বিআইপি প্যাকেজ" : "প্যাকেজ ডিটেইলস"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={selectedProduct.image}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover border"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ⏳ {selectedProduct.duration}
                  </p>
                  {selectedProduct.type === "free" && (
                    <span className="text-amber-600 text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      সম্পূর্ণ ফ্রি!
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className={`${selectedProduct.type === "free" ? "bg-amber-50" : "bg-green-50"} rounded-xl py-2`}>
                  <p className="text-[10px] text-gray-500">মূল্য</p>
                  <p className={`font-semibold text-sm ${selectedProduct.type === "free" ? "text-amber-600" : "text-green-600"}`}>
                    {selectedProduct.type === "free" ? "ফ্রি" : `৳${formatNumber(selectedProduct.price)}`}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl py-2">
                  <p className="text-[10px] text-gray-500">দৈনিক</p>
                  <p className="text-blue-600 font-semibold text-sm">
                    ৳{formatNumber(selectedProduct.dailyIncome)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl py-2">
                  <p className="text-[10px] text-gray-500">মোট</p>
                  <p className="text-purple-600 font-semibold text-sm">
                    ৳{formatNumber(selectedProduct.totalIncome)}
                  </p>
                </div>
              </div>

              <div className={`flex justify-between items-center rounded-xl px-3 py-2 mb-4 ${
                selectedProduct.type === "free" ? "bg-amber-50" : "bg-amber-50"
              }`}>
                <span className="text-xs text-gray-600">মোট লাভ</span>
                <span className="text-green-600 font-bold text-sm">
                  ৳{formatNumber(selectedProduct.totalIncome - (selectedProduct.price || 0))}
                </span>
              </div>

              {selectedProduct.type === "free" && (
                <div className="bg-blue-50 rounded-xl px-3 py-2 mb-4 text-center">
                  <p className="text-xs text-blue-600">
                    ⚡ শুধুমাত্র প্রথমবারের জন্য ফ্রি! একবার নিলেই দৈনিক আয় শুরু হবে।
                  </p>
                </div>
              )}

              <button
                onClick={() => handlePurchase(selectedProduct)}
                disabled={processing}
                className={`w-full text-white py-2.5 rounded-xl text-sm font-semibold transition active:scale-95 disabled:opacity-50 ${
                  selectedProduct.type === "free" 
                    ? "bg-gradient-to-r from-amber-500 to-orange-600" 
                    : "bg-gradient-to-r from-green-500 to-emerald-600"
                }`}
              >
                {processing
                  ? "প্রসেসিং..."
                  : selectedProduct.type === "free" 
                    ? "🎁 ফ্রি প্যাকেজ নিন"
                    : `৳${formatNumber(selectedProduct.price)} বিনিয়োগ করুন`}
              </button>
            </div>
          </div>
        )}

        {/* ফুটার */}
        <div className="text-center mt-6 pt-4 border-t border-green-100">
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

export default ProductList;