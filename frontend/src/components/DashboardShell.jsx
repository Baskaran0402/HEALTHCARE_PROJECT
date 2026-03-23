import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Database, 
  Pill, 
  Stethoscope, 
  Phone, 
  AlertTriangle, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck,
  Activity,
  LogOut,
  Settings,
  ChevronDown,
  Dna,
  Heart
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function DashboardShell({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex font-inter selection:bg-[#000DB5]/10">
      {/* Benchling-Style Navy Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || !isMobile) && (
          <motion.aside 
            initial={isMobile ? { x: -300 } : { width: 300 }}
            animate={isMobile ? { x: 0 } : { width: 300 }}
            exit={isMobile ? { x: -300 } : { width: 0 }}
            className={`fixed lg:relative z-50 h-screen bg-[#000650] text-white flex flex-col shadow-2xl shrink-0 overflow-hidden border-r border-white/10`}
          >
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 rounded-lg bg-[#000DB5] flex items-center justify-center text-white">
                  <Dna size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight font-outfit">AruviAI</h2>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Clinical Protocol</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
              <SidebarItem 
                icon={<LayoutDashboard size={20}/>} 
                label="Health Overview" 
                active={location.pathname === '/patient/dashboard'} 
                onClick={() => {navigate('/patient/dashboard'); if(isMobile) setSidebarOpen(false);}} 
              />
              <SidebarItem 
                icon={<Calendar size={20}/>} 
                label="Appointments" 
                onClick={() => {if(isMobile) setSidebarOpen(false);}}
              />
              <SidebarItem 
                icon={<Database size={20}/>} 
                label="Medical Vault" 
                active={location.pathname.startsWith('/records')}
                onClick={() => {navigate(`/records/${user?.id || 'default'}`); if(isMobile) setSidebarOpen(false);}} 
              />
              <SidebarItem 
                icon={<Pill size={20}/>} 
                label="Medications" 
                onClick={() => {if(isMobile) setSidebarOpen(false);}}
              />
              <SidebarItem 
                icon={<Stethoscope size={20}/>} 
                label="Find Doctors" 
                active={location.pathname === '/find-doctors'}
                onClick={() => {navigate('/find-doctors'); if(isMobile) setSidebarOpen(false);}} 
              />
              <SidebarItem 
                icon={<Phone size={20}/>} 
                label="Telemedicine" 
                onClick={() => {if(isMobile) setSidebarOpen(false);}}
              />
              
              <div className="pt-8 border-t border-white/10 mt-8 mx-4">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Support & SOS</p>
                <SidebarItem 
                  icon={<AlertTriangle size={20}/>} 
                  label="Emergency SOS" 
                  critical
                  onClick={() => {if(isMobile) setSidebarOpen(false);}}
                />
                <SidebarItem icon={<Settings size={20}/>} label="Config" onClick={() => {}} />
              </div>
            </nav>

            <div className="p-6 border-t border-white/10">
              <div className="mb-6 px-4">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">Encryption Active</span>
                    <ShieldCheck size={14} className="text-[#38A169]" />
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[100%] h-full bg-[#000DB5]" />
                 </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-sm font-semibold transition-all group"
              >
                <LogOut size={18} className="text-white/40 group-hover:text-white" />
                <span>Terminate Link</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* Header Stream */}
        <header className="h-20 border-b border-[#E1EBF9] bg-white flex items-center justify-between px-8 shrink-0 relative z-40">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-[#718096] hover:text-[#000DB5] transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="relative group hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718096]" size={18} />
                <input
                  className="bg-[#F0F6FE] border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium text-[#000650] placeholder:text-[#718096]/50 w-full md:w-80 focus:ring-2 focus:ring-[#000DB5]/10 outline-none transition-all"
                  placeholder="Query medical records..."
                />
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 mr-4">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                       <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-[#718096]`}>
                          {String.fromCharCode(64 + i)}
                       </div>
                    ))}
                 </div>
                 <span className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-3">Online Nodes</span>
              </div>
              
              <div className="flex items-center gap-3 text-[#718096]">
                <button className="p-2 hover:bg-[#F0F6FE] rounded-lg relative transition-colors">
                   <Bell size={20} />
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E53E3E]" />
                </button>
              </div>
              
              <div className="h-8 w-px bg-[#E1EBF9]" />
              
              <div className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-[#F0F6FE] transition-colors cursor-pointer group">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#000650] leading-none mb-1">{user?.name || 'Subject 342'}</p>
                    <p className="text-[10px] font-bold text-[#000DB5] uppercase tracking-widest">Protocol Type: P1</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#000DB5] text-white flex items-center justify-center font-bold shadow-lg shadow-[#000DB5]/20">
                    {user?.name?.substring(0,1) || 'S'}
                 </div>
                 <ChevronDown size={16} className="text-[#718096] group-hover:text-[#000DB5] transition-colors" />
              </div>
           </div>
        </header>

        {/* Surface Execution Layer */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#F0F6FE]/20 custom-scrollbar">
           <div className="max-w-7xl mx-auto pb-20">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, critical }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all group
        ${active 
          ? 'bg-[#000DB5] text-white shadow-lg shadow-[#000DB5]/20' 
          : 'text-white/50 hover:bg-white/5 hover:text-white/80'}
        ${critical ? 'hover:bg-red-500/20 hover:text-red-400' : ''}`}
    >
      <div className={`transition-all ${active ? 'text-white' : 'text-white/40 group-hover:text-white'} ${critical ? 'text-red-500/60' : ''}`}>
         {icon}
      </div>
      <span className="text-sm font-semibold tracking-tight">{label}</span>
      {active && (
         <div className="ml-auto w-1 h-4 rounded-full bg-white opacity-40" />
      )}
    </button>
  );
}
