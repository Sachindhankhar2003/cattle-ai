import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ login }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { msg: text || 'An unexpected error occurred' };
      }

      if (response.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.msg || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection failed. Please ensure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Left Panel: Branding & Logo */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-950">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] pulse-bg"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[120px] pulse-bg" style={{ animationDelay: '2s' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center space-y-8"
        >
          <div className="relative group floating">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-900/50 p-8 rounded-full border border-white/10 backdrop-blur-xl w-48 h-48 flex items-center justify-center">
               <svg width="128" height="128" className="text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10C4 10 4 15 12 15C20 15 20 10 20 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 6C7 6 7 4 5 4C3 4 3 8 3 8C3 8 3 10 7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 6C17 6 17 4 19 4C21 4 21 8 21 8C21 8 21 10 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="12" r="1" fill="currentColor"/>
                <circle cx="15" cy="12" r="1" fill="currentColor"/>
                <path d="M12 13V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight text-white">
              Buffalo<span className="text-emerald-500">AI</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-md leading-relaxed">
              Advancing livestock management through precision breed recognition and AI analysis.
            </p>
          </div>

          <div className="flex items-center space-x-6 pt-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">99%</span>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Accuracy</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">Instant</span>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Results</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950 relative">
        {/* Subtle background for mobile */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-transparent -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-morphism rounded-[2.5rem] p-10 border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                Welcome <span className="text-emerald-500">Back</span>
              </h2>
              <p className="text-slate-400 font-medium">Access your buffalo breed history</p>
            </div>
    
            {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm mb-8 text-center"
                >
                    {error}
                </motion.div>
            )}
    
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        placeholder="name@example.com"
                        className="input-field pl-12"
                        required
                    />
                </div>
              </div>
    
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        placeholder="••••••••"
                        className="input-field pl-12"
                        required
                    />
                </div>
              </div>
    
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-4 rounded-2xl shadow-emerald-500/25 mt-4 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/10 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span className="font-bold tracking-wide">Sign In</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
    
            <div className="mt-10 text-center lg:text-left">
              <p className="text-slate-400 text-sm font-medium">
                Don't have an account? {' '}
                <Link to="/register" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors inline-flex items-center space-x-1 group">
                  <span>Create Account</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
