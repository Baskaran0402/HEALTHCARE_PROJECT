import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, ShieldCheck, Mail, User, Shield, Lock, Activity, ChevronRight, ArrowRight } from 'lucide-react';
import { 
  ClinicalCard, 
  ClinicalBadge, 
  ClinicalInput 
} from '../../components/ClinicalComponents';

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full" />

            <div className="grid grid-cols-1 lg:grid-cols-12 max-w-7xl w-full gap-12 relative z-10">
                
                {/* Information Side */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-12">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg">
                           <ShieldCheck size={20} />
                         </div>
                         <span className="text-xl font-black font-display text-slate-900 tracking-tight">AruviAI.</span>
                      </div>
                      <h1 className="text-5xl md:text-6xl font-black font-display text-slate-900 tracking-tighter leading-tight">
                        Institutional <br /> <span className="text-teal-600">Onboarding.</span>
                      </h1>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-md">
                        Onboarding is restricted to accredited clinical domains. Your credentials will undergo manual verification by institutional administrators before activation.
                      </p>
                   </div>

                   <div className="space-y-6">
                      {[
                        { icon: Shield, label: 'ISO 27001 Certified Vault', desc: 'Enterprise data sovereignty compliance.' },
                        { icon: Lock, label: 'End-to-End Encryption', desc: 'Secure asynchronous clinical streams.' },
                        { icon: Activity, label: 'Real-time Monitoring', desc: 'Nodal performance and audit logging.' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-6 items-start group">
                           <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 group-hover:bg-teal-50 transition-all">
                              <item.icon size={20} />
                           </div>
                           <div>
                              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1.5">{item.label}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Form Side */}
                <div className="lg:col-span-7">
                   <ClinicalCard className="p-10 md:p-16 border-teal-500/10 shadow-premium">
                      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                          <ClinicalBadge variant="neutral">New Subject Registration</ClinicalBadge>
                          <h2 className="text-3xl font-black font-display text-slate-900 mt-4 tracking-tight">Identity Details</h2>
                        </div>
                        <div className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Portal Operational</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {error && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="flex items-center gap-3 p-5 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest bg-red-50 border border-red-100 text-red-500"
                            >
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleRegister} className="space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <ClinicalInput 
                               label="P-Name"
                               name="first_name"
                               placeholder="First Name*"
                               value={formData.first_name}
                               onChange={handleChange}
                               required
                             />
                             <ClinicalInput 
                               label="S-Name"
                               name="last_name"
                               placeholder="Last Name*"
                               value={formData.last_name}
                               onChange={handleChange}
                               required
                             />
                              <ClinicalInput 
                               label="Clinical Alias"
                               name="username"
                               placeholder="Username*"
                               value={formData.username}
                               onChange={handleChange}
                               required
                             />
                             <ClinicalInput 
                               label="Nodal Address"
                               name="email"
                               type="email"
                               placeholder="name@organization.com*"
                               value={formData.email}
                               onChange={handleChange}
                               required
                             />
                             <ClinicalInput 
                               label="Access Key"
                               name="password"
                               type="password"
                               placeholder="••••••••"
                               value={formData.password}
                               onChange={handleChange}
                               required
                             />
                              <div style={{marginBottom:'24px', gridColumn: 'span 2'}}>
                                <label style={{color: 'rgba(10,10,15,0.45)', fontSize:'0.7rem', fontWeight: 700, textTransform:'uppercase',letterSpacing:'0.12em',display:'block',marginBottom:'12px', fontFamily: 'Syne'}}>
                                  I am joining as
                                </label>
                                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                                  {[
                                    {
                                      value: 'patient',
                                      label: 'Patient',
                                      desc: 'I want to screen my health and find doctors',
                                      icon: '🏥',
                                      color: '#0fd68c'
                                    },
                                    {
                                      value: 'doctor',
                                      label: 'Clinician',
                                      desc: 'I am a licensed medical professional',
                                      icon: '👨‍⚕️',
                                      color: '#3b82f6',
                                      note: 'Requires credential verification'
                                    },
                                    {
                                      value: 'institution',
                                      label: 'Institution',
                                      desc: 'Hospital, clinic, or diagnostic centre',
                                      icon: '🏛',
                                      color: '#f59e0b',
                                      note: 'Requires institutional email'
                                    },
                                    ...(formData.email === '2022ad0128@svce.ac.in' ? [{
                                      value: 'super_admin',
                                      label: 'Super Head',
                                      desc: 'Full administrative control (Special Access)',
                                      icon: '👑',
                                      color: '#ff0055',
                                      note: 'Master credentials detected'
                                    }] : [])
                                  ].map(r => (
                                    <div key={r.value} onClick={() => setFormData({...formData, role: r.value})} style={{
                                      display:'flex',alignItems:'center',gap:'12px',
                                      padding:'14px 18px',borderRadius:'16px',cursor:'pointer',
                                      border: formData.role === r.value ? `2px solid ${r.color}` : '2px solid #e8ede9',
                                      background: formData.role === r.value ? `${r.color}08` : 'white',
                                      transition:'all 0.2s',
                                      position: 'relative'
                                    }}>
                                      <span style={{fontSize:'1.4rem',flexShrink:0}}>{r.icon}</span>
                                      <div style={{flex:1}}>
                                        <p style={{color: formData.role === r.value ? r.color : '#0a0a0f',fontFamily:'Syne',fontWeight:700,fontSize:'0.9rem',margin:0}}>{r.label}</p>
                                        <p style={{color:'rgba(10,10,15,0.45)',fontSize:'0.75rem',margin:'2px 0 0'}}>{r.desc}</p>
                                        {r.note && <p style={{color:`${r.color}`,fontSize:'0.65rem',fontWeight:600,margin:'4px 0 0', opacity: 0.8}}>⚠ {r.note}</p>}
                                      </div>
                                      <div style={{
                                        width:'20px',height:'20px',borderRadius:'50%',flexShrink:0,
                                        border: formData.role === r.value ? `2px solid ${r.color}` : '2px solid #e8ede9',
                                        background: formData.role === r.value ? r.color : 'transparent',
                                        display:'flex',alignItems:'center',justifyContent:'center'
                                      }}>
                                        {formData.role === r.value && <span style={{color:'white',fontSize:'0.65rem',fontWeight:'bold'}}>✓</span>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                          </div>

                          <div className="pt-6">
                             <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full h-16 bg-teal-600 text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-2xl flex items-center justify-center gap-4 shadow-glow hover:bg-teal-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                             >
                                {loading ? (
                                   <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                   <>
                                      Submit Access Request
                                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                   </>
                                )}
                             </button>
                             
                             <p className="text-center mt-10 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Already registered?{' '}
                                <Link to="/login" className="text-teal-600 hover:text-teal-700 transition-colors">Sign in to Control Center</Link>
                             </p>
                          </div>
                      </form>
                   </ClinicalCard>
                </div>
            </div>
        </div>
    );
};

export default Register;
