import React, { useState } from "react";
import products from "../data/products.json";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaWallet,
  FaArrowRight,
  FaFire,
  FaTimes,
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const ProductList = ({ user }) => {
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);

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

    Swal.fire({
      title: "বিনিয়োগ নিশ্চিত করুন",
      html: `
        <p><strong>${product.name}</strong></p>
        <p>৳${product.price}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "নিশ্চিত",
      confirmButtonColor: "#059669",
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
          {products.map((product) => (
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
                  e.stopPropagation(); // important
                  handleInvest(product);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 text-sm font-semibold flex justify-center items-center gap-2"
              >
                <FaWallet />
                কিনুন ৳ {product.price}
                <FaArrowRight size={12} />
              </button>
            </div>
          ))}
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
              />

              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full"
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

                <div className="flex justify-between">
                  <span>বিনিয়োগ</span>
                  <span className="font-bold text-green-600">
                    ৳ {selectedProduct.price}
                  </span>
                </div>

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

              </div>

              {/* Button */}
              <button
                onClick={() => handleInvest(selectedProduct)}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <FaWallet />
                বিনিয়োগ করুন
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
      `}</style>
    </>
  );
};

export default ProductList;