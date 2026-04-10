import React, { useState, useEffect, useRef, useCallback } from "react";
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

const ProductList = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [processing, setProcessing] = useState(false);
  const loaderRef = useRef(null);
  const productsPerPage = 5;

  const getUserId = () => user?._id || user?.id;
  const getUserBalance = () => user?.balance || 0;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsFetchingProducts(true);
        const res = await fetch(
          "https://backend-project-invest.vercel.app/api/products/all"
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const list = (data.products || data.data || data || []).map((p) => ({
          ...p,
          id: p._id || p.id,
        }));
        
        // Sort products by price (lowest to highest)
        const sortedList = [...list].sort((a, b) => a.price - b.price);
        
        setProducts(sortedList);
        setVisibleProducts(sortedList.slice(0, productsPerPage));
        setHasMore(sortedList.length > productsPerPage);
      } catch (err) {
        Swal.fire("ত্রুটি!", "পণ্য লোড করতে সমস্যা হয়েছে", "error");
      } finally {
        setIsFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Check bonus status
  useEffect(() => {
    if (!user?._id) return;
    fetch(`https://backend-project-invest.vercel.app/api/bonus/status/${user._id}`)
      .then((res) => res.json())
      .then((data) => setClaimedBonus(data.claimed === true))
      .catch(() => {});
  }, [user]);

  // Infinite scroll
  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const start = page * productsPerPage;
      const more = products.slice(start, start + productsPerPage);
      if (more.length) {
        setVisibleProducts((prev) => [...prev, ...more]);
        setPage((prev) => prev + 1);
        setHasMore(start + productsPerPage < products.length);
      }
      setLoading(false);
    }, 200);
  }, [page, products, hasMore, loading]);

  useEffect(() => {
    if (!loaderRef.current || isFetchingProducts) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMoreProducts(),
      { rootMargin: "100px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMoreProducts, isFetchingProducts]);

  // Purchase product
  const handlePurchase = async (product) => {
    const userId = getUserId();
    if (!userId) {
      Swal.fire({
        title: "লগইন প্রয়োজন!",
        text: "বিনিয়োগ করতে লগইন করুন",
        icon: "warning",
        confirmButtonText: "লগইন",
        confirmButtonColor: "#059669",
      }).then(() => navigate("/login"));
      return;
    }

    if (processing) return;
    setProcessing(true);

    try {
      // Check user balance
      const currentBalance = getUserBalance();
      
      if (currentBalance < product.price) {
        Swal.fire({
          title: "অপর্যাপ্ত ব্যালেন্স!",
          html: `
            <p>আপনার ব্যালেন্স: ৳${currentBalance.toLocaleString()}</p>
            <p>প্রয়োজন: ৳${product.price.toLocaleString()}</p>
            <p class="text-red-600 mt-2">অনুগ্রহ করে রিচার্জ করুন</p>
          `,
          icon: "error",
          confirmButtonText: "রিচার্জ করুন",
          confirmButtonColor: "#f59e0b",
          showCancelButton: true,
          cancelButtonText: "পরে দেখবেন",
        }).then((res) => res.isConfirmed && navigate("/recharge"));
        return;
      }

      const confirm = await Swal.fire({
        title: "বিনিয়োগ নিশ্চিত করুন",
        html: `
          <div class="text-center">
            <p class="font-bold text-lg mb-2">${product.name}</p>
            <p class="text-2xl font-bold text-green-600 mb-2">৳${product.price.toLocaleString()}</p>
            <p class="text-sm">দৈনিক আয়: ৳${product.dailyIncome?.toLocaleString()}</p>
            <p class="text-sm">মোট আয়: ৳${product.totalIncome?.toLocaleString()}</p>
            <p class="text-sm">মেয়াদ: ${product.duration}</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "বিনিয়োগ করুন",
        confirmButtonColor: "#059669",
        cancelButtonText: "বাতিল",
        icon: "question",
      });

      if (!confirm.isConfirmed) return;

      Swal.fire({ title: "প্রক্রিয়াকরণ হচ্ছে...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      // Send purchase request
      const res = await fetch(
        "https://backend-project-invest.vercel.app/api/investments/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: product._id,
            productName: product.name,
            amount: product.price,
            dailyIncome: product.dailyIncome,
            duration: product.duration,
            totalIncome: product.totalIncome,
            status: "active"
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (onUserUpdate && data.newBalance) {
        onUserUpdate({ ...user, balance: data.newBalance });
      }

      Swal.fire({
        title: "অভিনন্দন! 🎉",
        html: `আপনি ${product.name} এ বিনিয়োগ করেছেন!<br>পরিমাণ: ৳${product.price.toLocaleString()}`,
        icon: "success",
        confirmButtonText: "ড্যাশবোর্ডে যান",
        confirmButtonColor: "#059669",
      }).then(() => navigate("/dashboard"));
    } catch (err) {
      Swal.fire("ত্রুটি!", err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  // Claim bonus
  const handleClaimBonus = async () => {
    const userId = getUserId();
    if (!userId) {
      Swal.fire({
        title: "লগইন প্রয়োজন!",
        text: "বোনাস ক্লেইম করতে লগইন করুন",
        icon: "warning",
        confirmButtonText: "লগইন",
        confirmButtonColor: "#059669",
      }).then(() => navigate("/login"));
      return;
    }

    if (claimedBonus) {
      Swal.fire("ইতিমধ্যে ক্লেইম করেছেন!", "আপনি বোনাস প্যাকেজটি ক্লেইম করেছেন।", "info");
      return;
    }

    const confirm = await Swal.fire({
      title: "ফ্রি বোনাস!",
      html: `
        <div class="text-center">
          <div class="text-6xl mb-3">🎁</div>
          <p><strong>মুলা প্যাকেজ (বোনাস)</strong></p>
          <p class="text-green-600 font-bold">দৈনিক আয়: ৳5 | মোট: ৳1825</p>
          <p class="text-xs text-gray-500">কোনো বিনিয়োগ ছাড়াই!</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "ক্লেইম করুন 🎁",
      confirmButtonColor: "#f59e0b",
      icon: "success",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({ title: "প্রক্রিয়াকরণ হচ্ছে...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      
      const res = await fetch("https://backend-project-invest.vercel.app/api/bonus/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bonusProductId: "bonus_mula" }),
      });

      if (!res.ok) throw new Error("Claim failed");
      setClaimedBonus(true);
      Swal.fire("অভিনন্দন! 🎉", "বোনাস ক্লেইম সফল! দৈনিক ৳5 আয় শুরু করুন।", "success");
    } catch (err) {
      Swal.fire("ত্রুটি!", "বোনাস ক্লেইম ব্যর্থ হয়েছে", "error");
    }
  };

  const bonusProduct = {
    id: "bonus_mula",
    name: "মুলা প্যাকেজ",
    price: 0,
    dailyIncome: 5,
    duration: "৩৬৫ দিন",
    totalIncome: 1825,
    image: "https://i.ibb.co.com/QSfHsHx/image-111327-1606302419.jpg",
    description: "মুলা চাষে দীর্ঘমেয়াদী বিনিয়োগ। কম ঝুঁকিতে প্রতিদিন নির্দিষ্ট আয় পাওয়ার সুযোগ।",
    isBonus: true,
  };

  if (isFetchingProducts) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">পণ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const ProductCard = ({ product, isBonus = false, onAction }) => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
      <div className="flex">
        <div className="w-28 h-28 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/112")}
          />
          {!isBonus && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <FaFire /> HOT
            </span>
          )}
        </div>
        <div className="flex-1 p-3">
          <h3 className="text-sm font-bold">{product.name}</h3>
          <p className="text-[11px] text-orange-500 mt-1">⏳ {product.duration}</p>
          <div className="flex justify-between mt-2">
            <div>
              <p className="text-[10px] text-gray-500">দৈনিক আয়</p>
              <p className="text-green-600 font-bold">৳ {product.dailyIncome?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">মোট আয়</p>
              <p className="text-green-700 font-bold">৳ {product.totalIncome?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onAction}
        disabled={processing || (isBonus && claimedBonus)}
        className={`w-full py-2 text-sm font-semibold flex justify-center items-center gap-2 transition-all ${
          (isBonus && claimedBonus) || processing
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : isBonus
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg"
            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
        }`}
      >
        {isBonus ? (
          claimedBonus ? <><FaCheckCircle /> ইতিমধ্যে ক্লেইম</> : <><FaGift />  বোনাস </>
        ) : (
          <> এখনিই কিনুন ৳ {product.price?.toLocaleString()} </>
        )}
      </button>
    </div>
  );

  return (
    <>
      <section className="py-6 px-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-4">🌱 বিনিয়োগ প্যাকেজ</h2>
        <div className="space-y-4">
          {/* Bonus Product */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg overflow-hidden border-2 border-amber-400 relative">
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <FaGift /> ফ্রি 
              </span>
            </div>
            <ProductCard product={bonusProduct} isBonus={true} onAction={() => handleClaimBonus()} />
          </div>

          {/* Regular Products - Already sorted by price (lowest to highest) */}
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} onAction={() => handlePurchase(product)} />
          ))}

          {hasMore && (
            <div ref={loaderRef} className="py-4 text-center">
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

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden animate-slideUp">
            <div className="relative h-48">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "https://via.placeholder.com/400")}
              />
              {selectedProduct.isBonus && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <FaGift /> ফ্রি
                </div>
              )}
              <button onClick={() => setSelectedProduct(null)} className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{selectedProduct.description || "এই প্যাকেজে বিনিয়োগ করে দৈনিক আয় করুন"}</p>
              <div className="space-y-2 text-sm">
                {!selectedProduct.isBonus && selectedProduct.price > 0 && (
                  <div className="flex justify-between">
                    <span>বিনিয়োগ</span>
                    <span className="font-bold text-green-600">৳ {selectedProduct.price?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>দৈনিক আয়</span>
                  <span className="font-bold">৳ {selectedProduct.dailyIncome?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>মেয়াদ</span>
                  <span>{selectedProduct.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>মোট আয়</span>
                  <span className="font-bold text-green-700">৳ {selectedProduct.totalIncome?.toLocaleString()}</span>
                </div>
                {selectedProduct.isBonus && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-green-700 font-semibold text-xs">✨ কোনো বিনিয়োগ ছাড়াই দৈনিক আয় করুন! ✨</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  selectedProduct.isBonus ? handleClaimBonus() : handlePurchase(selectedProduct);
                  setSelectedProduct(null);
                }}
                disabled={(selectedProduct.isBonus && claimedBonus) || processing}
                className={`w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  (selectedProduct.isBonus && claimedBonus) || processing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : selectedProduct.isBonus
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
                }`}
              >
                {selectedProduct.isBonus ? (claimedBonus ? <><FaCheckCircle /> ইতিমধ্যে ক্লেইম</> : <><FaGift /> ফ্রি বোনাস ক্লেইম</>) : <><FaWallet /> বিনিয়োগ করুন</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        body { background-color: #f9fafb; }
      `}</style>
    </>
  );
};

export default ProductList;