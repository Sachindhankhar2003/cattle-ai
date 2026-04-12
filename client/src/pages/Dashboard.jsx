import React, { useState, useEffect, useRef } from 'react';
import UploadSection from '../components/UploadSection';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Award, MapPin, Droplets, Download, Share2, Activity, TrendingUp, Target, CreditCard, Stethoscope, Calculator, X } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const Dashboard = () => {
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);
  const resultRef = useRef(null);

  // Modals
  const [showIDCard, setShowIDCard] = useState(false);
  const [showMilkCalc, setShowMilkCalc] = useState(false);
  
  // Milk Calc State
  const [milkStats, setMilkStats] = useState({ age: 4, lactation: 2, price: 50 });

  useEffect(() => {
    fetchStats();
  }, [result]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('/api/prediction/history', { headers: { 'x-auth-token': token } });
      setHistory(res.data);
    } catch (err) {}
  };

  const onPredictionStart = () => { setIsAnalyzing(true); setResult(null); };

  const onPredictionSuccess = (data) => {
    setResult(data);
    setIsAnalyzing(false);
    toast.success('Analysis complete!');
  };

  const exportPDF = () => {
    const element = resultRef.current;
    if (!element) return;
    toast.loading('Generating PDF...', { id: 'pdf' });
    const opt = {
      margin: 1, filename: `Buffalo_Scan_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0f172a' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().then(() => toast.success('PDF Exported!', { id: 'pdf' }));
  };

  const shareWhatsApp = () => {
    if (!result) return;
    const conf = (Number(result.confidence) * 100).toFixed(1);
    const text = `I just analyzed a cattle image using CattleAI! 🐄\n\nDetected Breed: *${result.prediction}* (${conf}% match)\nAlternative: ${result.top3[1]?.breed}\n\nCheck out CattleAI today!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const findNearbyVet = () => {
    if (navigator.geolocation) {
      toast.loading('Locating...', { id: 'geo' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
           toast.success('Found location!', { id: 'geo' });
           const lat = position.coords.latitude;
           const lng = position.coords.longitude;
           window.open(`https://www.google.com/maps/search/veterinary+clinic+animal+hospital/@${lat},${lng},14z`);
        },
        (error) => { toast.error('Geolocation failed. Please allow location access.', { id: 'geo' }); }
      );
    }
  };

  const getConfidenceColor = (confValue) => {
    if (confValue >= 70) return '#10b981';
    if (confValue >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const confidenceValue = result ? (Number(result.confidence || 0) * 100) : 0;
  const confColor = getConfidenceColor(confidenceValue);
  
  const displayTop3 = result ? [0, 1, 2].map(idx => {
      const item = result.top3 && result.top3[idx] ? result.top3[idx] : null;
      let conf = item && item.confidence !== undefined && item.confidence !== null ? Number(item.confidence) : NaN;
      if (isNaN(conf)) {
          if (idx === 0) conf = (confidenceValue > 0 ? confidenceValue / 100 : 0.85);
          else if (idx === 1) conf = 0.60;
          else conf = 0.40;
      }
      return {
          name: item?.breed || `Alternative ${idx}`,
          value: conf * 100,
          color: idx === 0 ? '#10b981' : idx === 1 ? '#facc15' : '#f97316'
      };
  }) : [];

  const totalScans = history.length;
  let mostDetected = 'N/A';
  let avgAccuracy = 0;

  if (totalScans > 0) {
    const freq = {};
    let totalConf = 0;
    history.forEach(h => { freq[h.breed] = (freq[h.breed] || 0) + 1; totalConf += Number(h.confidence || 0); });
    mostDetected = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
    avgAccuracy = ((totalConf / totalScans) * 100).toFixed(1);
  }

  // Generate Feature Badges
  const features = result?.metadata?.characteristics ? result.metadata.characteristics.split(',').slice(0, 4) : [];

  return (
    <div className="relative space-y-16 py-8">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>

      <header className="text-center space-y-6 max-w-4xl mx-auto relative">
        <h1 className="text-5xl font-black text-white leading-tight">
          Cattle Breed <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Recognition</span>
        </h1>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div className="glass-morphism p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500"><Activity size={28} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase">Total Scans</p><p className="text-3xl font-black text-white">{totalScans}</p></div>
        </motion.div>
        <motion.div className="glass-morphism p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500"><TrendingUp size={28} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase">Most Detected</p><p className="text-3xl font-black text-white">{mostDetected}</p></div>
        </motion.div>
        <motion.div className="glass-morphism p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500"><Target size={28} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase">Avg Accuracy</p><p className="text-3xl font-black text-white">{avgAccuracy}%</p></div>
        </motion.div>
      </div>

      <section className="relative z-10"><UploadSection onPredictionStart={onPredictionStart} onPredictionSuccess={onPredictionSuccess} /></section>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16 max-w-7xl mx-auto">
            {/* Action Bar */}
            <div className="lg:col-span-12 flex flex-wrap justify-end gap-3 mb-[-1rem]">
                <button onClick={() => setShowMilkCalc(true)} className="flex items-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-4 py-2 rounded-xl transition-colors text-sm font-semibold">
                  <Calculator size={16} /> Calculator
                </button>
                <button onClick={() => setShowIDCard(true)} className="flex items-center gap-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/40 px-4 py-2 rounded-xl transition-colors text-sm font-semibold">
                  <CreditCard size={16} /> ID Card
                </button>
                <button onClick={findNearbyVet} className="flex items-center gap-2 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/40 px-4 py-2 rounded-xl transition-colors text-sm font-semibold">
                  <Stethoscope size={16} /> Nearby Vet
                </button>
                <button onClick={exportPDF} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-colors border border-white/10 text-sm font-semibold">
                  <Download size={16} /> PDF Report
                </button>
                <button onClick={shareWhatsApp} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl transition-colors text-sm font-semibold">
                  <Share2 size={16} /> WhatsApp
                </button>
            </div>

            {/* Main Result Card */}
            <div ref={resultRef} className="lg:col-span-5 glass-morphism rounded-[2.5rem] p-10 border border-white/5 relative flex flex-col justify-between">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-40 h-40 mb-6 drop-shadow-2xl">
                    <CircularProgressbar value={confidenceValue} text={`${(confidenceValue || 0).toFixed(0)}%`} styles={buildStyles({ pathColor: confColor, textColor: '#fff', trailColor: 'rgba(255,255,255,0.05)', textSize: '24px'})}/>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white text-center mb-4">{result.prediction}</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                     {features.map((f, i) => (
                        <span key={i} className="text-[10px] uppercase font-bold bg-white/10 text-emerald-400 px-3 py-1 rounded-full">{f.trim()}</span>
                     ))}
                  </div>
                </div>

                <div className="w-full mt-4 bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-6 text-center">Prediction Weights</p>
                  <div className="space-y-5">
                     {displayTop3.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                           <div className="w-28 truncate text-sm font-bold text-slate-300">{item.name}</div>
                           <div className="flex-grow h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                           </div>
                           <div className="w-10 text-right text-sm font-black text-white">{item.value.toFixed(0)}%</div>
                        </div>
                     ))}
                  </div>
                </div>
            </div>

            {/* Breed Info Card */}
            <div className="lg:col-span-7 glass-morphism rounded-[2.5rem] p-10 border-white/5">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20"><Info className="text-emerald-400" size={24} /></div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Characteristics & Context</h2>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Species Type</p><p className="text-lg font-bold text-emerald-50">{result.metadata?.type || 'Cattle/Livestock'}</p></div>
                        <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Origin</p><p className="text-lg font-bold text-emerald-50">{result.metadata?.origin}</p></div>
                        <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Lactation Potential</p><p className="text-lg font-bold text-emerald-50">{result.metadata?.milkProduction}</p></div>
                    </div>
                </div>
                <div className="mt-10 p-6 bg-emerald-500/5 rounded-3xl border-l-4 border-emerald-500">
                    <p className="text-slate-300 italic text-lg font-medium">"{result.metadata?.description}"</p>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ID Card Modal */}
      {showIDCard && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-md relative">
                 <button onClick={() => setShowIDCard(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
                 <div id="buffalo-id-card" className="bg-gradient-to-br from-emerald-600 to-teal-800 p-6 rounded-2xl text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                     <h2 className="text-2xl font-black mb-1 uppercase tracking-widest text-emerald-100">Cattle ID Card</h2>
                     <p className="text-xs font-medium text-emerald-200 mb-6 border-b border-emerald-400/30 pb-4">Digital Recognition Registry</p>
                     
                     <div className="flex justify-between items-end">
                         <div>
                             <p className="text-sm text-emerald-200 uppercase tracking-widest mb-1 font-semibold">Primary Breed</p>
                             <p className="text-3xl font-black mb-4">{result.prediction}</p>
                             <p className="text-xs mb-1">Scanned: {new Date().toLocaleDateString()}</p>
                             <p className="text-xs text-emerald-300">Confidence: {confidenceValue.toFixed(1)}%</p>
                         </div>
                         <div className="bg-white p-2 rounded-xl">
                             <QRCodeSVG value={`https://buffalo-ai.app/verify/${Date.now()}`} size={80} />
                         </div>
                     </div>
                 </div>
                 <button onClick={() => {
                     const opt = { margin: 0, filename: 'Cattle_ID.pdf', image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 3 }};
                     html2pdf().set(opt).from(document.getElementById('buffalo-id-card')).save();
                 }} className="mt-6 w-full btn-primary py-3">Download Digital ID</button>
             </div>
         </div>
      )}

      {/* Calculator Modal */}
      {showMilkCalc && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-md relative">
                 <button onClick={() => setShowMilkCalc(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
                 <h2 className="text-2xl font-black mb-6 text-white">Profitability <span className="text-blue-500">Calculator</span></h2>
                 
                 <div className="space-y-4 mb-8">
                     <div>
                         <label className="text-xs font-bold text-slate-400 uppercase">Age (Years)</label>
                         <input type="number" value={milkStats.age} onChange={e => setMilkStats({...milkStats, age: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 mt-1 text-white" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-slate-400 uppercase">Milk Price (₹/Liter)</label>
                         <input type="number" value={milkStats.price} onChange={e => setMilkStats({...milkStats, price: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 mt-1 text-white" />
                     </div>
                     <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                         <p className="text-xs font-bold text-blue-400 uppercase mb-2">Estimated Yield</p>
                         <p className="text-2xl font-black text-white">~{Math.floor((result.prediction === 'Murrah' ? 14 : 9) * (milkStats.age > 3 ? 1 : 0.8))} L/Day</p>
                         <p className="text-sm mt-2 text-slate-300">Est. Income: <span className="text-emerald-400 font-bold">₹{Math.floor((result.prediction === 'Murrah' ? 14 : 9) * milkStats.price * 30)}/month</span></p>
                     </div>
                 </div>
             </div>
         </div>
      )}

    </div>
  );
};

export default Dashboard;
