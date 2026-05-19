export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      categories: 'Categories',
      about: 'About',
      contact: 'Contact',
      faq: 'FAQ',
      track: 'Track Order',
      admin: 'Admin',
    },
    // Homepage
    hero: {
      title: 'JP Tech — All Your Electronics in One Place',
      subtitle: 'Your trusted electronics marketplace across Rwanda',
      cta: 'Shop Now',
    },
    categories: {
      title: 'Shop by Category',
      smartphones: 'Smartphones & Accessories',
      computers: 'Computers & Laptops',
      tvs: 'TVs & Audio',
      appliances: 'Home Appliances',
      wearables: 'Wearables & Health',
      solar: 'Solar & Power',
      cameras: 'Cameras & Creator Gear',
      mobility: 'Electric Mobility',
      security: 'Security & Business',
    },
    hotDeals: {
      title: 'Hot Deals',
    },
    newArrivals: {
      title: 'New Arrivals',
    },
    bestSellers: {
      title: 'Best Sellers',
    },
    trust: {
      delivery: 'Delivery in Konombe-mubusanza',
      cod: 'Cash on Delivery',
      warranty: 'Warranty',
      whatsapp: 'WhatsApp Support',
    },
    product: {
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      details: 'Product Details',
      specs: 'Specifications',
      related: 'Related Products',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      subtotal: 'Subtotal',
      delivery: 'Delivery Fee',
      tax: 'Tax',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      continue: 'Continue Shopping',
    },
    checkout: {
      title: 'Checkout',
      shipping: 'Shipping Address',
      payment: 'Payment Method',
      review: 'Order Review',
      placeOrder: 'Place Order',
      districts: {
        kigali: 'Kigali City',
        northern: 'Northern Province',
        southern: 'Southern Province',
        eastern: 'Eastern Province',
        western: 'Western Province',
      },
    },
    admin: {
      dashboard: 'Dashboard',
      products: 'Products',
      orders: 'Orders',
      categories: 'Categories',
      login: 'Admin Login',
      logout: 'Logout',
    },
  },
  rw: {
    // Navigation
    nav: {
      home: 'itangiriro',
      categories: 'Amabwiriza',
      about: 'Ibyerekeye',
      contact: 'Umubonano',
      faq: 'Ibibazo',
      track: 'Kurondera Uwohereje',
      admin: 'Umuyobozi',
    },
    // Homepage
    hero: {
      title: 'JP Tech — Ibicuruzwa byose mu Gihanga',
      subtitle: 'Isoko ryo kugurishirizamwo ibicuruzwa byiza mu Rwanda',
      cta: 'Raba Ku Isoko',
    },
    categories: {
      title: 'Raba mu Mabwiriza',
      smartphones: 'Telefoni & Ibicuruzwa',
      computers: 'Kompyuta & Laptops',
      tvs: 'TV & Ijwi',
      appliances: 'Ibikoreswa mu Nzu',
      wearables: 'Ibikoreswa byo Ku Mubiri & Ubuzima',
      solar: 'Umucyo & Amashanyarazi',
      cameras: 'Foto & Ibikoreswa byo Kubika Videos',
      mobility: 'Moto y\'Umuhanda',
      security: 'Umutekano & Ibikorwa',
    },
    hotDeals: {
      title: 'Amahugurwa Akaze',
    },
    newArrivals: {
      title: 'Ibicuruzwa Bishya',
    },
    bestSellers: {
      title: 'Ibicuruzwa Birushaho Gukoreshwa',
    },
    trust: {
      delivery: 'Kohereza mu Konombe-mubusanza',
      cod: 'Ishyura mu Mafaranga',
      warranty: 'Gukosora',
      whatsapp: 'Ubufasha kuri WhatsApp',
    },
    product: {
      addToCart: 'Shyira mu Kubanza',
      buyNow: 'Gura Ubu',
      inStock: 'Iraboneka',
      outOfStock: 'Ntabwo Iraboneka',
      details: 'Amakuru yerekeye',
      specs: 'Ibisobanuro',
      related: 'Ibicuruzwa Bifitanye Isano',
    },
    cart: {
      title: 'Umutego w\'Igicuruzwa',
      empty: 'Umutego wawe uratonganye',
      subtotal: 'Igice cy\'amafaranga',
      delivery: 'Amafaranga yo Kohereza',
      tax: 'Takarii',
      total: 'Igice cyose',
      checkout: 'Shika Icyo Uganda',
      continue: 'Komeza Kugura',
    },
    checkout: {
      title: 'Icyo Uganda',
      shipping: 'Aho Kohereza',
      payment: 'Uburyo bw\'Ishyura',
      review: 'Kureba Icyo Uganda',
      placeOrder: 'Kohereza Icyo Uganda',
      districts: {
        kigali: 'Umujyi wa Kigali',
        northern: 'Intara y\'Amajyaruguru',
        southern: 'Intara y\'Amajyepfo',
        eastern: 'Intara y\'Iburasirazuba',
        western: 'Intara y\'Iburengerazuba',
      },
    },
    admin: {
      dashboard: 'Ibaruwa',
      products: 'Ibicuruzwa',
      orders: 'Ibyoherejwe',
      categories: 'Amabwiriza',
      login: 'Kwinjira nk\'Umuyobozi',
      logout: 'Sohoka',
    },
  },
};

export type Language = 'en' | 'rw';

export function t(key: string, lang: Language = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

// Rwanda districts with sectors
export const rwandaDistricts: { name: string; sectors: string[]; deliveryFee: number; estimatedDays: string }[] = [
  { name: 'Gasabo', sectors: ['Kacyiru', 'Gisozi', 'Nyarugenge', 'Kimihurura', 'Kicukiro'], deliveryFee: 1500, estimatedDays: '1-2' },
  { name: 'Kicukiro', sectors: ['Kagarama', 'Kanombe', 'Kicukiro', 'Nyarugenge', 'Gahanga', 'Masaka'], deliveryFee: 2000, estimatedDays: '1-2' },
  { name: 'Nyarugenge', sectors: ['Gitega', 'Kigali', 'Mwumba', 'Nyakabanda', 'Nyamirambo', 'Muhima', 'Rwezamenyo'], deliveryFee: 1500, estimatedDays: '1-2' },
  { name: 'Northern Province', sectors: ['Rulindo', 'Burera', 'Gicumbi', 'Gakenke', 'Musanze'], deliveryFee: 4000, estimatedDays: '3-5' },
  { name: 'Southern Province', sectors: ['Huye', 'Gisagara', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Ruhango'], deliveryFee: 4500, estimatedDays: '3-5' },
  { name: 'Eastern Province', sectors: ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Nyagatare', 'Rwamagana'], deliveryFee: 5000, estimatedDays: '4-6' },
  { name: 'Western Province', sectors: ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rutsiro', 'Rubavu'], deliveryFee: 5500, estimatedDays: '4-6' },
];
