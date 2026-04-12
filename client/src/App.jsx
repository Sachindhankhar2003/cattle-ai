import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import Encyclopedia from './pages/Encyclopedia';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
    </div>
  );

  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300">
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
        {!isAuthPage && <Navbar user={user} logout={logout} />}
        <div className={!isAuthPage ? "container mx-auto px-4 mt-8 pb-12" : ""}>
          <Routes>
            <Route path="/login" element={!user ? <Login login={login} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register login={login} /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
            <Route path="/encyclopedia" element={user ? <Encyclopedia /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
