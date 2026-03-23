import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, LogIn, ChevronRight, Fingerprint, Lock, 
  Mail, User, ArrowRight, Dna, Activity, CheckCircle2,
  Globe, Shield, Zap
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, Badge } from './ui/Card';

export function AuthGate({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateDomain = (email) => {
    const normalizedEmail = email.toLowerCase();
    return normalizedEmail.endsWith('@svce.ac.in') || normalizedEmail === 'baskarseenu2005@gmail.com';
  };

  const login = useGoogleLogin({
    flow: 'implicit',
    prompt: 'select_account',
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError('');
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        if (validateDomain(userInfo.data.email)) {
          const userData = {
            id: userInfo.data.sub,
            username: userInfo.data.name,
            email: userInfo.data.email,
            role: 'patient',
            organization: 'SVCE'
          };
          localStorage.setItem('user', JSON.stringify(userData));
          onAuthSuccess();
        } else {
          setError('Organizational Restriction: Only @svce.ac.in accounts are permitted access.');
        }
      } catch (err) {
        setError('Authentication Failed: Could not connect to Google Identity Platform.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('Handshake Interrupted: Google authentication was cancelled.')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validateDomain(email)) {
      setError('Access Restricted: SVCE organizational credentials required.');
      return;
    }
    // Simulate auth success
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen flex font-body bg-white overflow-hidden">
      {/* Left Content Column */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-40 relative z-10 bg-white">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-md w-full"
         >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
               <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-xl shadow-violet-600/20">
                  <Activity size={24} />
               </div>
               <span className="text-2xl font-bold tracking-tighter font-display">AruviAI</span>
            </div>

            <div className="mb-10">
               <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 font-display">
                  {isLogin ? "Welcome back." : "Initialize Account."}
               </h1>
               <p className="text-gray-500 font-medium">
                  {isLogin ? "Authenticate your node and resume stratified diagnostics." : "Join the decentralized clinical intelligence protocol."}
               </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3"
              >
                 <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                 <p className="text-sm font-bold text-red-700 leading-tight">{error}</p>
              </motion.div>
            )}

            {/* Google Authentication */}
            <Button 
              variant="secondary" 
              className="w-full h-12 rounded-2xl border-gray-200 hover:border-violet-300 mb-8"
              onClick={() => login()}
              isLoading={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLoading ? "Synchronizing..." : "Continue with Google Identity"}
            </Button>

            <div className="flex items-center gap-4 mb-8">
               <div className="flex-1 h-px bg-gray-100" />
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Proprietary Uplink</span>
               <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Standard Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
               {!isLogin && (
                 <Input label="Protocol Operator Name" placeholder="Dr. Alexander Wright" required />
               )}
               <Input 
                 label="Institutional Email (@svce.ac.in)" 
                 placeholder="name@svce.ac.in" 
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required 
               />
               <Input 
                 label="Master Passphrase" 
                 type="password" 
                 placeholder="••••••••••••"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required 
               />
               
               <Button type="submit" variant="primary" className="w-full h-12 rounded-2xl text-base shadow-lg shadow-violet-600/30">
                  {isLogin ? "Authenticate Node" : "Request Institutional Access"} <ArrowRight size={18} className="ml-2" />
               </Button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
               <p className="text-gray-500 text-sm font-medium mb-4">
                  {isLogin ? "New investigator?" : "Already possess an active node?"}
               </p>
               <button 
                 onClick={() => setIsLogin(!isLogin)}
                 className="text-violet-600 font-bold hover:text-violet-700 transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2 mx-auto"
               >
                  {isLogin ? "Request Node Access" : "Return to Uplink Interface"}
                  <ChevronRight size={14} />
               </button>
            </div>
         </motion.div>

         {/* Trust Footer */}
         <div className="mt-24 flex items-center gap-10 opacity-30 grayscale pointer-events-none">
            <div className="flex items-center gap-2">
               <ShieldCheck size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">ISO 27001 Certification</span>
            </div>
            <div className="flex items-center gap-2">
               <Fingerprint size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">Biometric Encrypted</span>
            </div>
         </div>
      </div>

      {/* Right Visualization Column (Enterprise Brand Display) */}
      <div className="hidden lg:flex flex-1 bg-gray-50 relative overflow-hidden flex-col justify-center items-center p-20">
         {/* Abstract Background Design */}
         <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-100 rounded-full blur-[120px] opacity-40" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
               backgroundImage: 'radial-gradient(#4f46e5 1.5px, transparent 0)',
               backgroundSize: '40px 40px'
            }} />
         </div>

         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="relative z-10 w-full max-w-lg"
         >
            <Card noPadding className="shadow-2xl border-white/50 backdrop-blur-sm bg-white/80">
               <div className="p-10 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white">
                        <Dna size={28} className="animate-pulse" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-gray-900 font-display italic">Project Overwatch</h3>
                        <p className="text-xs font-bold text-violet-600 uppercase tracking-[0.2em]">Next-Gen Diagnostic OS</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     {[
                        { label: 'Neural Precision', value: '99.98%', icon: Zap },
                        { label: 'Network Latency', value: '< 1ms', icon: Globe },
                        { label: 'Secure Lattice', value: 'E2EE Active', icon: Shield },
                     ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2">
                           <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                              <item.icon size={16} /> {item.label}
                           </div>
                           <Badge variant="primary">{item.value}</Badge>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="p-10">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">Quantifying the future of healthcare intelligence.</h4>
                  <p className="text-gray-500 leading-relaxed mb-6">
                     Deploy high-precision diagnostic nodes across your institution with AruviAI Enterprise OS. Integrated security, infinite scale.
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-4">
                        {[1,2,3,4].map(n => (
                           <div key={n} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                              <img src={`https://i.pravatar.cc/100?u=${n}`} alt="User" />
                           </div>
                        ))}
                     </div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">+582 Investigators Live</p>
                  </div>
               </div>
            </Card>

            {/* Floating Accents */}
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-[-40px] right-[-40px] w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-gray-100"
            >
               <CheckCircle2 size={32} className="text-emerald-500" />
            </motion.div>
         </motion.div>
      </div>
    </div>
  );
}
