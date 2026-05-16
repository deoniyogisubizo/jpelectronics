'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import RelatedProductCard from '@/components/RelatedProductCard';
import { Minus, Plus, Star, Truck, Shield, MessageCircle, MessageSquare } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addItem, setIsOpen } = useCart();
  const { language } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch product
      const productRes = await fetch(`/api/products/${id}`);
      const productData = await productRes.json();
      setProduct(productData);

      // Fetch categories
      const categoriesRes = await fetch('/api/categories');
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);

      // Fetch related products if product has category
      if (productData && productData.category) {
        const relatedRes = await fetch('/api/products');
        const relatedData = await relatedRes.json();
        const filteredRelated = relatedData.filter((p: Product) => p.category === productData.category && p._id !== productData._id);
        setRelatedProducts(filteredRelated);
      }

      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-beige py-12 text-center">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-beige py-12 text-center">Product not found</div>;

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) {
      return '0 RWF';
    }
    return `${price.toLocaleString()} RWF`;
  };

  const handleAddToCart = () => {
    addItem(product._id, quantity);
    setIsOpen(true);
  };

  const handleWhatsAppContact = () => {
    const productName = product.name?.[language] || product.name?.en || 'Product';
    const productImage = product.images && product.images.length > 0 ? product.images[0] : '';
    const productPrice = formatPrice(product.price);
    const productBrand = product.brand;
    const productDescription = product.shortDescription?.[language] || product.shortDescription?.en ||
                              product.description?.[language] || product.description?.en || '';

    const message = encodeURIComponent(
      `🛍️ *Product Inquiry*\n\n` +
      `📦 *${productName}*\n` +
      `🏷️ *Brand:* ${productBrand}\n` +
      `💰 *Price:* ${productPrice}\n` +
      `${productImage ? `🖼️ *Product Image:* ${productImage}\n\n` : ''}` +
      `📝 *Description:* ${productDescription.substring(0, 100)}${productDescription.length > 100 ? '...' : ''}\n\n` +
      `❓ *Questions:*\n` +
      `• Delivery options and timeframes\n` +
      `• Available discounts or promotions\n` +
      `• More detailed specifications\n` +
      `• Stock availability\n` +
      `• Warranty information\n\n` +
      `Please provide more details about this product! 🙏`
    );

    const phoneNumber = '+250788123456'; // Replace with actual WhatsApp business number
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-2 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          Home / {product.category} / {product.name?.[language] || product.name?.en || 'Product'}
        </nav>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Images */}
          <div>
           <div className="bg-white rounded-lg p-4 mb-4">
               <div className="aspect-square relative bg-beige-light">
                  <img
                    src={(product.images && product.images[selectedImage]) || 'https://placehold.co/600x600?text=No+Image'}
                     alt={product.name?.[language] || product.name?.en || 'Product'}
                    className="w-full h-full object-contain"
                  />
                {product.hotDeal && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 font-bold rounded">
                    HOT DEAL
                  </span>
                )}
                {product.discount && product.discount > 0 && (
                  <span className="absolute top-4 right-4 bg-gold text-black px-3 py-1 font-bold rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>

             {/* Thumbnails */}
             <div className="flex gap-2">
                {((product.images && product.images.length > 0) ? product.images : ['https://placehold.co/600x600?text=No+Image']).map((img, idx) => (
                 <button
                   key={idx}
                   onClick={() => setSelectedImage(idx)}
                   className={`w-16 h-16 border-2 rounded ${
                     selectedImage === idx ? 'border-gold' : 'border-gray-200'
                   }`}
                 >
                   <img src={img} alt="" className="w-full h-full object-cover rounded" />
                 </button>
               ))}
             </div>
          </div>

          {/* Details */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow">
              {/* Brand */}
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.brand}
              </p>

               {/* Name */}
               <h1 className="text-2xl md:text-3xl font-bold mb-4">
                 {((product.name && product.name[language]) || (product.name && product.name.en) || 'Product Name')}
               </h1>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-gold text-gold' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-500 ml-2">(12 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gold">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

               {/* Short description */}
               <p className="text-gray-700 mb-6">
                 {((product.shortDescription && product.shortDescription[language]) || (product.shortDescription && product.shortDescription.en) || '')}
               </p>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`inline-block w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.inStock && <span className="text-gray-500">({product.stockQuantity} available)</span>}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-2 hover:bg-beige"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-2 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-2 py-2 hover:bg-beige"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gold text-black font-bold py-3 px-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => { addItem(product._id, quantity); window.location.href = '/checkout'; }}
                  disabled={!product.inStock}
                  className="flex-1 bg-black text-white font-bold py-3 px-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* WhatsApp Contact Button */}
              <button
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                Talk to Seller on WhatsApp - Get Delivery Info, Discounts & Details
              </button>

              {/* Trust features */}
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  Fast Delivery
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  1 Year Warranty
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Support
                </div>
              </div>
            </div>

              {/* Full description */}
              <div className="bg-white rounded-lg p-6 shadow mt-6">
                <h2 className="text-xl font-bold mb-4">Product Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {((product.description && product.description[language]) || (product.description && product.description.en) || '')}
                </p>
              </div>

              {/* WhatsApp Contact Button 2 */}
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  💬 Contact Seller - Ask About Delivery, Negotiate Price & Get Expert Advice
                </button>
                <p className="text-sm text-green-700 mt-2 text-center">
                  Get personalized assistance for this product
                </p>
              </div>

            {/* Specifications */}
            {product.specs && (
              <div className="bg-white rounded-lg p-6 shadow mt-6">
                <h2 className="text-xl font-bold mb-4">Specifications</h2>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 font-medium text-gray-600">{key}</td>
                        <td className="py-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* WhatsApp Contact Button 3 */}
            <div className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">Need More Information?</h3>
              <p className="text-green-100 mb-4">Get instant answers about delivery, pricing, and product details</p>
              <button
                onClick={handleWhatsAppContact}
                className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg mx-auto"
              >
                <MessageSquare className="w-5 h-5" />
                📱 WhatsApp Seller Now - Free Consultation
              </button>
            </div>
          </div>
        </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className={`grid gap-4 ${relatedProducts.length === 1 ? 'grid-cols-1' : relatedProducts.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                {relatedProducts.map((relatedProduct) => (
                  <RelatedProductCard
                    key={relatedProduct._id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Frequently Asked Questions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-semibold text-lg mb-3">What is your delivery time?</h3>
                <p className="text-gray-600">We deliver within 1-3 business days in Kigali and 3-7 days to other districts in Rwanda, depending on your location.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-semibold text-lg mb-3">Do you offer warranty?</h3>
                <p className="text-gray-600">Yes, all our products come with manufacturer warranty. Electronics typically have 1-year warranty, while other products may vary.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-semibold text-lg mb-3">Can I return products?</h3>
                <p className="text-gray-600">We accept returns within 7 days of delivery for unused products in original packaging. Contact us for return procedures.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-semibold text-lg mb-3">Do you accept payments on delivery?</h3>
                <p className="text-gray-600">Yes, we accept cash on delivery for orders within Kigali. Mobile money payments are available for all locations.</p>
              </div>
            </div>
          </div>

          {/* About the Store */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">About JPTech</h2>
            <div className="bg-white rounded-lg p-8 shadow">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Your Trusted Technology Partner in Rwanda</h3>
                  <p className="text-gray-600 mb-4">
                    JPTech has been Rwanda's leading technology retailer since 2020. We specialize in providing
                    high-quality electronics, computers, and tech accessories at competitive prices.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Our mission is to make technology accessible to everyone in Rwanda through reliable products,
                    exceptional customer service, and nationwide delivery.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">Nationwide Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                      <span className="text-sm">Expert Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gold rounded-full"></span>
                      <span className="text-sm">Quality Guarantee</span>
                    </div>
                  </div>
                </div>
                <div className="bg-beige rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Why Choose JPTech?</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Authentic products with warranty</li>
                    <li>✓ Fast and reliable delivery</li>
                    <li>✓ 24/7 customer support</li>
                    <li>✓ Competitive pricing</li>
                    <li>✓ Expert technical advice</li>
                    <li>✓ Easy returns and exchanges</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* All Product Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug}`}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-beige rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                    <img
                      src={category.image || 'https://placehold.co/64x64?text=Cat'}
                      alt={category.name?.en || 'Category'}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-sm">
                    {category.name?.[language] || category.name?.en || 'Category'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.productCount || 0} products
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Services Offered */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-black/10 rounded-full flex items-center justify-center">
                  <Truck className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Nationwide Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Fast and reliable delivery across all districts in Rwanda. Free delivery on orders over 100,000 RWF.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Technical Support</h3>
                <p className="text-gray-600 text-sm">
                  Expert technical assistance for all your technology needs. Setup, troubleshooting, and maintenance services.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">After-Sales Service</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive warranty coverage, repairs, and maintenance. We stand behind our products.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Product Consultation</h3>
                <p className="text-gray-600 text-sm">
                  Expert advice to help you choose the right technology products for your needs and budget.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Minus className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Easy Returns</h3>
                <p className="text-gray-600 text-sm">
                  Hassle-free returns within 7 days. Quick refunds and exchanges for your peace of mind.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Custom Orders</h3>
                <p className="text-gray-600 text-sm">
                  Special orders for products not in stock. We can source and deliver custom technology solutions.
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
