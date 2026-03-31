import React, { useEffect, useState } from "react";
import HeroSection from "../Component/HeroSection";

const images = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50">

    {/* 🌟 Hero Section */}

    <HeroSection></HeroSection>

      {/* 💡 Features Section */}
      <section className="py-16 px-6 grid md:grid-cols-3 gap-8 text-center">
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-700">🌱 বাস্তব প্রজেক্ট</h3>
          <p className="text-gray-600 mt-2">
            আমাদের সকল প্রজেক্ট বাস্তব কৃষি খামারের উপর ভিত্তি করে তৈরি
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-700">💰 লাভ ভাগাভাগি</h3>
          <p className="text-gray-600 mt-2">
            বিনিয়োগের উপর ভিত্তি করে লাভ সবার মাঝে ভাগ করে দেওয়া হয়
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-700">🔒 নিরাপদ প্ল্যাটফর্ম</h3>
          <p className="text-gray-600 mt-2">
            আপনার বিনিয়োগ সম্পূর্ণ নিরাপদ ও স্বচ্ছ ব্যবস্থাপনায় পরিচালিত
          </p>
        </div>

      </section>

      {/* 🌾 Projects Section */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">
          আমাদের বিনিয়োগ প্রজেক্টসমূহ
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          
          {[
            "ধান চাষ প্রজেক্ট",
            "মাছ চাষ প্রজেক্ট",
            "গরু পালন প্রজেক্ট",
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">{item}</h3>
              <p className="text-gray-500 mt-2">
                ৩-৬ মাসের মধ্যে সম্ভাব্য লাভ প্রদান করা হয়
              </p>
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                বিস্তারিত দেখুন
              </button>
            </div>
          ))}

        </div>
      </section>

      {/* 📊 Trust Section */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-3xl font-bold">কেন AgroFund BD?</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10 px-6">
          <div>
            <h3 className="text-2xl font-bold text-green-600">1000+</h3>
            <p>সন্তুষ্ট ইনভেস্টর</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-600">50+</h3>
            <p>সক্রিয় কৃষি প্রজেক্ট</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-600">95%</h3>
            <p>সফলতা হার</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;