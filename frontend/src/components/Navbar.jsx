import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Shield, Activity } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);
    
    // Initial load
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'doctor') return '/doctor/dashboard';
    if (user.role === 'patient') return '/patient/dashboard';
    if (user.role === 'super_admin' || user.role === 'org_admin') return '/admin/dashboard';
    return '/';
  };

  return (
    <nav className="enterprise-nav glass">
      <div className="nav-container">
        <Link to="/" className="logo-section">
          <div className="logo-icon">AI</div>
          <span className="logo-text">CarePortal <span className="text-primary">Enterprise</span></span>
        </Link>
        
        <div className="nav-links">
           <Link to="/demo" className="nav-link">Platform</Link>
           <Link to="/find-doctors" className="nav-link">Network</Link>
           
           {user ? (
             <div className="auth-profile-section">
                <Link to={getDashboardLink()} className="nav-dashboard-btn">
                   <LayoutDashboard size={18} />
                   <span>Dashboard</span>
                </Link>
                <div className="user-dropdown">
                   <div className="user-avatar-small">
                      {user.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
                   </div>
                   <div className="dropdown-menu">
                      <div className="dropdown-header">
                         <p className="font-black text-slate-800">{user.username}</p>
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest">{user.role}</p>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item text-danger">
                         <LogOut size={16} />
                         <span>Sign Out</span>
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <>
                <button onClick={() => navigate('/login')} className="btn-secondary">Sign In</button>
                <button onClick={() => navigate('/register')} className="btn-primary">Get Started</button>
             </>
           )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
