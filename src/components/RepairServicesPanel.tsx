'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

const repairServices = [
  { name: "Phone Repair", image: "/images/1.jpeg", description: "Screen, battery, software — same-day fixes" },
  { name: "TV Repair", image: "/images/2.jpeg", description: "Panels, ports, power — bring it back to life" },
  { name: "Laptop Repair", image: "/images/4.jpeg", description: "Keyboard, screen, motherboard — fast turnaround" },
  { name: "Fridge & AC Repair", image: "/images/7.jpeg", description: "Compressor, cooling, gas refill" },
  { name: "Washing Machine", image: "/images/8.jpeg", description: "Motor, pump, board — house calls available" },
  { name: "Small Appliances", image: "/images/3.jpeg", description: "Kettles, blenders, irons, toasters" },
];

export default function RepairServicesPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % repairServices.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const handleCTAClick = (device: string) => {
    const msg = `Hi JP Electronics, I need repair for my ${device}`;
    window.open(`https://wa.me/250790336683?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const s1 = repairServices[currentIndex];
  const s2 = repairServices[(currentIndex + 1) % repairServices.length];

  return (
    <section className="py-4 bg-beige-deep">
      <div className="container mx-auto">
        <div className="mb-4 flex items-center gap-3">
          <div className="uppercase tracking-[2.5px] text-xs font-bold text-black/60">IN-HOUSE EXPERTS • KIGALI</div>
          <h2 className="text-2xl md:text-3xl font-black text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>REPAIR SERVICES — WE FIX IT</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[s1, s2].map((service, idx) => (
            <div key={idx} className="flex flex-col md:flex-row bg-[#f9f6ed]/70 backdrop-blur rounded-2xl overflow-hidden border border-black/10">
              <div className="md:w-5/12">
                <Image src={service.image} alt={service.name} width={400} height={300} className="w-full h-56 md:h-full object-cover" />
              </div>
              <div className="flex-1 p-5 flex flex-col">
                <div className="uppercase text-[10px] text-gold font-bold tracking-widest mb-1">PROFESSIONAL FIX</div>
                <h3 className="text-2xl font-bold text-black mb-1">{service.name}</h3>
                <p className="text-black/70 flex-1 text-sm">{service.description}</p>
                <button
                  onClick={() => handleCTAClick(service.name.replace(' Repair', ''))}
                  className="mt-3 inline-flex items-center gap-2 self-start bg-black text-gold px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black/90 active:scale-[0.985] transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  WHATSAPP FOR QUOTE
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-3 text-xs text-black/50">16+ device types • 1-year warranty on repairs • Same-day service in Kigali</div>
      </div>
    </section>
  );
}
