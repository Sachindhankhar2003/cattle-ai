import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ChevronRight, Search, Filter } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/prediction/history', {
          headers: { 'x-auth-token': token }
        });
        
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = [];
          console.error('Expected JSON, got text:', text);
        }

        if (response.ok) {
          setHistory(data);
        }
      } catch (err) {
        console.error('History fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Prediction History</h1>
          <p className="text-slate-400 mt-1">Review all your previous cattle analysis</p>
        </div>
        
        <div className="flex space-x-3">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search breeds..." 
                    className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                />
            </div>
            <button className="bg-slate-900 border border-slate-700 p-2 rounded-lg hover:border-slate-500 transition-colors">
                <Filter size={18} className="text-slate-400" />
            </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass-morphism rounded-3xl p-12 text-center border-dashed border-2 border-slate-800">
          <p className="text-slate-400">No predictions yet. Head to the dashboard to scan your first cattle!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, idx) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-morphism group rounded-3xl overflow-hidden hover:bg-slate-800/50 transition-all border border-white/5 flex flex-col"
            >
              <div className="w-full h-48 overflow-hidden relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.breed} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-lg">
                  {Number(item.confidence || 0) * 100 > 0 ? (Number(item.confidence) * 100).toFixed(0) : 'NaN'}% Match
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-black mb-2 text-white">{item.breed}</h3>
                    <div className="flex flex-col space-y-2 text-xs font-semibold text-slate-400 mb-4">
                        <div className="flex items-center space-x-2">
                            <Calendar size={14} className="text-emerald-500" />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Tag size={14} className="text-emerald-500" />
                            <span>{item.metadata?.origin || 'Indian Cattle'}</span>
                        </div>
                    </div>
                </div>
                
                <button className="w-full py-3 bg-white/5 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors text-slate-300 font-bold text-sm tracking-wide mt-2">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
