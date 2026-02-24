import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../lib/api/auth';
import { User, Mail, Lock, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import './AuthStyles.css';

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
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: '560px' }}>
        <div className="auth-card">
          <header className="auth-header">
            <div className="auth-logo-wrapper">
               <div className="auth-logo">AI</div>
            </div>
            <h1 className="auth-title">Access Gate</h1>
            <p className="auth-subtitle">Clinical Onboarding Portal</p>
          </header>
          
          <form onSubmit={handleRegister} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-restriction">
               <span className="restriction-tag">Clinical Governance</span>
               <p className="restriction-text">
                  Onboarding restricted to <strong>@svce.ac.in</strong> domains. 
                  Practitioner credentials require manual verification by clinical directors.
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="auth-group">
                <label className="auth-label">First Name</label>
                <input
                  name="first_name"
                  type="text"
                  required
                  className="auth-input"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">Last Name</label>
                <input
                  name="last_name"
                  type="text"
                  required
                  className="auth-input"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-group">
              <label className="auth-label">Identity / Username</label>
              <input
                name="username"
                type="text"
                required
                className="auth-input"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            <div className="auth-group">
              <label className="auth-label">Clinical Email</label>
              <input
                name="email"
                type="email"
                required
                className="auth-input"
                placeholder="rollno@svce.ac.in"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="auth-group">
              <label className="auth-label">Secure Access Key</label>
              <input
                name="password"
                type="password"
                required
                minLength="8"
                className="auth-input"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div className="auth-group">
              <label className="auth-label">Onboarding Role</label>
              <select
                name="role"
                className="auth-input"
                style={{ appearance: 'auto' }}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="patient">General Patient</option>
                <option value="doctor">Medical Physician</option>
                <option value="nurse">Clinical Staff</option>
                <option value="researcher">Medical Researcher</option>
              </select>
            </div>
            
            <button type="submit" disabled={loading} className="auth-button" style={{ marginTop: '1.5rem' }}>
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Provisioning...</>
              ) : (
                <>Request Access <ArrowRight size={18} /></>
              )}
            </button>
            
            <footer className="auth-footer">
              <p className="auth-footer-text">
                Already registered?{' '}
                <Link to="/login" className="auth-link">Sign In</Link>
              </p>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
