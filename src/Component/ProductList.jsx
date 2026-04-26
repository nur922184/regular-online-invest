import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaFire, FaGift, FaCheckCircle } from "react-icons/fa";

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

  const loaderRef = useRef(null);
  const productsPerPage = 5;

  const userId = user?._id;
  const balance = user?.balance || 0;

  // ---------------- পণ্য লোড ----------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsFetchingProducts(true);

        const res = await fetch(
          "https://backend-project-invest.vercel.app/api/products/all"
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
        Swal.fire("ত্রুটি", "পণ্য লোড করা যায়নি", "error");
      } finally {
        setIsFetchingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // ---------------- বোনাস স্ট্যাটাস ----------------
  useEffect(() => {
    if (!userId) return;

    fetch(
      `https://backend-project-invest.vercel.app/api/bonus/status/${userId}`
    )
      .then((res) => res.json())
      .then((data) => setClaimedBonus(data.claimed === true))
      .catch(() => {});
  }, [userId]);

  // ---------------- ইনফিনিটি স্ক্রল ----------------
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

  // ---------------- কিনা ----------------
  const handlePurchase = async (product) => {
    if (!userId) return Swal.fire("লগইন করুন");

    if (processing) return;
    setProcessing(true);

    try {
      if (balance < product.price) {
        return Swal.fire(
          "পর্যাপ্ত ব্যালেন্স নেই",
          `আপনার ব্যালেন্স: ৳${balance}`,
          "error"
        );
      }

      const res = await fetch(
        "https://backend-project-invest.vercel.app/api/investments/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: product._id,
            amount: product.price,
            dailyIncome: product.dailyIncome,
            duration: product.duration,
            totalIncome: product.totalIncome,
            status: "active",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      Swal.fire("অভিনন্দন 🎉", "বিনিয়োগ সফল হয়েছে", "success").then(() =>
        navigate("/dashboard")
      );

      if (onUserUpdate && data.newBalance) {
        onUserUpdate({ ...user, balance: data.newBalance });
      }
    } catch (err) {
      Swal.fire("ত্রুটি", err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  // ---------------- বোনাস ----------------
  const handleBonus = async () => {
    if (!userId) return Swal.fire("লগইন করুন");

    if (claimedBonus) return Swal.fire("ইতিমধ্যে ক্লেইম করা হয়েছে");

    try {
      const res = await fetch(
        "https://backend-project-invest.vercel.app/api/bonus/claim",
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
      Swal.fire("অভিনন্দন 🎁", "বোনাস সফলভাবে ক্লেইম হয়েছে", "success");
    } catch {
      Swal.fire("ত্রুটি", "বোনাস ক্লেইম ব্যর্থ", "error");
    }
  };

  // ---------------- লোডিং ----------------
  if (isFetchingProducts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-500">লোড হচ্ছে...</p>
      </div>
    );
  }

  // ---------------- কার্ড ডিজাইন ----------------
  const Card = ({ item, bonus = false }) => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-xl transition">

      {/* Image + Info */}
      <div className="flex">
        <img
          src={item.image}
          className="w-28 h-28 object-cover"
          alt=""
        />

        <div className="p-3 flex-1">
          <h3 className="font-bold text-sm text-gray-800">
            {item.name}
          </h3>

          <p className="text-xs text-orange-500 mt-1">
            ⏳ মেয়াদ: {item.duration}
          </p>

          <div className="flex justify-between mt-2 text-xs">
            <span className="text-green-600">
              দৈনিক: ৳{item.dailyIncome}
            </span>
            <span className="text-emerald-700 font-semibold">
              মোট: ৳{item.totalIncome}
            </span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => (bonus ? handleBonus() : handlePurchase(item))}
        disabled={processing || (bonus && claimedBonus)}
        className={`w-full py-2 text-sm font-bold transition ${
          bonus
            ? claimedBonus
              ? "bg-gray-300 text-gray-600"
              : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
        }`}
      >
        {bonus
          ? claimedBonus
            ? "✔ বোনাস ক্লেইম করা হয়েছে"
            : "🎁 ফ্রি বোনাস ক্লেইম করুন"
          : `💰 কিনুন ৳${item.price}`}
      </button>
    </div>
  );

  // ---------------- UI ----------------
  return (
    <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
      {/* বোনাস */}
      <div className="bg-yellow-50 p-2 rounded-2xl border border-yellow-300">
        <Card
          item={{
            name: "🎁 ফ্রি বোনাস প্যাকেজ",
            image:
              "https://i.ibb.co.com/QSfHsHx/image-111327-1606302419.jpg",
            duration: "৩৬৫ দিন",
            dailyIncome: 5,
            totalIncome: 1825,
          }}
          bonus={true}
        />
      </div>

      {/* পণ্য */}
      {visibleProducts.map((p) => (
        <Card key={p._id} item={p} />
      ))}

      {/* লোডার */}
      <div ref={loaderRef} className="text-center py-3">
        {loading && (
          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        )}
      </div>
    </div>
  );
};

export default ProductList;