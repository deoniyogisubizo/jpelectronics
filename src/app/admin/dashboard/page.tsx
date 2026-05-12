'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package, DollarSign, AlertTriangle, TrendingUp,
  Plus, Minus, Edit, Trash2, Video, Phone,
  User, FolderPlus, FolderMinus, BarChart3,
  Activity, History, Truck, Settings, Camera,
  Upload, Link as LinkIcon, ArrowLeft, Eye, Image
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Product {
  _id: string;
  name: { en: string; rw: string };
  price: number;
  stockQuantity: number;
  featured: boolean;
  hotDeal: boolean;
  category: string;
  brand: string;
  createdAt: Date;
  [key: string]: any;
}

interface Category {
  _id: string;
  name: { en: string; rw: string };
  slug: string;
  productCount: number;
  [key: string]: any;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemHistory, setSystemHistory] = useState<any[]>([]);

  // Form states
  const [newProduct, setNewProduct] = useState({
    nameEn: '', nameRw: '', price: '', stockQuantity: '', category: '', brand: '', images: [] as string[]
  });
  const [imageOption, setImageOption] = useState<'url' | 'camera' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newCategory, setNewCategory] = useState({
    nameEn: '', nameRw: '', slug: '', image: ''
  });

  // Modal states
  const [viewProductModal, setViewProductModal] = useState(false);
  const [changeImageModal, setChangeImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState({
    nameEn: '', nameRw: '', descriptionEn: '', descriptionRw: '', shortDescriptionEn: '', shortDescriptionRw: '',
    price: '', stockQuantity: '', category: '', brand: '', images: [] as string[]
  });
  const [heroVideo, setHeroVideo] = useState('/video/videoo.mp4');
  const [contactNumber, setContactNumber] = useState('+250 790 336 683');

  useEffect(() => {
    const isAdmin = localStorage.getItem('jptech-admin');
    if (!isAdmin) {
      router.push('/admin');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      // Load system history from localStorage
      const history = JSON.parse(localStorage.getItem('jptech-system-history') || '[]');
      setSystemHistory(history);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const logAction = (action: string, details: any) => {
    const newEntry = {
      id: Date.now(),
      action,
      details,
      timestamp: new Date().toISOString(),
      admin: 'Admin'
    };
    const updatedHistory = [newEntry, ...systemHistory].slice(0, 100); // Keep last 100 actions
    setSystemHistory(updatedHistory);
    localStorage.setItem('jptech-system-history', JSON.stringify(updatedHistory));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: { en: newProduct.nameEn, rw: newProduct.nameRw },
          description: { en: 'New product description', rw: 'Umwirondoro mushya' },
          shortDescription: { en: 'Short description', rw: 'Umwirondoro muto' },
          price: parseFloat(newProduct.price),
          images: newProduct.images,
          category: newProduct.category,
          categorySlug: newProduct.category.toLowerCase().replace(/\s+/g, '-'),
          brand: newProduct.brand,
          inStock: true,
          stockQuantity: parseInt(newProduct.stockQuantity),
          tags: [],
          featured: false,
          hotDeal: false,
        })
      });

      if (response.ok) {
        logAction('ADD_PRODUCT', { name: newProduct.nameEn, category: newProduct.category, images: newProduct.images.length });
        setNewProduct({ nameEn: '', nameRw: '', price: '', stockQuantity: '', category: '', brand: '', images: [] });
        setImageUrl('');
        setSelectedFile(null);
        fetchData();
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        logAction('DELETE_PRODUCT', { id: productId, name: productName });
        fetchData();
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditProduct({
      nameEn: product.name.en,
      nameRw: product.name.rw,
      descriptionEn: product.description?.en || '',
      descriptionRw: product.description?.rw || '',
      shortDescriptionEn: product.shortDescription?.en || '',
      shortDescriptionRw: product.shortDescription?.rw || '',
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      category: product.category,
      brand: product.brand,
      images: product.images || []
    });
    setViewProductModal(true);
  };

  const handleChangeImage = (product: Product) => {
    setSelectedProduct(product);
    setEditProduct(prev => ({ ...prev, images: product.images || [] }));
    setChangeImageModal(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/products/${selectedProduct._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: { en: editProduct.nameEn, rw: editProduct.nameRw },
          description: { en: editProduct.descriptionEn, rw: editProduct.descriptionRw },
          shortDescription: { en: editProduct.shortDescriptionEn, rw: editProduct.shortDescriptionRw },
          price: parseFloat(editProduct.price),
          stockQuantity: parseInt(editProduct.stockQuantity),
          category: editProduct.category,
          brand: editProduct.brand,
          images: editProduct.images,
        })
      });

      if (response.ok) {
        logAction('UPDATE_PRODUCT', { id: selectedProduct._id, name: editProduct.nameEn });
        setViewProductModal(false);
        fetchData();
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product');
    }
  };

  const handleUpdateProductImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/products/${selectedProduct._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: editProduct.images })
      });

      if (response.ok) {
        logAction('UPDATE_PRODUCT_IMAGES', { id: selectedProduct._id, name: selectedProduct.name.en, imageCount: editProduct.images.length });
        setChangeImageModal(false);
        fetchData();
        alert('Product images updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update product images:', error);
      alert('Failed to update product images');
    }
  };

  const handleUpdatePrice = async (productId: string, newPrice: number, productName: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice })
      });

      if (response.ok) {
        logAction('UPDATE_PRICE', { id: productId, name: productName, newPrice });
        fetchData();
        alert('Price updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update price:', error);
      alert('Failed to update price');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: { en: newCategory.nameEn, rw: newCategory.nameRw },
          slug: newCategory.slug,
          image: newCategory.image,
          featured: false,
          productCount: 0
        })
      });

      if (response.ok) {
        logAction('ADD_CATEGORY', { name: newCategory.nameEn, slug: newCategory.slug });
        setNewCategory({ nameEn: '', nameRw: '', slug: '', image: '' });
        fetchData();
        alert('Category added successfully!');
      }
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category');
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        logAction('DELETE_CATEGORY', { id: categoryId, name: categoryName });
        fetchData();
        alert('Category deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  const handleUpdateHeroVideo = () => {
    logAction('UPDATE_HERO_VIDEO', { newVideo: heroVideo });
    localStorage.setItem('jptech-hero-video', heroVideo);
    alert('Hero video updated! (Note: This is a demo - actual video change requires file upload)');
  };

  const handleUpdateContactNumber = () => {
    logAction('UPDATE_CONTACT_NUMBER', { newNumber: contactNumber });
    localStorage.setItem('jptech-contact-number', contactNumber);
    alert('Contact number updated successfully!');
  };

  const today = new Date();
  const todayOrders = Math.floor(Math.random() * 25) + 10;
  const todayRevenue = todayOrders * 150000;
  const lowStock = products.filter(p => p.stockQuantity < 10).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      {/* Mobile Header */}
      <div className="bg-black text-white p-4 md:hidden flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className="border-t border-b border-l-0 border-r-0 ml-4 mr-1 bg-transparent text-white p-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-bold text-gold">JP Tech Admin</h1>
        </div>
        <button
          onClick={() => setActiveTab(activeTab === 'menu' ? 'overview' : 'menu')}
          className="text-white text-base p-2"
        >
          {activeTab === 'menu' ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {activeTab === 'menu' && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-75 z-50" onClick={() => setActiveTab('overview')}>
          <div className="bg-beige w-full max-w-xs h-full p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4 text-black">Navigation</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className="w-full text-left px-3 py-2 bg-gold text-black font-semibold rounded text-xs"
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className="w-full text-left px-3 py-2 hover:bg-black hover:bg-opacity-10 rounded text-xs"
              >
                📦 Products
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className="w-full text-left px-3 py-2 hover:bg-black hover:bg-opacity-10 rounded text-xs"
              >
                📂 Categories
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="w-full text-left px-3 py-2 hover:bg-black hover:bg-opacity-10 rounded text-xs"
              >
                🚚 Orders
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className="w-full text-left px-3 py-2 hover:bg-black hover:bg-opacity-10 rounded text-xs"
              >
                📈 Analytics
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className="w-full text-left px-3 py-2 hover:bg-black hover:bg-opacity-10 rounded text-xs"
              >
                ⚙️ System
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full text-left px-3 py-2 hover:bg-black hover:bg-opacity-10 rounded text-xs"
              >
                👤 Profile
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className="w-full text-left px-3 py-2 hover:bg-black hover:bg-opacity-10 rounded text-xs"
              >
                📝 History
              </button>
              <div className="border-t pt-2 mt-4">
                <button
                  onClick={() => { localStorage.removeItem('jptech-admin'); router.push('/admin'); }}
                  className="w-full text-left px-3 py-2 hover:bg-red-100 text-red-600 rounded text-xs"
                >
                  🚪 Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 bg-black text-white min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className="border-t border-b border-l-0 border-r-0 ml-4 mr-1 bg-transparent text-white p-1 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold text-gold">JP Tech Admin</h2>
          </div>
        </div>
        <nav className="mt-6 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${activeTab === 'overview' ? 'bg-gold text-black font-semibold' : 'hover:bg-gray-700 text-white'}`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${activeTab === 'products' ? 'bg-gold text-black font-semibold' : 'hover:bg-gray-700 text-white'}`}
          >
            📦 Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${activeTab === 'categories' ? 'bg-gold text-black font-semibold' : 'hover:bg-gray-700 text-white'}`}
          >
            📂 Categories
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${activeTab === 'orders' ? 'bg-gold text-black font-semibold' : 'hover:bg-gray-700 text-white'}`}
          >
            🚚 Orders
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${activeTab === 'analytics' ? 'bg-gold text-black font-semibold' : 'hover:bg-gray-700 text-white'}`}
          >
            📈 Analytics
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${activeTab === 'system' ? 'bg-gold text-black font-semibold' : 'hover:bg-gray-700 text-white'}`}
          >
            ⚙️ System
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${activeTab === 'profile' ? 'bg-gold text-black font-semibold' : 'hover:bg-gray-700 text-white'}`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${activeTab === 'history' ? 'bg-gold text-black font-semibold' : 'hover:bg-gray-700 text-white'}`}
          >
            📝 History
          </button>
          <div className="border-t border-gray-600 pt-4 mt-6">
            <button
              onClick={() => { localStorage.removeItem('jptech-admin'); router.push('/admin'); }}
              className="w-full text-left px-6 py-3 text-sm font-medium hover:bg-red-900 text-red-300"
            >
              🚪 Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-beige min-h-screen">
        {activeTab === 'overview' && (
          <>
            <div className="mb-6 md:mb-8">
              <h1 className="text-xl md:text-3xl font-bold text-black">Admin Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600">Welcome back, Admin</p>
            </div>

            {/* Quick Actions - Desktop Enhanced */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              <button
                onClick={() => setActiveTab('products')}
                className="bg-black text-gold p-4 md:p-6 rounded-lg text-center hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
              >
                <Package className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-2" />
                <span className="text-sm md:text-base font-semibold">Products</span>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className="bg-black text-gold p-4 md:p-6 rounded-lg text-center hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
              >
                <FolderPlus className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-2" />
                <span className="text-sm md:text-base font-semibold">Categories</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="bg-black text-gold p-4 md:p-6 rounded-lg text-center hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
              >
                <Truck className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-2" />
                <span className="text-sm md:text-base font-semibold">Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className="bg-black text-gold p-4 md:p-6 rounded-lg text-center hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
              >
                <BarChart3 className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-2" />
                <span className="text-sm md:text-base font-semibold">Analytics</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-3 md:p-4 bg-gold rounded-lg">
                    <Package className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base text-gray-600 font-medium">Products</p>
                    <p className="text-2xl md:text-3xl font-bold text-black">{products.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-3 md:p-4 bg-black rounded-lg">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base text-gray-600 font-medium">Orders</p>
                    <p className="text-2xl md:text-3xl font-bold text-black">{todayOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-3 md:p-4 bg-gold rounded-lg">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base text-gray-600 font-medium">Revenue</p>
                    <p className="text-2xl md:text-3xl font-bold text-black">{(todayRevenue / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-3 md:p-4 bg-black rounded-lg">
                    <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base text-gray-600 font-medium">Low Stock</p>
                    <p className="text-2xl md:text-3xl font-bold text-red-600">{lowStock}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-black">Product Management</h1>

            {/* Add Product Form */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-base md:text-lg font-bold mb-4 text-black">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name (English)"
                  value={newProduct.nameEn}
                  onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Name (Kinyarwanda)"
                  value={newProduct.nameRw}
                  onChange={(e) => setNewProduct({ ...newProduct, nameRw: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Brand"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />

                {/* Image Upload Section */}
                <div className="md:col-span-2 border border-gray-200 rounded p-4 md:p-6 bg-gray-50">
                  <h3 className="text-sm md:text-base font-semibold text-black mb-3">Product Images</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setImageOption('url')}
                      className={`px-4 py-2 rounded text-sm md:text-base font-medium flex items-center gap-2 ${imageOption === 'url' ? 'bg-black text-gold' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      <LinkIcon className="w-4 h-4" />
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageOption('camera')}
                      className={`px-4 py-2 rounded text-sm md:text-base font-medium flex items-center gap-2 ${imageOption === 'camera' ? 'bg-black text-gold' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      <Camera className="w-4 h-4" />
                      Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageOption('upload')}
                      className={`px-4 py-2 rounded text-sm md:text-base font-medium flex items-center gap-2 ${imageOption === 'upload' ? 'bg-black text-gold' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>

                  {imageOption === 'url' && (
                    <div className="space-y-3">
                      <input
                        type="url"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imageUrl.trim()) {
                            setNewProduct({ ...newProduct, images: [...newProduct.images, imageUrl.trim()] });
                            setImageUrl('');
                          }
                        }}
                        className="bg-gold text-black px-4 py-2 rounded text-sm md:text-base font-semibold hover:bg-yellow-600 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add URL
                      </button>
                    </div>
                  )}

                  {imageOption === 'camera' && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            // Convert to data URL for preview
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const dataUrl = e.target?.result as string;
                              setNewProduct({ ...newProduct, images: [...newProduct.images, dataUrl] });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-sm md:text-base p-2"
                      />
                      <p className="text-sm md:text-base text-gray-600">Take a photo using your camera</p>
                    </div>
                  )}

                  {imageOption === 'upload' && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const dataUrl = e.target?.result as string;
                              setNewProduct({ ...newProduct, images: [...newProduct.images, dataUrl] });
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                        className="w-full text-sm md:text-base p-2"
                      />
                      <p className="text-sm md:text-base text-gray-600">Select multiple images from your device</p>
                    </div>
                  )}

                  {/* Image Preview */}
                  {newProduct.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm md:text-base font-semibold text-black mb-3">Selected Images ({newProduct.images.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {newProduct.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-20 md:h-24 object-cover rounded border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = newProduct.images.filter((_, i) => i !== index);
                                setNewProduct({ ...newProduct, images: newImages });
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 md:w-7 md:h-7 text-sm md:text-base flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="bg-black text-gold px-4 py-3 rounded text-sm md:text-base font-semibold hover:bg-gray-800 md:col-span-2 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </form>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-base md:text-lg font-bold text-black">Products ({products.length})</h2>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                {products.map((product) => (
                  <div key={product._id} className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-black">{product.name.en}</h3>
                        <p className="text-sm text-gray-600">{product.category} • {product.brand}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product._id, product.name.en)}
                        className="text-red-500 hover:text-red-700 ml-3 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Price:</span>
                        <input
                          type="number"
                          defaultValue={product.price}
                          onBlur={(e) => handleUpdatePrice(product._id, parseFloat(e.target.value), product.name.en)}
                          className="border border-gray-300 p-2 rounded text-sm w-20"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded"
                          title="View/Edit Product"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleChangeImage(product)}
                          className="text-green-500 hover:text-green-700 p-2 hover:bg-green-50 rounded"
                          title="Change Product Image"
                        >
                          <Image className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id, product.name.en)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-base font-medium text-black">{product.name.en}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            defaultValue={product.price}
                            onBlur={(e) => handleUpdatePrice(product._id, parseFloat(e.target.value), product.name.en)}
                            className="border border-gray-300 p-2 rounded text-sm w-24"
                          />
                        </td>
                        <td className="px-6 py-4 text-base">{product.stockQuantity}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewProduct(product)}
                              className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="View/Edit Product"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleChangeImage(product)}
                              className="text-green-500 hover:text-green-700 p-2 hover:bg-green-50 rounded transition-colors"
                              title="Change Product Image"
                            >
                              <Image className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id, product.name.en)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-black">Category Management</h1>

            {/* Add Category Form */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-base md:text-lg font-bold mb-4 text-black">Add New Category</h2>
              <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name (English)"
                  value={newCategory.nameEn}
                  onChange={(e) => setNewCategory({ ...newCategory, nameEn: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Name (Kinyarwanda)"
                  value={newCategory.nameRw}
                  onChange={(e) => setNewCategory({ ...newCategory, nameRw: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Slug"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newCategory.image}
                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                  className="border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  required
                />
                <button type="submit" className="bg-black text-gold px-4 py-3 rounded text-sm md:text-base font-semibold hover:bg-gray-800 md:col-span-2 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </form>
            </div>

            {/* Category List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-base md:text-lg font-bold text-black">Categories ({categories.length})</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {categories.map((category) => (
                    <div key={category._id} className="border border-gray-200 rounded-lg p-4 md:p-6 flex justify-between items-center hover:shadow-md transition-shadow">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-black">{category.name.en}</h3>
                        <p className="text-sm md:text-base text-gray-600">{category.productCount} products</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category._id, category.name.en)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-black">System Settings</h1>

            {/* Hero Video Settings */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-base md:text-lg font-bold mb-4 flex items-center text-black">
                <Video className="w-5 h-5 mr-3 text-gold" />
                Hero Video
              </h2>
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <input
                  type="text"
                  value={heroVideo}
                  onChange={(e) => setHeroVideo(e.target.value)}
                  className="flex-1 border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                />
                <button
                  onClick={handleUpdateHeroVideo}
                  className="bg-black text-gold px-4 py-3 rounded text-sm md:text-base font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Update Video
                </button>
              </div>
            </div>

            {/* Contact Number Settings */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-base md:text-lg font-bold mb-4 flex items-center text-black">
                <Phone className="w-5 h-5 mr-3 text-gold" />
                Contact Number
              </h2>
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="flex-1 border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                />
                <button
                  onClick={handleUpdateContactNumber}
                  className="bg-black text-gold px-4 py-3 rounded text-sm md:text-base font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Update Number
                </button>
              </div>
            </div>

            {/* Contact Number Settings */}
            <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <h2 className="text-sm md:text-base font-bold mb-3 flex items-center text-black">
                <Phone className="w-4 h-4 mr-2 text-gold" />
                Contact Number
              </h2>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="flex-1 border border-gray-300 p-2 rounded text-xs"
                  placeholder="Contact Number"
                />
                <button
                  onClick={handleUpdateContactNumber}
                  className="bg-black text-gold px-3 py-2 rounded text-xs font-semibold hover:bg-gray-800 flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Update Number
                </button>
              </div>
            </div>

            {/* System Performance */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-base md:text-lg font-bold mb-4 flex items-center text-black">
                <Activity className="w-5 h-5 mr-3 text-gold" />
                Performance
              </h2>
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                <div className="text-center p-4 md:p-6 bg-beige rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-lg md:text-2xl font-bold text-black">{Math.floor(Math.random() * 20) + 80}%</div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">CPU</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-beige rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-lg md:text-2xl font-bold text-black">{(Math.random() * 500 + 200).toFixed(0)}MB</div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">Memory</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-beige rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-lg md:text-2xl font-bold text-black">{Math.floor(Math.random() * 100) + 50}ms</div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">Response</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-black">System History</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-base md:text-lg font-bold text-black">Recent Actions ({systemHistory.length})</h2>
              </div>
              <div className="max-h-80 md:max-h-96 overflow-y-auto">
                {systemHistory.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm md:text-base">No actions recorded yet</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {systemHistory.map((entry) => (
                      <div key={entry.id} className="p-4 md:p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm md:text-base font-medium text-black">{entry.action.replace(/_/g, ' ')}</div>
                            <div className="text-sm md:text-base text-gray-500 mt-1">
                              {entry.details && typeof entry.details === 'object'
                                ? Object.entries(entry.details).map(([key, value]) => `${key}: ${value}`).join(', ')
                                : 'Action performed'
                              }
                            </div>
                          </div>
                          <div className="text-sm md:text-base text-gray-400 ml-4 whitespace-nowrap">
                            {new Date(entry.timestamp).toLocaleDateString()}
                            <br />
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-black">Database Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-base md:text-lg font-bold mb-4 text-black">Product Analytics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Total Products:</span>
                    <span className="font-semibold text-black">{products.length}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Featured:</span>
                    <span className="font-semibold text-gold">{products.filter(p => p.featured).length}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Hot Deals:</span>
                    <span className="font-semibold text-red-600">{products.filter(p => p.hotDeal).length}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Low Stock:</span>
                    <span className="font-semibold text-red-500">{products.filter(p => p.stockQuantity < 10).length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-base md:text-lg font-bold mb-4 text-black">Category Analytics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Total Categories:</span>
                    <span className="font-semibold text-black">{categories.length}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Avg Products/Category:</span>
                    <span className="font-semibold text-black">
                      {categories.length > 0 ? Math.round(products.length / categories.length) : 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
                <h3 className="text-base md:text-lg font-bold mb-4 text-black">Revenue Analytics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Today's Revenue:</span>
                    <span className="font-semibold text-black">{(todayRevenue / 1000000).toFixed(1)}M RWF</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Today's Orders:</span>
                    <span className="font-semibold text-black">{todayOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Avg Order Value:</span>
                    <span className="font-semibold text-black">{Math.round(todayRevenue / todayOrders / 1000)}K RWF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-black">Profile Settings</h1>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-base md:text-lg font-bold mb-4 text-black">Admin Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="JP Tech Administrator"
                    className="w-full border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@jptech.rw"
                    className="w-full border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-600 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+250 790 336 683"
                    className="w-full border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-600 mb-2">Role</label>
                  <input
                    type="text"
                    defaultValue="Administrator"
                    className="w-full border border-gray-300 p-3 md:p-4 rounded text-sm md:text-base bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => {
                    logAction('UPDATE_PROFILE', { updated: 'Profile information updated' });
                    alert('Profile updated successfully!');
                  }}
                  className="bg-black text-gold px-4 py-3 rounded text-sm md:text-base font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-black">Order Tracking</h1>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-base md:text-lg font-bold mb-4 text-black">Recent Orders</h2>
              <div className="text-center text-gray-500 py-8 md:py-12 text-sm md:text-base">
                Order tracking functionality is under development.
                <br />
                This would display order status, tracking numbers, and customer information.
              </div>
            </div>
          </div>
        )}

        {/* Product View/Edit Modal */}
        {viewProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-black">Edit Product</h2>
                  <button
                    onClick={() => setViewProductModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                    <input
                      type="text"
                      value={editProduct.nameEn}
                      onChange={(e) => setEditProduct({ ...editProduct, nameEn: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Kinyarwanda)</label>
                    <input
                      type="text"
                      value={editProduct.nameRw}
                      onChange={(e) => setEditProduct({ ...editProduct, nameRw: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                    <textarea
                      value={editProduct.descriptionEn}
                      onChange={(e) => setEditProduct({ ...editProduct, descriptionEn: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Kinyarwanda)</label>
                    <textarea
                      value={editProduct.descriptionRw}
                      onChange={(e) => setEditProduct({ ...editProduct, descriptionRw: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={editProduct.stockQuantity}
                      onChange={(e) => setEditProduct({ ...editProduct, stockQuantity: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editProduct.category}
                      onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={editProduct.brand}
                      onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setViewProductModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-gold rounded hover:bg-gray-800"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Product Image Modal */}
        {changeImageModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-black">Change Product Images</h2>
                  <button
                    onClick={() => setChangeImageModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setImageOption('url')}
                      className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 ${imageOption === 'url' ? 'bg-black text-gold' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      <LinkIcon className="w-4 h-4" />
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageOption('camera')}
                      className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 ${imageOption === 'camera' ? 'bg-black text-gold' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      <Camera className="w-4 h-4" />
                      Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageOption('upload')}
                      className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 ${imageOption === 'upload' ? 'bg-black text-gold' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>

                  {imageOption === 'url' && (
                    <div className="space-y-3">
                      <input
                        type="url"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imageUrl.trim()) {
                            setEditProduct({ ...editProduct, images: [...editProduct.images, imageUrl.trim()] });
                            setImageUrl('');
                          }
                        }}
                        className="bg-gold text-black px-4 py-2 rounded font-semibold hover:bg-yellow-600 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add URL
                      </button>
                    </div>
                  )}

                  {imageOption === 'camera' && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const dataUrl = e.target?.result as string;
                              setEditProduct({ ...editProduct, images: [...editProduct.images, dataUrl] });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full p-2"
                      />
                      <p className="text-sm text-gray-600">Take a photo using your camera</p>
                    </div>
                  )}

                  {imageOption === 'upload' && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const dataUrl = e.target?.result as string;
                              setEditProduct({ ...editProduct, images: [...editProduct.images, dataUrl] });
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                        className="w-full p-2"
                      />
                      <p className="text-sm text-gray-600">Select multiple images from your device</p>
                    </div>
                  )}

                  {/* Image Preview */}
                  {editProduct.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-black mb-3">Images ({editProduct.images.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {editProduct.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-20 object-cover rounded border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = editProduct.images.filter((_, i) => i !== index);
                                setEditProduct({ ...editProduct, images: newImages });
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setChangeImageModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateProductImages}
                      className="px-4 py-2 bg-black text-gold rounded hover:bg-gray-800"
                    >
                      Update Images
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}