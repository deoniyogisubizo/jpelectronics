import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. You can pay via cash on delivery, MTN Mobile Money, or Airtel Money.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Cash on Delivery, MTN Mobile Money, and Airtel Money for all orders across Rwanda.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery to Kigali takes 1-2 business days. Deliveries to other provinces take 3-6 business days depending on location.',
    },
    {
      question: 'Do you offer warranty?',
      answer: 'Yes, all products come with a 1-year manufacturer warranty. You can also purchase extended warranty at checkout.',
    },
    {
      question: 'Can I return a product?',
      answer: 'Yes, you can return products within 7 days if they are unused and in original packaging. Return shipping fees may apply.',
    },
    {
      question: 'Do you deliver outside Rwanda?',
      answer: 'Currently we only deliver within Rwanda. International shipping is not available at this time.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking number via SMS and WhatsApp. You can also use our Order Tracking page.',
    },
    {
      question: 'Are the products genuine?',
      answer: 'Yes, all our products are 100% genuine with valid manufacturer serial numbers and warranties.',
    },
  ];

  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-beige flex flex-col">
          <Header />

          <main className="flex-1 py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <HelpCircle className="w-16 h-16 text-gold mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Find answers to common questions about shopping with JP Tech
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow">
                    <details className="p-6">
                    <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                      {faq.question}
                      <ChevronDown className="w-5 h-5 text-gold" />
                    </summary>
                      <p className="mt-4 text-gray-600">{faq.answer}</p>
                    </details>
                  </div>
                ))}
              </div>

              {/* Still need help */}
              <div className="mt-12 bg-black text-white rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
                <p className="mb-6">Our support team is available 24/7 to assist you</p>
          <a
            href="https://wa.me/250790336683"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
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
