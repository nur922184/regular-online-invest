import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaHandHoldingUsd,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaTractor,
  FaTree,
  FaWater,
  FaSun,
  FaArrowRight,
  FaRegClock,
  FaRegHeart,
  FaAward,
  FaGlobe,
  FaSeedling,
  FaHandshake,
  FaRocket
} from "react-icons/fa";
import { GiFarmTractor, GiPlantRoots, GiFarmer } from "react-icons/gi";

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaLeaf,
      title: "টেকসই কৃষি",
      description: "পরিবেশবান্ধব ও টেকসই কৃষি পদ্ধতি ব্যবহার করে আমরা নিশ্চিত করছি দীর্ঘমেয়াদী ফলাফল।",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaHandHoldingUsd,
      title: "লাভজনক বিনিয়োগ",
      description: "আপনার বিনিয়োগ থেকে নিশ্চিত রিটার্ন। কৃষি খাতে বিনিয়োগ করে স্থিতিশীল আয়ের সুযোগ।",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: FaShieldAlt,
      title: "১০০% নিরাপদ",
      description: "আমাদের প্ল্যাটফর্ম সম্পূর্ণ নিরাপদ। আপনার বিনিয়োগ সুরক্ষিত এবং স্বচ্ছ।",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaUsers,
      title: "সক্রিয় কমিউনিটি",
      description: "১০০০+ সক্রিয় বিনিয়োগকারী এবং ৫০০+ কৃষকের সাথে আমাদের বড় কমিউনিটি।",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaChartLine,
      title: "উচ্চ রিটার্ন",
      description: "কৃষি খাতে বিনিয়োগে ১৫% পর্যন্ত গড় রিটার্ন যা ব্যাংকের চেয়ে অনেক বেশি।",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: FaTractor,
      title: "আধুনিক প্রযুক্তি",
      description: "আধুনিক কৃষি প্রযুক্তি এবং পদ্ধতি ব্যবহার করে আমরা উৎপাদনশীলতা বৃদ্ধি করছি।",
      color: "from-yellow-500 to-amber-500"
    }
  ];

  const stats = [
    { number: "৫০০+", label: "সক্রিয় বিনিয়োগকারী", icon: FaUsers },
    { number: "১০০+", label: "কৃষি প্রকল্প", icon: GiFarmTractor },
    { number: "১৫%", label: "গড় রিটার্ন", icon: FaChartLine },
    { number: "২৪/৭", label: "সাপোর্ট", icon: FaRegClock },
    { number: "১০০%", label: "নিরাপদ প্ল্যাটফর্ম", icon: FaShieldAlt },
    { number: "৫০০০+", label: "একর জমি", icon: GiPlantRoots }
  ];

  const milestones = [
    { year: "২০২৩", title: "যাত্রা শুরু", description: "AgroFund BD এর যাত্রা শুরু", icon: FaRocket },
    { year: "২০২৪", title: "১০০+ প্রকল্প", description: "১০০টি কৃষি প্রকল্প সফল", icon: FaChartLine },
    { year: "২০২৫", title: "৫০০+ বিনিয়োগকারী", description: "৫০০ জনের বেশি সদস্য", icon: FaUsers },
    { year: "২০২৬", title: "বিস্তৃতি", description: "সারাদেশে সেবা বিস্তার", icon: FaGlobe }
  ];

  const teamValues = [
    {
      icon: FaRegHeart,
      title: "আমাদের দৃষ্টি",
      description: "একটি টেকসই কৃষি অর্থনীতি গড়ে তোলা যেখানে প্রতিটি বিনিয়োগকারী এবং কৃষক লাভবান হন।"
    },
    {
      icon: FaHandshake,
      title: "আমাদের মিশন",
      description: "কৃষি খাতে বিনিয়োগকে সহজ, নিরাপদ এবং লাভজনক করে তোলা। প্রযুক্তির মাধ্যমে কৃষক ও বিনিয়োগকারীদের সংযুক্ত করা।"
    },
    {
      icon: FaSeedling,
      title: "আমাদের মূল্যবোধ",
      description: "স্বচ্ছতা, বিশ্বাস, টেকসই উন্নয়ন এবং পারস্পরিক সম্মান - এই মূল্যবোধে আমরা বিশ্বাস করি।"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3"
            alt="Agriculture Field"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto text-white animate-fadeInUp">
            <div className="inline-block bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <FaLeaf className="inline-block mr-2 text-green-400" />
              <span className="text-sm font-semibold">AgroFund BD</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              কৃষিতে বিনিয়োগ করুন,<br />
              <span className="text-green-400">ভবিষ্যৎ গড়ুন</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              আমরা কৃষক ও বিনিয়োগকারীদের মধ্যে সেতুবন্ধন তৈরি করি। টেকসই কৃষি উন্নয়নে আপনার বিনিয়োগ দেশের অর্থনীতিতে যোগ করছে নতুন মাত্রা।
            </p>
            <button
              onClick={() => navigate('/invest')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
            >
              <span>এখনই বিনিয়োগ করুন</span>
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition duration-300">
              <div className="inline-block bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full mb-4">
                <stat.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.number}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {teamValues.map((value, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:-translate-y-2 transition duration-300">
              <div className="inline-block bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full mb-6">
                <value.icon className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            কেন <span className="text-green-600">AgroFund BD</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            আমরা কীভাবে কাজ করি এবং কেন আমাদের প্ল্যাটফর্ম আপনার জন্য সেরা পছন্দ
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">কীভাবে কাজ করে?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              মাত্র কয়েকটি ধাপে শুরু করুন আপনার কৃষি বিনিয়োগ যাত্রা
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "০১", title: "অ্যাকাউন্ট খুলুন", desc: "বিনামূল্যে নিবন্ধন করুন", icon: FaUsers },
              { step: "০২", title: "বিনিয়োগ করুন", desc: "আপনার পছন্দের প্রকল্পে বিনিয়োগ করুন", icon: FaHandHoldingUsd },
              { step: "০৩", title: "উৎপাদন দেখুন", desc: "কৃষি কার্যক্রম মনিটর করুন", icon: FaChartLine },
              { step: "০৪", title: "মুনাফা পান", desc: "নিয়মিত রিটার্ন উপভোগ করুন", icon: FaLeaf }
            ].map((item, index) => (
              <div key={index} className="text-center text-white">
                <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <div className="inline-block bg-white/20 rounded-full p-3 mb-3">
                  <item.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            আমাদের যাত্রা
          </h2>
          <p className="text-lg text-gray-600">সফলতার গল্প</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                {milestone.year.slice(-2)}
              </div>
              <div className="mt-6">
                <milestone.icon className="text-3xl text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                <p className="text-gray-600 text-sm">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-gray-50 to-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              আমাদের দল
            </h2>
            <p className="text-lg text-gray-600">
              অভিজ্ঞ পেশাদারদের দল আপনার সেবায়
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "মোঃ মনিরুজ্জামান", role: "প্রতিষ্ঠাতা ও সিইও", img: "https://randomuser.me/api/portraits/men/1.jpg", expertise: "কৃষি অর্থনীতি" },
              { name: "সাদিয়া ইসলাম", role: "অপারেশনস হেড", img: "https://randomuser.me/api/portraits/women/2.jpg", expertise: "প্রকল্প ব্যবস্থাপনা" },
              { name: "রাফিউল ইসলাম", role: "প্রযুক্তি পরিচালক", img: "https://randomuser.me/api/portraits/men/3.jpg", expertise: "ব্লকচেইন প্রযুক্তি" }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300">
                <img src={member.img} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="text-green-600 font-semibold mt-1">{member.role}</p>
                  <p className="text-gray-500 text-sm mt-2">{member.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            আজই শুরু করুন আপনার বিনিয়োগ
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            কৃষি খাতে বিনিয়োগ করে তৈরি করুন একটি স্থিতিশীল ভবিষ্যৎ। আমাদের সাথে যোগ দিন আজই।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105"
            >
              ফ্রি অ্যাকাউন্ট খুলুন
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
            >
              যোগাযোগ করুন
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaLeaf className="text-green-400 text-2xl" />
            <span className="text-xl font-bold">AgroFund BD</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 AgroFund BD | টেকসই কৃষি, সমৃদ্ধ ভবিষ্যৎ
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;