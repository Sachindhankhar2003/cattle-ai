import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, LogOut, User as UserIcon, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="glass-morphism sticky top-0 z-50 py-4 px-6 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900 p-2 rounded-xl border border-white/10 group-hover:border-emerald-500/50 transition-colors flex items-center justify-center h-full w-full">
              <svg className="w-full h-full text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10C4 10 4 15 12 15C20 15 20 10 20 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 6C7 6 7 4 5 4C3 4 3 8 3 8C3 8 3 10 7 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 6C17 6 17 4 19 4C21 4 21 8 21 8C21 8 21 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                <path d="M12 13V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Cattle<span className="text-emerald-500">AI</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 -mt-1">
              Breed Recognition
            </span>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-all">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">{t('Dashboard')}</span>
              </Link>
              <Link to="/history" className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-all">
                <History size={18} />
                <span className="hidden md:inline">{t('History')}</span>
              </Link>
              <Link to="/encyclopedia" className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                <span className="hidden md:inline">{t('Encyclopedia')}</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 pl-4 md:pl-8 border-l border-white/10">
              <div className="relative group">
                 <button className="flex items-center text-slate-400 hover:text-emerald-400 transition-colors gap-1">
                    <Globe size={18} />
                    <span className="text-xs font-bold uppercase">{i18n.language}</span>
                 </button>
                 <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-700 hover:text-emerald-400 first:rounded-t-xl transition-colors">English</button>
                    <button onClick={() => changeLanguage('hi')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-700 hover:text-emerald-400 transition-colors">हिंदी</button>
                    <button onClick={() => changeLanguage('gu')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-700 hover:text-emerald-400 last:rounded-b-xl transition-colors">ગુજરાતી</button>
                 </div>
              </div>

              <button onClick={() => {
                import('react-hot-toast').then(({ default: toast }) => {
                   toast('Light mode is coming soon, sticking to premium dark mode for now!', { icon: '🌙' });
                });
              }} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              </button>
              <div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <UserIcon size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-100">{user.username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-all">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary group">
              <span>Get Started</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
