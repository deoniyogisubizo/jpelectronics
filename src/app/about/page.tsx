import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { Users, Zap, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-beige flex flex-col">
          <Header />

          <main className="flex-1 py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-8 text-center">About JP Tech</h1>

              {/* Hero Section */}
              <div className="bg-white rounded-lg p-8 mb-12 shadow">
                <div className="max-w-3xl mx-auto text-center">
                  <p className="text-xl text-gray-700 mb-6">
                    JP Tech is Rwanda's leading electronics marketplace, committed to providing
                    quality electronic products with exceptional customer service across the country.
                  </p>
                  <p className="text-gray-600">
                    Founded with a vision to make technology accessible to every Rwandan,
                    we offer a wide range of products from smartphones and laptops to home
                    appliances and solar solutions.
                  </p>
                </div>
              </div>

              {/* Our Values */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <div className="w-12 h-12 bg-vibrant rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
                  <p className="text-gray-500 text-sm">Quick delivery across Rwanda, especially in Kigali</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Quality Guaranteed</h3>
                  <p className="text-gray-500 text-sm">All products are genuine with manufacturer warranty</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Customer First</h3>
                  <p className="text-gray-500 text-sm">24/7 support through WhatsApp and phone</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <div className="w-12 h-12 bg-vibrant rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Trusted by Many</h3>
                  <p className="text-gray-500 text-sm">Thousands of satisfied customers across Rwanda</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-black text-white rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gold mb-4">Our Office</h3>
                    <p>Kigali, Rwanda</p>
                    <p>KG 123 St, Kimihurura</p>
                    <p className="mt-4">Opening Hours:</p>
                    <p>Monday - Saturday: 8:00 AM - 7:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gold mb-4">Contact Numbers</h3>
                    <p>Phone: +250 790 336 683</p>
                    <p>Phone: +250 796 279 847</p>
                    <p>WhatsApp: +250 790 336 683</p>
                    <p>Email: Jndayisenga47@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
