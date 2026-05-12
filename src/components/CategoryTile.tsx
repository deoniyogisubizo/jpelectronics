import Link from 'next/link';

interface Category {
  _id: string;
  name: { en: string; rw: string };
  slug: string;
  image: string;
  featured: boolean;
  productCount: number;
}

interface CategoryTileProps {
  category: Category;
}

// Category descriptions for each type
const categoryDescriptions: Record<string, { en: string; rw: string }> = {
  smartphones: {
    en: 'Latest smartphones from Samsung, iPhone, Tecno, and more. Flagship & budget options available.',
    rw: 'Telefoni nshya za Samsung, iPhone, Tecno, nibindi. Ibyiciro by\'amafaranga menshi n\'abantu benshi.'
  },
  laptops: {
    en: 'Powerful laptops for work, study, or gaming. MacBook, Dell, HP, Lenovo and more.',
    rw: 'Laptops z\'imbaraga z\'umurimo, kwiga, cyangwa kukinisha. MacBook, Dell, HP, Lenovo n\'ibindi.'
  },
  tablets: {
    en: 'iPads, Android tablets & Windows tablets. Perfect for entertainment and productivity.',
    rw: 'iPads, Android tablets & Windows tablets. Ibyiza by\'imyidagaduro n\'umurimo.'
  },
  'smart-tvs': {
    en: '4K & 8K Smart TVs from top brands. Samsung, LG, Sony with Android & webOS.',
    rw: '4K & 8K Smart TV z\'ubukeranzi. Samsung, LG, Sony ufashe Android & webOS.'
  },
  'audio-systems': {
    en: 'Speakers, soundbars, home theater systems & headphones. Premium sound quality.',
    rw: 'Amajwi, speakers,TV yo kurira amajwi & headphones. Ubwiza bw\'amajwi.'
  },
  'gaming-consoles': {
    en: 'PlayStation, Xbox, Nintendo Switch & gaming accessories. Level up your setup.',
    rw: 'PlayStation, Xbox, Nintendo Switch & ibikoreswa by\'umukino. Uhuze umukino wawe.'
  },
  wearables: {
    en: 'Smartwatches, fitness trackers & smart glasses. Stay connected on your wrist.',
    rw: 'Smartwatches, fitness trackers & amadarubindi. Kubaho kuri nijoro ku kijyohoro.'
  },
  cameras: {
    en: 'DSLR, mirrorless, action cameras & accessories. Capture every moment perfectly.',
    rw: 'DSLR, mirrorless, cameras zo gukora & ibikoreswa. Fata amafoto neza.'
  },
  drones: {
    en: 'Camera drones, beginner drones & racing drones. Take your photography to new heights.',
    rw: 'Drones zo gufotora, drones z\'abasanzwe & racing drones. Ubye amafoto atangaje.'
  },
  'smart-home': {
    en: 'Smart lights, plugs, thermostats & security cameras. Automate your home easily.',
    rw: 'Amatara smart, plugs, thermostats & cameras z\'umutekano. Shyira muri deux imyubamo.'
  },
  networking: {
    en: 'Routers, modems, switches & network storage. Build your perfect network.',
    rw: 'Routers, modems, switches & ububiko bw\'umuyoboro. Rebe urugero rwawe.'
  },
  'printers-scanners': {
    en: 'Inkjet, laser printers, scanners & all-in-ones. Print, scan, copy & fax.',
    rw: 'Inkjet, laser printers, scanners & ibyikoresha byose. Shyira, sanya, koporisi & fax.'
  },
  monitors: {
    en: 'LED, LCD, gaming monitors & ultrawide displays. Crisp visuals for work & play.',
    rw: 'LED, LCD, gaming monitors & monitors manini. Amajwi meza ku murimo n\'umukino.'
  },
  'keyboards-mice': {
    en: 'Mechanical keyboards, wireless mice & gaming accessories. Precision control.',
    rw: 'Mechanical keyboards, mice wireless & ibikoreswa by\'umukino. Imbaraga.'
  },
  headphones: {
    en: 'Noise-cancelling, wireless, gaming & studio headphones. Immersive audio experience.',
    rw: 'Noise-cancelling, wireless, gaming & studio headphones. Ubwiza bw\'amajwi.'
  },
  speakers: {
    en: 'Bluetooth speakers, portable speakers & home audio systems. Music anywhere.',
    rw: 'Bluetooth speakers, portable speakers & ibikoreswa by\'amajwi. Umuziki hose.'
  },
  'smart-watches': {
    en: 'Apple Watch, Samsung Galaxy Watch & fitness trackers. Health & notifications on your wrist.',
    rw: 'Apple Watch, Samsung Galaxy Watch & fitness trackers. Amakuru yo ku mubiri ku kijyohoro.'
  },
  'chargers-cables': {
    en: 'Phone chargers, USB cables, power adapters & charging stations. Never run out of battery.',
    rw: 'Chargers, USB cables, power adapters & charging stations. Ntukagire umuriro urangiye.'
  },
  'power-banks': {
    en: 'Portable chargers & power banks for all devices. Stay powered on the go.',
    rw: 'Chargers z\'igikoni & power banks z\'ibikoreswa byose. Komeza ushyireho.'
  },
  'vr-headsets': {
    en: 'VR headsets & augmented reality glasses. Immersive virtual experiences.',
    rw: 'VR headsets & augmented reality glasses. Ubwiza bw\'inyura n\'icyuma.'
  }
};

export default function CategoryTile({ category }: CategoryTileProps) {
  const description = categoryDescriptions[category.slug]?.en || 'Explore our selection of quality electronics in this category.';

   return (
     <div className="group relative bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300">
       {/* Main Category Link */}
       <Link href={`/category/${category.slug}`} className="block p-2 md:p-4 text-center">
          <div className={`text-black font-bold ${category.name.en === 'Printers & Scanners' ? 'text-[8px] md:text-xs' : 'text-xs md:text-base'}`} style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
            {category.name.en}
          </div>
       </Link>

       {/* Dropdown Panel - CSS Hover */}
       <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-b-lg shadow-2xl border-t-2 border-yellow-400 p-2 md:p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
         <div className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 leading-relaxed">
           {description}
         </div>
         <div className="flex items-center justify-between gap-2">
           {category.featured && (
             <span className="bg-yellow-100 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-base text-yellow-700">
               Featured
             </span>
           )}
           <Link
             href={`/category/${category.slug}`}
             className="text-[10px] md:text-xs font-semibold bg-black text-white px-2 py-1 md:px-3 md:py-1.5 rounded hover:bg-gray-800 transition-colors"
           >
             Shop This Category →
           </Link>
         </div>
       </div>
     </div>
   );
}
