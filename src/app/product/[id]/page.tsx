'use client';

import { useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigation } from '@/context/NavigationContext';
import { Minus, Plus, Star, Truck, Shield, MessageCircle, Zap, Cpu, Battery, Headphones, Maximize, RefreshCw, Clock, Package, ChevronRight, MessageSquare } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const features = [
  { icon: Zap, label: 'Fast Delivery', desc: '1-3 days in Kigali' },
  { icon: Shield, label: '1 Year Warranty', desc: 'Full coverage' },
  { icon: RefreshCw, label: '7-Day Returns', desc: 'No questions asked' },
  { icon: MessageCircle, label: '24/7 Support', desc: 'WhatsApp ready' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addItem, setIsOpen } = useCart();
  const { language } = useLanguage();
  const { navigateTo } = useNavigation();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const { data: product, error } = useSWR<Product | null>(id ? `/api/products/${id}` : null, fetcher, { revalidateOnFocus: false, dedupingInterval: 30000 });
  const { data: categoriesData } = useSWR<Category[]>('/api/categories', fetcher, { revalidateOnFocus: false, dedupingInterval: 60000 });
  const { data: allProducts } = useSWR<Product[]>(product?.category ? '/api/products' : null, fetcher, { revalidateOnFocus: false });

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const relatedProducts = Array.isArray(allProducts)
    ? allProducts.filter((p: Product) => p.category === product?.category && p._id !== product?._id).slice(0, 4)
    : [];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  if (error || (!product && typeof product !== 'undefined')) return <div className="min-h-screen bg-beige py-12 text-center">Product not found</div>;
  if (!product) return (
    <div className="min-h-screen bg-beige py-12 text-center">
      <div className="flex justify-center items-center gap-2">
        <div className="w-6 h-6 border-2 border-gold border-t-black rounded-full animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return '0 RWF';
    return `${price.toLocaleString()} RWF`;
  };

  const handleAddToCart = () => {
    addItem(product._id, quantity);
    setIsOpen(true);
  };

  const handleWhatsApp = () => {
    const name = product.name?.[language] || product.name?.en || 'Product';
    const msg = encodeURIComponent(`Hi JP Tech, I'm interested in *${name}* (${formatPrice(product.price)}). Is it available?`);
    window.open(`https://wa.me/250790336683?text=${msg}`, '_blank');
  };

  const productName = product.name?.[language] || product.name?.en || 'Product';
  const images = (product.images && product.images.length > 0) ? product.images : ['https://placehold.co/600x600?text=No+Image'];
  const desc = product.description?.[language] || product.description?.en || '';
  const shortDesc = product.shortDescription?.[language] || product.shortDescription?.en || '';

  const descBullets = desc
    .split('\n')
    .filter(Boolean)
    .slice(0, 6)
    .map(s => s.replace(/^[-•*]\s*/, ''));

  const iconMap: Record<number, any> = { 0: Cpu, 1: Battery, 2: Headphones, 3: Maximize, 4: Zap, 5: Clock };

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Minimal breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-black/40 mb-6 font-mono">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/category/${product.categorySlug || product.category}`} className="hover:text-black truncate max-w-[120px]">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black/60 truncate max-w-[160px]">{productName}</span>
        </nav>

        {/* ─── MAIN SECTION: Description (Left) | Image (Right) ─── */}
        <div className="grid md:grid-cols-12 gap-6 lg:gap-10 mb-16">

          {/* LEFT COLUMN: Content — 7/12 width */}
          <div className="md:col-span-7 space-y-6 order-2 md:order-1">

            {/* Brand & Title */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[3px] text-black/40 mb-2">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-black leading-tight" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                {productName}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-gold text-gold' : 'text-black/10'}`} />
                ))}
              </div>
              <span className="text-xs text-black/40">(12 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-black/30 line-through" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="text-xs font-bold bg-black text-gold px-2 py-0.5 rounded">-{product.discount}%</span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs font-mono text-black/50">
                {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Feature cards from description */}
            {descBullets.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {descBullets.map((point, i) => {
                  const Icon = iconMap[i % 6] || Cpu;
                  return (
                    <div key={i} className="bg-white/80 backdrop-blur rounded-lg p-3 border border-black/5 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-black/60" />
                      </div>
                      <p className="text-xs text-black/70 leading-snug">{point}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity + Primary CTA */}
            <div className="flex items-stretch gap-3">
              <div className="flex items-center border border-black/10 rounded-lg bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 hover:bg-black/5 transition-colors">
                  <Minus className="w-4 h-4 text-black/60" />
                </button>
                <span className="px-3 py-3 font-semibold text-sm min-w-[2rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="px-3 py-3 hover:bg-black/5 transition-colors">
                  <Plus className="w-4 h-4 text-black/60" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-black text-gold font-bold text-sm py-3 px-6 rounded-lg hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={() => { addItem(product._id, quantity); navigateTo('/checkout'); }}
                disabled={!product.inStock}
                className="px-6 py-3 border border-black/10 rounded-lg text-sm font-semibold text-black hover:bg-black/5 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* WhatsApp — clean text link */}
            <button onClick={handleWhatsApp} className="flex items-center gap-2 text-xs text-black/40 hover:text-black transition-colors group">
              <MessageSquare className="w-4 h-4" />
              <span>Quick question? <span className="underline underline-offset-2 group-hover:text-gold">Chat on WhatsApp</span></span>
            </button>

            {/* Trust strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {features.map(({ icon: Icon, label, desc: d }) => (
                <div key={label} className="flex items-center gap-2 p-2.5 bg-white/60 backdrop-blur rounded-lg border border-black/5">
                  <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-black/50" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-black">{label}</p>
                    <p className="text-[9px] text-black/40">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Short description */}
            {shortDesc && (
              <p className="text-sm text-black/60 leading-relaxed">{shortDesc}</p>
            )}

          </div>

          {/* RIGHT COLUMN: Image — 5/12 width */}
          <div className="md:col-span-5 order-1 md:order-2">
            <div
              ref={imageRef}
              className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={images[selectedImage]}
                alt={productName}
                fill
                className="object-cover transition-transform duration-75"
                style={{
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              {product.hotDeal && (
                <span className="absolute top-3 left-3 bg-black text-gold text-[10px] font-bold px-2 py-1 rounded-full z-10">HOT</span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="absolute top-3 right-3 bg-gold text-black text-[10px] font-bold px-2 py-1 rounded-full z-10">-{product.discount}%</span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-black ring-1 ring-black/20' : 'border-black/10 hover:border-black/30'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── SPECIFICATIONS GRID ─── */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-16">
            <h2 className="text-sm font-mono uppercase tracking-[3px] text-black/30 mb-4">Technical Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="bg-white/70 backdrop-blur rounded-lg p-3.5 border border-black/5">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-black/30 mb-1">{key}</p>
                  <p className="text-sm font-medium text-black">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── RELATED PRODUCTS ─── */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-sm font-mono uppercase tracking-[3px] text-black/30 mb-4">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedProducts.map((rp) => {
                const rpName = rp.name?.[language] || rp.name?.en || '';
                return (
                  <Link key={rp._id} href={`/product/${rp._id}`} className="group block">
                    <div className="bg-white/70 backdrop-blur rounded-xl overflow-hidden border border-black/5 hover:border-black/20 transition-all hover:shadow-md">
                      <div className="relative aspect-square">
                        <Image
                          src={rp.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
                          alt={rpName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, 25vw"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="text-[10px] text-black/40 uppercase tracking-wider truncate">{rp.brand}</p>
                        <h3 className="text-xs font-semibold text-black leading-snug line-clamp-2 min-h-[2rem]">{rpName}</h3>
                        <p className="text-sm font-bold text-black mt-1" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                          {formatPrice(rp.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── FAQ ─── */}
        <div className="mb-16">
          <h2 className="text-sm font-mono uppercase tracking-[3px] text-black/30 mb-4">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { q: 'What is your delivery time?', a: 'We deliver within 1-3 business days in Kigali and 3-7 days to other districts in Rwanda.' },
              { q: 'Do you offer warranty?', a: 'Yes, all our products come with manufacturer warranty. Electronics typically have 1-year warranty.' },
              { q: 'Can I return products?', a: 'We accept returns within 7 days of delivery for unused products in original packaging.' },
              { q: 'Do you accept payments on delivery?', a: 'Yes, we accept cash on delivery for orders within Kigali. Mobile money payments are available for all locations.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white/70 backdrop-blur rounded-xl p-4 border border-black/5">
                <h3 className="text-sm font-semibold text-black mb-1.5">{q}</h3>
                <p className="text-xs text-black/50 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ABOUT ─── */}
        <div className="mb-16">
          <h2 className="text-sm font-mono uppercase tracking-[3px] text-black/30 mb-4">About JPTech</h2>
          <div className="bg-white/70 backdrop-blur rounded-2xl p-6 md:p-8 border border-black/5">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-lg font-bold text-black mb-3" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Your Trusted Technology Partner in Rwanda</h3>
                <p className="text-sm text-black/60 leading-relaxed mb-4">
                  JPTech has been Rwanda&apos;s leading technology retailer since 2020. We specialize in providing
                  high-quality electronics, computers, and tech accessories at competitive prices.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Nationwide Delivery', color: 'bg-green-500' },
                    { label: 'Expert Support', color: 'bg-black' },
                    { label: 'Quality Guarantee', color: 'bg-gold' },
                  ].map(({ label, color }) => (
                    <span key={label} className="inline-flex items-center gap-1.5 text-xs text-black/50">
                      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-black/5 rounded-xl p-5">
                <h4 className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Why Choose JPTech?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Authentic products', 'Fast delivery', '24/7 support',
                    'Best prices', 'Expert advice', 'Easy returns',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-black/60">
                      <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CATEGORIES ─── */}
        <div className="mb-16">
          <h2 className="text-sm font-mono uppercase tracking-[3px] text-black/30 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.slice(0, 12).map((cat) => (
              <Link key={cat._id} href={`/category/${cat.slug}`} className="group block">
                <div className="bg-white/70 backdrop-blur rounded-xl p-3.5 border border-black/5 text-center hover:border-black/20 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                    <Image src={cat.image || 'https://placehold.co/40x40?text=+'} alt={cat.name?.en || ''} width={24} height={24} className="object-contain" />
                  </div>
                  <p className="text-[11px] font-medium text-black leading-tight">{cat.name?.[language] || cat.name?.en}</p>
                  <p className="text-[9px] text-black/30 mt-0.5">{cat.productCount || 0} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── SERVICES ─── */}
        <div className="mb-16">
          <h2 className="text-sm font-mono uppercase tracking-[3px] text-black/30 mb-4">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Truck, label: 'Nationwide Delivery', desc: 'Fast delivery across Rwanda' },
              { icon: Shield, label: 'Technical Support', desc: 'Expert assistance' },
              { icon: MessageCircle, label: 'After-Sales Service', desc: 'Warranty & repairs' },
              { icon: Star, label: 'Product Consultation', desc: 'Expert advice' },
              { icon: RefreshCw, label: 'Easy Returns', desc: '7-day returns' },
              { icon: Package, label: 'Custom Orders', desc: 'Special sourcing' },
            ].map(({ icon: Icon, label, desc: d }) => (
              <div key={label} className="bg-white/70 backdrop-blur rounded-xl p-3.5 border border-black/5 text-center hover:border-black/20 transition-all">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-black/5 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-black/50" />
                </div>
                <h3 className="text-xs font-semibold text-black">{label}</h3>
                <p className="text-[9px] text-black/40 mt-0.5">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
