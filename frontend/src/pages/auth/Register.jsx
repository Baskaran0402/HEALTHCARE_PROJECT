import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../lib/api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'patient',
    organization_id: null
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
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-black font-heading uppercase tracking-tight">Access Gate</h1>
          <p className="mt-2 text-blue-100 text-xs font-bold uppercase tracking-widest">Register for Organization Access</p>
        </div>
        
        <form onSubmit={handleRegister} className="p-8 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Organization Restriction</p>
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              Currently accepting registrations only from <strong>@svce.ac.in</strong> domains. 
              Doctors and staff require manual approval after registration.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
              <input
                name="first_name"
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
              <input
                name="last_name"
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input
              name="username"
              type="text"
              required
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (@svce.ac.in)</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
              placeholder="e.g. rollno@svce.ac.in"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
            <input
              name="password"
              type="password"
              required
              minLength="8"
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
            <select
              name="role"
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 font-bold"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="patient">Patient (Auto-Approved)</option>
              <option value="doctor">Medical Doctor (Needs Admin Review)</option>
              <option value="nurse">Medical Staff/Nurse (Needs Admin Review)</option>
              <option value="researcher">Clinical Researcher</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-6 rounded-2xl font-black text-white shadow-xl transition-all uppercase tracking-widest text-sm ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Processing Request...' : 'Initialize Account'}
          </button>
          
          <div className="text-center text-[10px] font-black text-slate-400 uppercase pt-4 border-t border-slate-50 space-y-2">
            <p>
              Already verified?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
