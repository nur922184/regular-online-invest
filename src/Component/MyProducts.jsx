import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCalendarAlt, FaClock, } from "react-icons/fa";

const MyProducts = ({ user }) => {
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const investments = user.investments || [];

  if (investments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            আপনার কোনো পণ্য নেই
          </h2>
          <p className="text-gray-600 mb-6">
            এখনই বিনিয়োগ করুন এবং আয় শুরু করুন!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            পণ্য ব্রাউজ করুন
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    return status === "active" ? "text-green-600 bg-green-100" : "text-gray-600 bg-gray-100";
  };

  const getStatusText = (status) => {
    return status === "active" ? "সক্রিয়" : "সমাপ্ত";
  };

  const calculateProgress = (investment) => {
    const daysSincePurchase = Math.floor((new Date() - new Date(investment.purchaseDate)) / (1000 * 60 * 60 * 24));
    const expectedEarned = Math.min(daysSincePurchase * investment.dailyIncome, investment.totalIncome);
    const progress = (expectedEarned / investment.totalIncome) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📦 আমার পণ্যসমূহ</h1>
          <p className="text-gray-600 text-sm">আপনার কেনা সব পণ্যের তালিকা</p>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">মোট পণ্য</p>
              <p className="text-2xl font-bold">{investments.length}টি</p>
            </div>
            <div>
              <p className="text-sm opacity-90">সক্রিয় পণ্য</p>
              <p className="text-2xl font-bold">
                {investments.filter(i => i.status === "active").length}টি
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">মোট বিনিয়োগ</p>
              <p className="text-2xl font-bold">
                ৳{investments.reduce((sum, inv) => sum + (inv.price || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {investments.map((investment, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="flex">
                <div className="w-28 h-28 relative">
                  <img
                    src={investment.image}
                    alt={investment.name}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-1 left-1 text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(investment.status)}`}>
                    {getStatusText(investment.status)}
                  </span>
                </div>

                <div className="flex-1 p-3">
                  <h3 className="text-sm font-bold text-gray-800">
                    {investment.name}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                    <FaCalendarAlt />
                    <span>
                      কেনার তারিখ: {new Date(investment.purchaseDate).toLocaleDateString("bn-BD")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-[10px] text-gray-500">দৈনিক আয়</p>
                      <p className="text-green-600 font-bold text-sm">
                        ৳ {investment.dailyIncome}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500">মোট আয়</p>
                      <p className="text-green-700 font-bold text-sm">
                        ৳ {investment.totalIncome}
                      </p>
                    </div>
                  </div>

                  {investment.status === "active" && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>আয়ের অগ্রগতি</span>
                        <span>{Math.floor(calculateProgress(investment))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${calculateProgress(investment)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  Swal.fire({
                    title: investment.name,
                    html: `
                      <div class="text-left">
                        <p><strong>📅 কেনার তারিখ:</strong> ${new Date(investment.purchaseDate).toLocaleDateString("bn-BD")}</p>
                        <p><strong>💰 বিনিয়োগ:</strong> ৳${investment.price || 0}</p>
                        <p><strong>📈 দৈনিক আয়:</strong> ৳${investment.dailyIncome}</p>
                        <p><strong>🎯 মোট আয়:</strong> ৳${investment.totalIncome}</p>
                        <p><strong>⏱️ মেয়াদ:</strong> ${investment.duration}</p>
                        <p><strong>📊 স্ট্যাটাস:</strong> ${getStatusText(investment.status)}</p>
                      </div>
                    `,
                    icon: "info",
                    confirmButtonText: "ঠিক আছে",
                    confirmButtonColor: "#059669",
                  });
                }}
                className="w-full bg-gray-50 text-gray-700 py-2 text-sm font-semibold flex justify-center items-center gap-2 hover:bg-gray-100 transition border-t"
              >
                <FaClock />
                বিস্তারিত দেখুন
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
        >
          নতুন পণ্য কিনুন
        </button>
      </div>
    </div>
  );
};

export default MyProducts;