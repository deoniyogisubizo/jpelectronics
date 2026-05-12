import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-beige flex flex-col">
          <Header />

          <main className="flex-1 py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Contact Form */}
                <div className="bg-white rounded-lg p-8 shadow">
                  <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="px-4 py-3 border rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="px-4 py-3 border rounded-lg"
                        required
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 border rounded-lg"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <textarea
                      placeholder="Your Message"
                      rows={6}
                      className="w-full px-4 py-3 border rounded-lg"
                      required
                    />
                    <button type="submit" className="w-full btn-primary">
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h3 className="font-bold text-xl mb-4">Get in Touch</h3>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                         <Phone className="w-5 h-5 text-gold" />
                          <div>
                            <p className="font-medium">Phone</p>
                            <p className="text-gray-600">+250 790 336 683</p>
                            <p className="text-gray-600">+250 796 279 847</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                         <MessageCircle className="w-5 h-5 text-gold" />
                          <div>
                            <p className="font-medium">WhatsApp</p>
                            <p className="text-gray-600">+250 790 336 683</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                         <Mail className="w-5 h-5 text-gold" />
                         <div>
                           <p className="font-medium">Email</p>
                           <p className="text-gray-600">Jndayisenga47@gmail.com</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-3">
                         <MapPin className="w-5 h-5 text-gold" />
                         <div>
                           <p className="font-medium">Address</p>
                           <p className="text-gray-600">Konombe-mubusanza, Rwanda</p>
                         </div>
                       </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gold" />
                        <div>
                          <p className="font-medium">Business Hours</p>
                          <p className="text-gray-600">Mon-Sat: 8:00 AM - 7:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black text-white rounded-lg p-6">
                    <h3 className="font-bold text-xl mb-2">Quick Response Guarantee</h3>
                    <p className="text-gray-300">
                      We respond to all inquiries within 2 hours during business hours.
                      For urgent support, message us on WhatsApp for fastest response.
                    </p>
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
