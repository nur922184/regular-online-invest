// ProductList.jsx - Professional Green Theme with Modal
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaFire,
  FaGift,
  FaCheckCircle,
  FaTimes,
  FaShoppingCart,
  FaLeaf,
  FaSeedling,
  FaTractor,
  FaSpinner,
  FaClock,
  FaChartLine,
  FaWallet,
  FaInfoCircle,
  FaArrowRight
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const ProductList = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loaderRef = useRef(null);
  const productsPerPage = 5;

  const userId = user?._id;
  const balance = user?.balance || 0;

  // পণ্য লোড
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsFetchingProducts(true);

        const res = await fetch(
          "https://investify-backend.vercel.app/api/products/all"
        );
        const data = await res.json();

        const list = (data.products || data.data || data || []).map((p) => ({
          ...p,
          id: p._id || p.id,
        }));

        const sorted = list.sort((a, b) => a.price - b.price);

        setProducts(sorted);
        setVisibleProducts(sorted.slice(0, productsPerPage));
        setHasMore(sorted.length > productsPerPage);
      } catch {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: "পণ্য লোড করা যায়নি",
          confirmButtonColor: "#16a34a"
        });
      } finally {
        setIsFetchingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // বোনাস স্ট্যাটাস
  useEffect(() => {
    if (!userId) return;

    fetch(`https://investify-backend.vercel.app/api/bonus/status/${userId}`)
      .then((res) => res.json())
      .then((data) => setClaimedBonus(data.claimed === true))
      .catch(() => { });
  }, [userId]);

  // ইনফিনিটি স্ক্রল
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    setTimeout(() => {
      const start = page * productsPerPage;
      const more = products.slice(start, start + productsPerPage);

      if (more.length) {
        setVisibleProducts((prev) => [...prev, ...more]);
        setPage((p) => p + 1);
      }

      setHasMore(start + productsPerPage < products.length);
      setLoading(false);
    }, 300);
  }, [page, products, hasMore, loading]);

  useEffect(() => {
    if (!loaderRef.current || isFetchingProducts) return;

    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: "100px" }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, isFetchingProducts]);

  // মডাল খোলা
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // মডাল বন্ধ
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // পণ্য কেনা
  // ProductList.jsx - আপডেটেড ভার্সন (শুধু গুরুত্বপূর্ণ অংশ)

  // পণ্য কেনা ফাংশন - আপডেটেড
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
      if (balance < product.price) {
        closeModal();
        return Swal.fire({
          icon: "error",
          title: "পর্যাপ্ত ব্যালেন্স নেই",
          text: `আপনার ব্যালেন্স: ৳${balance.toLocaleString()}`,
          confirmButtonColor: "#ef4444"
        });
      }

      // ✅ সঠিক ডাটা পাঠানো হচ্ছে
      const requestBody = {
        userId: userId,
        productId: product._id,
        productName: product.name,  // ✅ productName যোগ করা হয়েছে
        amount: product.price,
        dailyIncome: product.dailyIncome,
        duration: product.duration,
        totalIncome: product.totalIncome,
      };

      console.log("Sending request:", requestBody); // ডিবাগের জন্য

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

        // ইউজার আপডেট
        if (onUserUpdate && data.newBalance) {
          onUserUpdate({ ...user, balance: data.newBalance });
        }

        Swal.fire({
          icon: "success",
          title: "অভিনন্দন! 🎉",
          text: data.message || "বিনিয়োগ সফল হয়েছে",
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

  // বোনাস ক্লেইম
  const handleBonus = async () => {
    if (!userId) return Swal.fire({
      icon: "warning",
      title: "লগইন করুন",
      confirmButtonColor: "#16a34a"
    });

    if (claimedBonus) return Swal.fire({
      icon: "info",
      title: "ইতিমধ্যে ক্লেইম করা হয়েছে",
      confirmButtonColor: "#16a34a"
    });

    try {
      const res = await fetch(
        "https://investify-backend.vercel.app/api/bonus/claim",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            bonusProductId: "bonus_mula",
          }),
        }
      );

      if (!res.ok) throw new Error();

      setClaimedBonus(true);
      Swal.fire({
        icon: "success",
        title: "অভিনন্দন! 🎁",
        text: "বোনাস সফলভাবে ক্লেইম হয়েছে",
        confirmButtonColor: "#16a34a"
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "বোনাস ক্লেইম ব্যর্থ",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  // নম্বর ফরম্যাট
  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  if (isFetchingProducts) {
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

        {/* বোনাস কার্ড */}
        <div className="mb-3">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl overflow-hidden shadow-md">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaGift className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">ফ্রি বোনাস প্যাকেজ</h3>
                  <p className="text-white/80 text-[10px]">৩৬৫ দিন • দৈনিক ৳৫</p>
                  <p className="text-white font-bold text-xs mt-1">মোট আয়: ৳১,৮২৫</p>
                </div>
                <button
                  onClick={handleBonus}
                  disabled={claimedBonus}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${claimedBonus
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-white text-orange-600 hover:bg-gray-100"
                    }`}
                >
                  {claimedBonus ? "ক্লেইম করা হয়েছে" : "ক্লেইম করুন"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* হেডার */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaLeaf className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-bold text-green-800">বিনিয়োগ প্যাকেজ</h1>
          </div>
        </div>

        {/* পণ্য লিস্ট */}
        <div className="space-y-4">
          {visibleProducts.map((product) => (
            <div
              key={product._id}
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
                  <p className="text-green-600 font-bold text-sm"> ৳ মূল্য {formatNumber(product.price)}</p>
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
                  <span className="text-green-100 text-sm flex items-center gap-1 bg-green-500 px-8 py-0.5 rounded-full">
                    কিনুন
                    <FaArrowRight size={10} />
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* লোড মোর */}
          <div ref={loaderRef} className="text-center py-3">
            {loading && (
              <div className="flex justify-center items-center gap-2">
                <FaSpinner className="animate-spin text-green-600" />
                <span className="text-green-600 text-xs">লোড হচ্ছে...</span>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            {/* Modal Box */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-4 animate-fadeIn">

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-800">
                  প্যাকেজ ডিটেইলস
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Product Info */}
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
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-green-50 rounded-xl py-2">
                  <p className="text-[10px] text-gray-500">মূল্য</p>
                  <p className="text-green-600 font-semibold text-sm">
                    ৳{formatNumber(selectedProduct.price)}
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

              {/* Profit */}
              <div className="flex justify-between items-center bg-amber-50 rounded-xl px-3 py-2 mb-4">
                <span className="text-xs text-gray-600">মোট লাভ</span>
                <span className="text-green-600 font-bold text-sm">
                  ৳{formatNumber(
                    selectedProduct.totalIncome - selectedProduct.price
                  )}
                </span>
              </div>

              {/* Button */}
              <button
                onClick={() => handlePurchase(selectedProduct)}
                disabled={processing}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold transition active:scale-95 disabled:opacity-50"
              >
                {processing
                  ? "প্রসেসিং..."
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

      {/* অ্যানিমেশন স্টাইল */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductList;