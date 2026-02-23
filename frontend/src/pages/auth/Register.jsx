import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../lib/api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold font-heading">Join AI Doctor</h1>
          <p className="mt-2 text-blue-100">Register as a Doctor or Patient</p>
        </div>
        
        <form onSubmit={handleRegister} className="p-8 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input
              name="username"
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength="8"
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">I am a...</label>
            <select
              name="role"
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-lg font-bold text-white shadow-lg transition-all ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <div className="text-center text-sm text-slate-600 uppercase pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
