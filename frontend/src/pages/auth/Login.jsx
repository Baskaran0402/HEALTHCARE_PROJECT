import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../lib/api/auth';

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
      
      // Get user info to redirect based on role
      const user = await authService.getMe();
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (user.role === 'patient') {
        navigate('/records/' + user.id);
      } else if (user.role === 'org_admin') {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              <span className="text-white font-black text-xl uppercase tracking-widest">SVCE</span>
            </div>
          </div>
          <h1 className="text-2xl font-black font-heading uppercase tracking-tight">Organization Portal</h1>
          <p className="mt-2 text-slate-400 text-xs font-bold uppercase tracking-widest">Healthcare Access Management</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm border border-amber-100 font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 font-medium"
                placeholder="you@svce.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs font-bold px-1">
             <label className="flex items-center gap-2 text-slate-500">
                <input type="checkbox" className="rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
                Remember me
             </label>
             <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all uppercase tracking-widest text-sm ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
          
          <div className="pt-4 text-center border-t border-slate-50">
            <p className="text-xs font-bold text-slate-500">
              Not part of an organization?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Create Individual Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
