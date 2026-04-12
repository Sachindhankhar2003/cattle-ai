import React, { useState } from 'react';
import { Book, MapPin, Droplets, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CattleData = {
  cow: [
    { breed: 'Holstein', origin: 'Netherlands', milkProd: '7,000 - 10,000 kg', characteristics: 'Black and white spots, large frame, highest global yield.', fact: 'Can yield over 70 liters of milk a day.' },
    { breed: 'Jersey', origin: 'Jersey Island, UK', milkProd: '4,000 - 5,000 kg', characteristics: 'Fawn color, prominent eyes, small frame.', fact: 'Milk is famous for very high butterfat.' },
    { breed: 'Gir', origin: 'Gujarat, India', milkProd: '2,100 kg', characteristics: 'Red to spotted, prominent domed forehead, long ears.', fact: 'Highly disease and tick resistant.' },
    { breed: 'Sahiwal', origin: 'Punjab (India & Pak)', milkProd: '2,200 kg', characteristics: 'Reddish brown, tick resistant, calm.', fact: 'Considered the best Zebu milch breed.' },
    { breed: 'Red Sindhi', origin: 'Sindh, Pakistan', milkProd: '1,800 kg', characteristics: 'Deep red color, compact body structure.', fact: 'Outstanding heat tolerance.' },
    { breed: 'Tharparkar', origin: 'Thar Desert', milkProd: '1,700 kg', characteristics: 'White or light grey, lyre-shaped horns.', fact: 'Can thrive on sparse desert vegetation.' },
    { breed: 'Kankrej', origin: 'Gujarat / Rajasthan', milkProd: '1,750 kg', characteristics: 'Silver-grey coat, large crescent-like horns.', fact: 'One of the heaviest Indian cattle breeds.' }
  ],
  buffalo: [
    { breed: 'Murrah', origin: 'Haryana / Punjab', milkProd: '2,000 - 2,500 kg', characteristics: 'Jet black, tightly curved horns, massive wedge-shaped body.', fact: 'Often termed the "Black Gold" of India dairy.' },
    { breed: 'Nili-Ravi', origin: 'Punjab (Pak & India)', milkProd: '1,800 - 2,500 kg', characteristics: 'White markings on face, muzzle, legs. Walleyed (white iris).', fact: 'Excellent converts of roughage into milk.' },
    { breed: 'Jaffarabadi', origin: 'Gujarat, India', milkProd: '2,000 - 2,700 kg', characteristics: 'Heavy drooping horns, prominent forehead, extremely heavy build.', fact: 'The heaviest buffalo breed in India.' },
    { breed: 'Mehsana', origin: 'Gujarat, India', milkProd: '1,200 - 1,500 kg', characteristics: 'Intermediate features of Murrah and Surti, long body.', fact: 'Bred for early maturity and consistent milk production.' },
    { breed: 'Surti', origin: 'Gujarat, India', milkProd: '1,300 - 1,500 kg', characteristics: 'Sickle-shaped horns, medium size, two distinct white collars.', fact: 'Economical to feed, excellent quality milk.' },
    { breed: 'Bhadawari', origin: 'Uttar Pradesh', milkProd: '800 - 1,000 kg', characteristics: 'Copper colored body with sparse hair.', fact: 'World famous for milk butterfat reaching up to 13%!' }
  ],
  goat: [
    { breed: 'Sirohi', origin: 'Rajasthan, India', milkProd: '0.5 - 1 kg/day', characteristics: 'Brown coat with spots, medium-sized flat leaf-like ears.', fact: 'Adapted perfectly to harsh, dry climatic conditions.' },
    { breed: 'Beetal', origin: 'Punjab, India', milkProd: '2 - 3 kg/day', characteristics: 'Black or red, prominent roman nose, long drooping ears.', fact: 'Highly prolific breed known for good dairy potential.' },
    { breed: 'Jamunapari', origin: 'Uttar Pradesh', milkProd: '2 - 2.5 kg/day', characteristics: 'White base with tan patches, highly pendulous ears, tall.', fact: 'The largest and most elegant goat breed in India.' }
  ]
};

const Encyclopedia = () => {
  const [activeTab, setActiveTab] = useState('cow');

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-400 font-bold text-sm tracking-widest uppercase">
          <Book size={18} /><span>Cattle Encyclopedia</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white">Livestock <span className="text-emerald-500">Knowledge Base</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Learn about the different characteristics, origins, and milk production capabilities of major globally recognized livestock breeds.</p>
      </header>

      <div className="flex justify-center space-x-4">
        {['cow', 'buffalo', 'goat'].map(tab => (
           <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${activeTab === tab ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
           >
             {tab}s
           </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {CattleData[activeTab].map((breed, index) => (
            <div key={index} className="glass-morphism rounded-3xl p-8 border border-white/5 hover:border-emerald-500/30 transition-colors group flex flex-col h-full">
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-white">{breed.breed}</h3>
                  <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{activeTab}</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-slate-500 mt-1 shrink-0" size={18} />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Origin</p>
                      <p className="text-sm font-medium text-slate-300">{breed.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Droplets className="text-slate-500 mt-1 shrink-0" size={18} />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Milk Yield</p>
                      <p className="text-sm font-medium text-emerald-400">{breed.milkProd}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Info className="text-slate-500 mt-1 shrink-0" size={18} />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Key Traits</p>
                      <p className="text-sm font-medium text-slate-300">{breed.characteristics}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-slate-400 italic">" {breed.fact} "</p>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Encyclopedia;
