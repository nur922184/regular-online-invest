// pages/admin/ManageProducts.jsx
import React, { useState, useEffect } from 'react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaSave,
    FaSpinner,
    FaImage,
    FaTag,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaPercent,
    FaTractor,
    FaSearch,
    FaEye,
    FaHeart,
    FaShare,
    FaBookmark
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        dailyIncome: '',
        duration: '',
        totalIncome: '',
        image: '',
        description: ''
    });

    // API বেস URL
    const API_URL = 'https://backend-project-invest.vercel.app/api/products';

    // সব পণ্য লোড করুন
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/all`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setProducts(data);
            } else if (data && Array.isArray(data.products)) {
                setProducts(data.products);
            } else if (data && Array.isArray(data.data)) {
                setProducts(data.data);
            } else {
                console.error('Invalid data format:', data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            Swal.fire({
                icon: 'error',
                title: 'ওহ! কোনো সমস্যা হয়েছে',
                text: 'পণ্য লোড করতে ব্যর্থ হয়েছে',
                confirmButtonColor: '#ef4444'
            });
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ফিল্টার করা পণ্য
    const getFilteredProducts = () => {
        if (!Array.isArray(products)) return [];
        if (!searchTerm) return products;

        return products.filter(product =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredProducts = getFilteredProducts();

    // নতুন আইডি জেনারেট করুন
    const generateNewId = () => {
        if (!Array.isArray(products) || products.length === 0) return 1;
        const maxId = Math.max(...products.map(p => p.id));
        return maxId + 1;
    };

    // ফর্ম হ্যান্ডলার
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // পণ্য এড করুন
    const handleAddProduct = async () => {
        if (!formData.name || !formData.price || !formData.dailyIncome || !formData.duration || !formData.totalIncome) {
            Swal.fire({
                icon: 'warning',
                title: 'ফিল্ড পূরণ করুন',
                text: 'সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        setFormLoading(true);

        try {
            const newProduct = {
                id: generateNewId(),
                name: formData.name,
                price: parseFloat(formData.price),
                dailyIncome: parseFloat(formData.dailyIncome),
                duration: formData.duration,
                totalIncome: parseFloat(formData.totalIncome),
                image: formData.image || 'https://i.ibb.co.com/JhvzjC8/1.jpg',
                description: formData.description || 'কোন বিবরণ নেই'
            };

            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct)
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'সফল!',
                    text: 'পণ্য সফলভাবে যোগ করা হয়েছে',
                    confirmButtonColor: '#10b981',
                    timer: 2000
                });

                resetForm();
                fetchProducts();
            } else {
                throw new Error(data.message || 'পণ্য যোগ করতে ব্যর্থ হয়েছে');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            Swal.fire({
                icon: 'error',
                title: 'ব্যর্থ!',
                text: error.message,
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setFormLoading(false);
        }
    };

    // পণ্য আপডেট করুন
    const handleUpdateProduct = async () => {
        setFormLoading(true);

        try {
            const updatedProduct = {
                ...selectedProduct,
                name: formData.name,
                price: parseFloat(formData.price),
                dailyIncome: parseFloat(formData.dailyIncome),
                duration: formData.duration,
                totalIncome: parseFloat(formData.totalIncome),
                image: formData.image,
                description: formData.description
            };

            const response = await fetch(`${API_URL}/update/${selectedProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct)
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'আপডেট সফল!',
                    text: 'পণ্য সফলভাবে আপডেট করা হয়েছে',
                    confirmButtonColor: '#10b981',
                    timer: 2000
                });

                resetForm();
                fetchProducts();
            } else {
                throw new Error(data.message || 'আপডেট করতে ব্যর্থ হয়েছে');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire({
                icon: 'error',
                title: 'ব্যর্থ!',
                text: error.message,
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setFormLoading(false);
        }
    };

    // পণ্য ডিলিট করুন
    const handleDeleteProduct = (product) => {
        Swal.fire({
            title: 'পণ্য ডিলিট করবেন?',
            html: `<p><strong>${product.name}</strong> ডিলিট করতে চান?</p><p class="text-red-500 text-sm">⚠️ এই কাজটি অপরিবর্তনীয়!</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
            cancelButtonText: 'না, বাতিল করুন',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_URL}/delete/${product._id}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'ডিলিট সফল!',
                            text: 'পণ্য সফলভাবে ডিলিট করা হয়েছে',
                            confirmButtonColor: '#10b981',
                            timer: 2000
                        });
                        fetchProducts();
                    } else {
                        throw new Error('ডিলিট করতে ব্যর্থ হয়েছে');
                    }
                } catch (error) {
                    console.error('Error deleting product:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'ব্যর্থ!',
                        text: error.message,
                        confirmButtonColor: '#ef4444'
                    });
                }
            }
        });
    };

    // এডিট করার জন্য পণ্য সিলেক্ট করুন
    const openEditModal = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            dailyIncome: product.dailyIncome.toString(),
            duration: product.duration,
            totalIncome: product.totalIncome.toString(),
            image: product.image || '',
            description: product.description || ''
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    // এড মোড খুলুন
    const openAddModal = () => {
        resetForm();
        setIsEditing(false);
        setIsModalOpen(true);
    };

    // ফর্ম রিসেট করুন
    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            dailyIncome: '',
            duration: '',
            totalIncome: '',
            image: '',
            description: ''
        });
        setSelectedProduct(null);
        setIsModalOpen(false);
        setIsEditing(false);
    };

    // ফর্ম সাবমিট
    const handleSubmit = () => {
        if (isEditing) {
            handleUpdateProduct();
        } else {
            handleAddProduct();
        }
    };

    // নম্বর ফরম্যাট
    const formatNumber = (num) => {
        if (!num && num !== 0) return '০';
        return new Intl.NumberFormat('bn-BD').format(num);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-3" />
                    <p className="text-gray-500">পণ্য লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* হেডার সেকশন */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaTractor className="text-green-600" />
                                পণ্য ব্যবস্থাপনা
                            </h1>
                            <p className="text-xs text-gray-500 mt-1">মোট {Array.isArray(products) ? products.length : 0}টি পণ্য</p>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition shadow-md"
                        >
                            <FaPlus size={14} />
                            নতুন পণ্য
                        </button>
                    </div>

                    {/* সার্চ বার */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="পণ্য খুঁজুন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* 📦 পণ্য লিস্ট - মোবাইল কার্ড */}
            <div className="px-3 py-4 space-y-3">
                {filteredProducts.map((product) => (
                    <div
                        key={product._id || product.id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition flex p-2 gap-3 items-center"
                    >

                        {/* 🖼️ Left Image */}
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden relative">
                            <img
                                src={product.image || "https://i.ibb.co.com/JhvzjC8/1.jpg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://i.ibb.co.com/JhvzjC8/1.jpg";
                                }}
                            />

                            {/* Price badge */}
                            <div className="absolute top-1 right-1 bg-green-600 text-white text-[10px] px-2 py-[2px] rounded-full">
                                ৳{formatNumber(product.price)}
                            </div>
                        </div>

                        {/* 📄 Right Content */}
                        <div className="flex-1 min-w-0">

                            {/* Title */}
                            <h2 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                {product.name}
                            </h2>

                            {/* Description */}
                            <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                                {product.description || "কোন বিবরণ নেই"}
                            </p>

                            {/* Info Row */}
                            <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                                <span>💰 ৳{formatNumber(product.dailyIncome)}/দিন</span>
                                <span>⏳ {product.duration}</span>
                            </div>

                            <div className="text-[11px] text-purple-600 font-semibold mb-2">
                                মোট: ৳{formatNumber(product.totalIncome)}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(product)}
                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                >
                                    <FaEdit size={12} />
                                    এডিট
                                </button>

                                <button
                                    onClick={() => handleDeleteProduct(product)}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                >
                                    <FaTrash size={12} />
                                    ডিলিট
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* ❌ Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FaTractor className="text-2xl text-gray-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-500">
                            কোন পণ্য পাওয়া যায়নি
                        </h3>
                        <p className="text-xs text-gray-400">
                            নতুন পণ্য যোগ করুন
                        </p>
                    </div>
                )}
            </div>

            {/* 🟢 MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-3">

                    {/* Modal Box */}
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn">

                        {/* Header */}
                        <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                {isEditing ? (
                                    <FaEdit className="text-blue-500" />
                                ) : (
                                    <FaPlus className="text-green-500" />
                                )}
                                {isEditing ? "পণ্য আপডেট করুন" : "নতুন পণ্য যোগ করুন"}
                            </h2>

                            <button
                                onClick={resetForm}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        {/* Body (Scrollable) */}
                        <div className="max-h-[70vh] overflow-y-auto px-4 py-3">

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                                className="space-y-3"
                            >

                                {/* Name */}
                                <div>
                                    <label className="text-xs text-gray-600">পণ্যের নাম *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-200 outline-none"
                                        required
                                    />
                                </div>

                                {/* Price + Daily */}
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="মূল্য ৳"
                                        className="px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:border-green-500"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="dailyIncome"
                                        value={formData.dailyIncome}
                                        onChange={handleInputChange}
                                        placeholder="দৈনিক আয়"
                                        className="px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:border-green-500"
                                        required
                                    />
                                </div>

                                {/* Duration + Total */}
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="মেয়াদ"
                                        className="px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:border-green-500"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="totalIncome"
                                        value={formData.totalIncome}
                                        onChange={handleInputChange}
                                        placeholder="মোট আয়"
                                        className="px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:border-green-500"
                                        required
                                    />
                                </div>

                                {/* Image */}
                                <div>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        placeholder="ইমেজ URL"
                                        className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:border-green-500"
                                    />

                                    {formData.image && (
                                        <img
                                            src={formData.image}
                                            alt="preview"
                                            className="mt-2 w-16 h-16 object-cover rounded-lg border"
                                        />
                                    )}
                                </div>

                                {/* Description */}
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="2"
                                    placeholder="বিবরণ"
                                    className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:border-green-500"
                                />

                                {/* Buttons (Sticky bottom safe) */}
                                <div className="sticky bottom-0 bg-white pt-2 pb-3">

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 bg-gray-100 py-2 rounded-lg text-sm"
                                        >
                                            বাতিল
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={formLoading}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                                        >
                                            {formLoading ? (
                                                <>
                                                    <FaSpinner className="animate-spin" />
                                                    লোডিং...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave size={13} />
                                                    {isEditing ? "আপডেট" : "সেভ"}
                                                </>
                                            )}
                                        </button>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>

                    {/* Animation */}
                    <style>{`
      @keyframes fadeIn {
        from {opacity:0; transform: scale(0.95);}
        to {opacity:1; transform: scale(1);}
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
    `}</style>
                </div>
            )}

            {/* অ্যানিমেশন স্টাইল */}
            <style >{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};

export default ManageProducts;