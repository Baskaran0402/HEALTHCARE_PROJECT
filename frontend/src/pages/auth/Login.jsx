import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../lib/api/auth';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import './AuthStyles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      
      const user = await authService.getMe();
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('authChange'));
      
      if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (user.role === 'org_admin' || user.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Your account is pending administrator approval. Please contact your organization.');
      } else {
        setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <header className="auth-header">
            <div className="auth-logo-wrapper">
               <div className="auth-logo">AI</div>
            </div>
            <h1 className="auth-title">Organization Portal</h1>
            <p className="auth-subtitle">Enterprise Access Management</p>
          </header>
          
          <form onSubmit={handleLogin} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            
            <div className="auth-group">
              <label className="auth-label">Work Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="auth-input"
                  placeholder="name@svce.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="auth-group">
              <label className="auth-label">Password</label>
              <input
                type="password"
                required
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="auth-meta">
               <label className="auth-checkbox">
                  <input type="checkbox" />
                  Remember me
               </label>
               <a href="#" className="auth-link">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Authenticating...</>
              ) : (
                <>Secure Login <ArrowRight size={18} /></>
              )}
            </button>
            
            <footer className="auth-footer">
              <p className="auth-footer-text">
                Not part of an organization?{' '}
                <Link to="/register" className="auth-link">Create Account</Link>
              </p>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
