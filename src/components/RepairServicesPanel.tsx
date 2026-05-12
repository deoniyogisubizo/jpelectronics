'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

function RepairServicesPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const repairServices = [
    { name: "Phone Repair", image: "/images/1.jpeg", description: "Screen replacement, battery issues, software fixes" },
    { name: "TV Repair", image: "/images/2.jpeg", description: "Panel replacement, HDMI ports, power supply" },
    { name: "Kettle Repair", image: "/images/3.jpeg", description: "Heating element, switch replacement" },
    { name: "Laptop Repair", image: "/images/4.jpeg", description: "Keyboard, screen, motherboard fixes" },
    { name: "Tablet Repair", image: "/images/5.jpeg", description: "Digitizer, battery, charging issues" },
    { name: "Microwave Repair", image: "/images/6.jpeg", description: "Magnetron, door switch, control panel" },
    { name: "Fridge Repair", image: "/images/7.jpeg", description: "Compressor, thermostat, defrost" },
    { name: "Washing Machine Repair", image: "/images/8.jpeg", description: "Motor, pump, control board" },
    { name: "Air Conditioner Repair", image: "/images/9.jpeg", description: "Compressor, fan, refrigerant" },
    { name: "Coffee Maker Repair", image: "/images/10.jpeg", description: "Heating element, pump, grinder" },
    { name: "Blender Repair", image: "/images/11.jpeg", description: "Motor, blades, switch" },
    { name: "Vacuum Cleaner Repair", image: "/images/12.jpeg", description: "Motor, filters, suction" },
    { name: "Iron Repair", image: "/images/13.jpeg", description: "Heating element, thermostat" },
    { name: "Toaster Repair", image: "/images/14.jpeg", description: "Heating elements, timer" },
    { name: "Hair Dryer Repair", image: "/images/15.jpeg", description: "Motor, heating element" },
    { name: "Printer Repair", image: "/images/16.jpeg", description: "Ink cartridges, print head" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % repairServices.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [repairServices.length]);

  const service1 = repairServices[currentIndex];
  const service2 = repairServices[(currentIndex + 1) % repairServices.length];
  const isAlternateLayout = (currentIndex / 2) % 2 === 1;

  const getDeviceName = (name: string) => {
    return name.replace(' Repair', '');
  };

  const handleCTAClick = (device: string) => {
    const message = `Hi, I need repair for my ${device}`;
    const whatsappUrl = `https://wa.me/250790336683?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-4" style={{ backgroundColor: '#f5f5dc' }}> {/* beige */}
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit)', color: '#333333' }}>Repair Services</h2> {/* black */}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Column 1 */}
          <div className={`flex items-center gap-6 ${isAlternateLayout ? 'flex-row-reverse' : ''}`}>
            <div className={`${isAlternateLayout ? 'text-right' : 'text-left'} flex-1`}>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)', color: '#333333' }}>{service1.name}</h3>
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>{service1.description}</p>
              <button
                onClick={() => handleCTAClick(getDeviceName(service1.name))}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:bg-gold/10 transition-colors"
                style={{ fontFamily: 'var(--font-outfit)', color: '#d4af37', borderColor: '#d4af37' }}
              >
                <Send className="w-4 h-4" style={{ transform: 'rotate(45deg)' }} />
                Talk to Repair {getDeviceName(service1.name)}
              </button>
            </div>
            <div className="flex-1">
              <img
                src={service1.image}
                alt={service1.name}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
          {/* Column 2 */}
          <div className={`flex items-center gap-6 ${!isAlternateLayout ? 'flex-row-reverse' : ''}`}>
            <div className={`${!isAlternateLayout ? 'text-right' : 'text-left'} flex-1`}>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)', color: '#333333' }}>{service2.name}</h3>
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>{service2.description}</p>
              <button
                onClick={() => handleCTAClick(getDeviceName(service2.name))}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:bg-gold/10 transition-colors"
                style={{ fontFamily: 'var(--font-outfit)', color: '#d4af37', borderColor: '#d4af37' }}
              >
                <Send className="w-4 h-4" style={{ transform: 'rotate(45deg)' }} />
                Talk to Repair {getDeviceName(service2.name)}
              </button>
            </div>
            <div className="flex-1">
              <img
                src={service2.image}
                alt={service2.name}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RepairServicesPanel;