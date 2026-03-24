import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, ShieldCheck, ArrowRight, Lock, Key, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useToast } from '../../components/ui/Toast';
import { 
  ClinicalCard, 
  ClinicalBadge, 
  ClinicalInput 
} from '../../components/ClinicalComponents';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [errorLocal, setErrorLocal] = useState('');

    const { login, googleLogin, isLoading, error: authError } = useAuthStore();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const user = await googleLogin(credentialResponse.credential);
            addToast(`Authenticated via Google. Welcome back!`, 'success');
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (err) {
            setErrorLocal(err.message || 'Google Login failed.');
        }
    };

    const handleGoogleError = () => {
        setErrorLocal('Google Login was unsuccessful. Try again.');
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (captcha.trim() !== '8') {
            setErrorLocal('Captcha answer is incorrect. Hint: 5 + 3 = ?');
            return;
        }
        setErrorLocal('');
        try {
            const user = await login(email, password);
            addToast(`Welcome back! Secure link established.`, 'success');
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
            
        } catch (err) {
            if (err?.response?.status === 403) setErrorLocal('Your account is pending administrator approval.');
            else setErrorLocal(err.message || 'Login failed. Please check your credentials.');
        }
    };

    const displayError = errorLocal || authError;

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
                         <span className="text-xl font-black font-syne text-slate-900 tracking-tight">AruviAI.</span>
                      </div>
                      <h1 className="text-5xl md:text-6xl font-black font-syne text-slate-900 tracking-tighter leading-tight">
                        Clinical <br /> <span className="text-teal-600">Gatekeeper.</span>
                      </h1>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-md font-dm">
                        Institutional access point for the AruviAI clinical intelligence lattice. Secure biometric and cryptographic verification active.
                      </p>
                   </div>

                   <div className="space-y-8">
                      <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-subtle group hover:shadow-premium transition-all">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                               <Key size={18} />
                            </div>
                            <div>
                               <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1 font-dm">E2EE Verified</h4>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-dm">End-to-end institutional tunnels</p>
                            </div>
                         </div>
                      </div>
                      <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-subtle group hover:shadow-premium transition-all">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                               <Lock size={18} />
                            </div>
                            <div>
                               <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1 font-dm">Zero-Trust Protocol</h4>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-dm">Continuous credential validation</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Form Side */}
                <div className="lg:col-span-7">
                   <ClinicalCard className="p-10 md:p-16 border-teal-500/10 shadow-premium relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                         <Key size={120} className="text-teal-600" />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
                        <div>
                          <ClinicalBadge variant="neutral">Secure Authentication</ClinicalBadge>
                          <h2 className="text-3xl font-black font-syne text-slate-900 mt-4 tracking-tight">Access Portal</h2>
                        </div>
                        <div className="px-5 py-2.5 rounded-2xl bg-white border border-slate-100 flex items-center gap-3 shadow-subtle">
                           <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-dm">Auth-Node Live</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {displayError && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="flex items-center gap-3 p-5 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest bg-red-50 border border-red-100 text-red-500 relative z-10 font-dm"
                            >
                                <AlertCircle size={16} />
                                <span>{displayError}</span>
                            </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                          <ClinicalInput 
                            label="Nodal Identifier"
                            type="email"
                            placeholder="your.email@institution.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                          />

                          <div className="space-y-4">
                             <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-dm">Access Token</label>
                                <button type="button" onClick={() => setShowPw(!showPw)} className="text-[9px] font-black text-teal-600 uppercase tracking-[0.2em] hover:text-teal-700 transition-colors font-dm">
                                   {showPw ? 'Obfuscate' : 'Reveal'}
                                </button>
                             </div>
                             <input 
                                type={showPw ? 'text' : 'password'} 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter Access Key"
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold tracking-widest px-5 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5 transition-all font-dm"
                                required
                             />
                          </div>

                          <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                             <div>
                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-1 font-dm">Humanity Check</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-dm">Index Challenge: 5 + 3 = ?</p>
                             </div>
                             <input 
                                type="text" 
                                placeholder="Result" 
                                value={captcha} 
                                onChange={e => setCaptcha(e.target.value)}
                                className="w-full md:w-32 h-12 bg-white border border-slate-200 rounded-xl text-center text-sm font-black tracking-widest outline-none focus:border-teal-500 transition-all font-dm"
                             />
                          </div>

                           <div className="pt-6">
                             <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full h-16 bg-teal-600 text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-2xl flex items-center justify-center gap-4 shadow-glow hover:bg-teal-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group font-dm"
                             >
                                {isLoading ? (
                                   <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                   <>
                                      Sign In Portal
                                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                   </>
                                )}
                             </button>
                             
                             <div className="mt-8 flex flex-col items-center gap-4">
                               <div className="w-full flex items-center gap-4">
                                 <div className="h-px bg-slate-100 flex-1"></div>
                                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest font-dm">or continue with</span>
                                 <div className="h-px bg-slate-100 flex-1"></div>
                               </div>
                               
                               <div className="w-full flex justify-center">
                                 <GoogleLogin 
                                   onSuccess={handleGoogleSuccess}
                                   onError={handleGoogleError}
                                   theme="outline"
                                   size="large"
                                   shape="pill"
                                   text="signin_with"
                                   width="350"
                                 />
                               </div>
                             </div>

                             <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 px-2">
                                <Link to="/register" className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-700 transition-colors font-dm">
                                   New subject? Create identity →
                                </Link>
                                <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors font-dm">
                                   Reset Access Key
                                </a>
                             </div>
                          </div>
                      </form>

                      <div className="mt-16 pt-10 border-t border-slate-50 flex flex-wrap items-center justify-center gap-10 relative z-10">
                         <div className="flex items-center gap-2 opacity-30 grayscale saturate-0">
                            <ShieldCheck size={14} />
                            <span className="text-[8px] font-black uppercase tracking-widest font-dm">ISO 27001</span>
                         </div>
                         <div className="flex items-center gap-2 opacity-30 grayscale saturate-0">
                            <Lock size={14} />
                            <span className="text-[8px] font-black uppercase tracking-widest font-dm">E2EE Verified</span>
                         </div>
                         <div className="flex items-center gap-2 opacity-30 grayscale saturate-0">
                            <Key size={14} />
                            <span className="text-[8px] font-black uppercase tracking-widest font-dm">FIPS 140-2</span>
                         </div>
                      </div>
                   </ClinicalCard>
                </div>
            </div>
        </div>
    );
};

export default Login;
