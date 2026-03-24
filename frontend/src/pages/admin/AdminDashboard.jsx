import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  ShieldCheck, 
  Activity, 
  Search, 
  Settings, 
  LogOut,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  MoreVertical,
  Shield,
  Zap,
  ChevronRight,
  Plus,
  Filter,
  BarChart3,
  Cpu,
  Database,
  Lock,
  FileSearch,
  ChevronDown,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../lib/api/admin';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('governance');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePatients: 0,
    verifiedDoctors: 0,
    orgs: 0
  });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allOrgs, setAllOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, pendingData, usersData, orgsData] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getPendingApprovals(),
        adminService.getAllUsers(),
        adminService.getAllOrganizations()
      ]);
      setStats(statsData);
      setPendingApprovals(pendingData);
      setAllUsers(usersData);
      setAllOrgs(orgsData);
    } catch {
      console.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminService.approveUser(userId);
      setPendingApprovals(prev => prev.filter(u => u.id !== userId));
      const newStats = await adminService.getSystemStats();
      setStats(newStats);
    } catch {
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    try {
      if (window.confirm('Confirm rejection of clinical credentials?')) {
        await adminService.rejectUser(userId);
        setPendingApprovals(prev => prev.filter(u => u.id !== userId));
      }
    } catch {
      alert('Failed to reject user');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F0F6FE]/30 flex font-dm">
      {/* Benchling-Style Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || !isMobile) && (
          <motion.aside 
            initial={isMobile ? { x: -320 } : { width: 320 }}
            animate={isMobile ? { x: 0 } : { width: 320 }}
            exit={isMobile ? { x: -320 } : { width: 0 }}
            className={`fixed lg:relative z-50 h-screen bg-[#000650] text-white flex flex-col shadow-xl shrink-0 overflow-hidden`}
          >
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#000DB5] flex items-center justify-center text-white font-bold text-xl">
                  CP
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight font-syne">AruviAI</h2>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5 font-dm">Admin Protocol</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-1">
              <SidebarItem 
                icon={<ShieldCheck size={20}/>} 
                label="Governance" 
                active={activeTab === 'governance'} 
                onClick={() => {setActiveTab('governance'); if(isMobile) setSidebarOpen(false);}} 
              />
              <SidebarItem 
                icon={<Users size={20}/>} 
                label="Personnel" 
                active={activeTab === 'users'} 
                onClick={() => {setActiveTab('users'); if(isMobile) setSidebarOpen(false);}} 
              />
              <SidebarItem 
                icon={<Building2 size={20}/>} 
                label="Organizations" 
                active={activeTab === 'orgs'} 
                onClick={() => {setActiveTab('orgs'); if(isMobile) setSidebarOpen(false);}} 
              />
              <SidebarItem 
                icon={<BarChart3 size={20}/>} 
                label="Audit Logs" 
                active={activeTab === 'logs'} 
                onClick={() => {setActiveTab('logs'); if(isMobile) setSidebarOpen(false);}} 
              />
              <div className="pt-8 border-t border-white/10 mt-8 mx-4">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Infrastructure</p>
                <SidebarItem icon={<Settings size={20}/>} label="Config" onClick={() => {}} />
                <SidebarItem icon={<Lock size={20}/>} label="Security" onClick={() => {}} />
              </div>
            </nav>

            <div className="p-6 border-t border-white/10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-sm font-semibold transition-all group"
              >
                <LogOut size={18} className="text-white/40 group-hover:text-white" />
                <span>Disconnect Console</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Execution Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* Top Header Bar */}
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
                  className="bg-[#F0F6FE] border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium text-[#000650] placeholder:text-[#718096]/50 w-full md:w-96 focus:ring-2 focus:ring-[#000DB5]/10 outline-none transition-all"
                  placeholder="Universal entity search..."
                />
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-[#718096]">
                <button className="p-2 hover:bg-[#F0F6FE] rounded-lg transition-colors"><Bell size={20} /></button>
                <button onClick={fetchDashboardData} className={`p-2 hover:bg-[#F0F6FE] rounded-lg transition-colors ${loading ? 'animate-spin' : ''}`}><RefreshCw size={20}/></button>
              </div>
              
              <div className="h-8 w-px bg-[#E1EBF9]" />
              
              <div className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-[#F0F6FE] transition-colors cursor-pointer group">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#000650] leading-none mb-1">Root Admin</p>
                    <p className="text-[10px] font-bold text-[#000DB5] uppercase tracking-widest">Protocol Level 4</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#000DB5] text-white flex items-center justify-center font-bold shadow-lg">RA</div>
                 <ChevronDown size={16} className="text-[#718096] group-hover:text-[#000DB5] transition-colors" />
              </div>
           </div>
        </header>

        {/* Dashboard Surface */}
        <div className="flex-1 overflow-y-auto bg-white">
           <div className="dashboard-container">
              <div className="py-12 lg:py-16">
                 <AnimatePresence mode="wait">
                   <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                   >
                      {activeTab === 'governance' && (
                         <>
                            <div className="mb-12 text-center lg:text-left">
                               <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#0fd68c] font-bold mb-3 font-syne">System Control</p>
                               <h1 className="font-syne font-black text-5xl text-[#0a0a0f] tracking-[-0.04em] leading-tight mb-4">
                                  Lattice <span className="text-[#0fd68c]">Governance.</span>
                               </h1>
                               <p className="text-[#0a0a0f]/45 text-base font-dm max-w-2xl leading-relaxed lg:mx-0 mx-auto">
                                  High-fidelity oversight of global diagnostic nodes, practitioner credentials, and protocol compliance across the network.
                               </p>
                            </div>


                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            <StatCard icon={<Users/>} label="Registered Entities" value={stats.totalUsers} trend="+12.4%" />
                            <StatCard icon={<Activity/>} label="Clinical Streams" value={stats.activePatients} trend="+5.2%" />
                            <StatCard icon={<ShieldCheck/>} label="Verified Practitioners" value={stats.verifiedDoctors} trend="+2 New" />
                            <StatCard icon={<Building2/>} label="Connected Clusters" value={stats.orgs} trend="Optimal" />
                         </div>

                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            <div className="lg:col-span-8">
                               <div className="bg-white rounded-[2rem] border border-[#E1EBF9] shadow-sm overflow-hidden">
                                  <div className="px-8 py-8 border-b border-[#E1EBF9] flex items-center justify-between bg-[#F0F6FE]/30">
                                     <div>
                                        <h3 className="text-xl font-bold text-[#000650] tracking-tight">Credential Verification Queue</h3>
                                        <p className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mt-1">Manual Approval Protocol Required</p>
                                     </div>
                                     <div className="px-4 py-1.5 bg-[#FFF5F5] border border-[#FED7D7] rounded-full text-[#E53E3E] text-[10px] font-bold uppercase tracking-wider">
                                        {pendingApprovals.length} Actions Required
                                     </div>
                                  </div>

                                  <div className="p-4">
                                     {pendingApprovals.length === 0 ? (
                                        <div className="py-24 text-center">
                                           <div className="w-16 h-16 rounded-full bg-[#F0FFF4] border border-[#C6F6D5] flex items-center justify-center text-[#38A169] mx-auto mb-6">
                                              <CheckCircle size={32} />
                                           </div>
                                           <p className="text-sm font-bold text-[#718096] uppercase tracking-[0.2em]">Queue Fully Synchronized</p>
                                        </div>
                                     ) : (
                                        <div className="space-y-2">
                                           {pendingApprovals.map(user => (
                                              <ApprovalRow 
                                                 key={user.id}
                                                 user={user}
                                                 onApprove={() => handleApprove(user.id)}
                                                 onReject={() => handleReject(user.id)}
                                              />
                                           ))}
                                        </div>
                                     )}
                                  </div>
                               </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                               <div className="bg-white rounded-[2rem] border border-[#E1EBF9] shadow-sm p-8">
                                  <div className="flex items-center gap-4 mb-10">
                                     <div className="w-10 h-10 rounded-xl bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center text-[#000DB5]">
                                        <Cpu size={20}/>
                                     </div>
                                     <h3 className="text-lg font-bold text-[#000650]">Live Telemetry</h3>
                                  </div>
                                  <div className="space-y-8">
                                     <HealthProgress label="API Throughput" value={92} />
                                     <HealthProgress label="Node Latency" value={14} suffix="ms" inverse />
                                     <HealthProgress label="ML Logic Core" value={68} />
                                  </div>
                               </div>

                               <div className="bg-[#000DB5] rounded-[2rem] p-8 text-white relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                     <Lock size={64} />
                                  </div>
                                  <div className="relative z-10">
                                     <div className="flex items-center gap-3 mb-6">
                                        <Database size={18} className="text-white/60"/>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Registry Health</span>
                                     </div>
                                     <h4 className="text-2xl font-bold font-outfit mb-2 leading-none">Standard Compliant</h4>
                                     <p className="text-white/60 text-xs font-medium tracking-tight">ISO-27001 Cryptographic Shield Active</p>
                                  </div>
                                </div>
                            </div>
                         </div>
                      </>
                   )}

                   {activeTab === 'users' && (
                      <EntityTable users={allUsers} />
                   )}

                   {activeTab === 'orgs' && (
                      <OrganizationGrid orgs={allOrgs} />
                   )}

                   {activeTab === 'logs' && (
                      <SystemAuditTrail />
                   )}
                </motion.div>
              </AnimatePresence>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all group
      ${active 
        ? 'bg-[#000DB5] text-white shadow-lg shadow-[#000DB5]/20' 
        : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
  >
    <div className={`transition-all ${active ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
       {icon}
    </div>
    <span className="text-sm font-semibold tracking-tight">{label}</span>
    {active && (
       <div className="ml-auto w-1 h-4 rounded-full bg-white opacity-40" />
    )}
  </button>
);

const StatCard = ({ icon, label, value, trend }) => (
  <div className="bg-white rounded-[2rem] border border-[#E1EBF9] p-8 shadow-sm group hover:border-[#000DB5] transition-all">
    <div className="w-12 h-12 rounded-xl bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center text-[#000DB5] mb-8 group-hover:scale-110 transition-transform shadow-sm">
      {icon}
    </div>
    <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest mb-2">{label}</p>
    <div className="flex items-end justify-between">
       <h2 className="text-4xl font-normal text-[#000650] tracking-tighter leading-none font-syne">{value.toLocaleString()}</h2>
       <span className="text-[10px] font-bold bg-[#F0F6FE] text-[#000DB5] px-2 py-1 rounded-lg border border-[#E1EBF9] font-dm">{trend}</span>
    </div>
  </div>
);

const ApprovalRow = ({ user, onApprove, onReject }) => (
  <div className="flex items-center justify-between p-6 rounded-2xl hover:bg-[#F0F6FE]/50 border border-transparent hover:border-[#E1EBF9] transition-all group">
     <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center font-bold text-[#000DB5] text-sm">
           {user.username.substring(0,2).toUpperCase()}
        </div>
        <div>
           <p className="text-base font-bold text-[#000650] leading-none mb-2">{user.first_name} {user.last_name}</p>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-[#000DB5] uppercase tracking-widest bg-[#F0F6FE] px-2 py-0.5 rounded border border-[#E1EBF9]">{user.role}</span>
              <span className="text-[10px] font-medium text-[#718096] flex items-center gap-1.5 italic">
                 <Clock size={12}/> Added {new Date(user.created_at).toLocaleDateString()}
              </span>
           </div>
        </div>
     </div>
     <div className="flex items-center gap-3">
        <button onClick={onApprove} className="w-10 h-10 rounded-xl bg-[#000DB5] text-white flex items-center justify-center hover:bg-[#000990] transition-colors shadow-md">
           <CheckCircle size={20}/>
        </button>
        <button onClick={onReject} className="w-10 h-10 rounded-xl bg-white border border-[#E1EBF9] text-[#718096] flex items-center justify-center hover:bg-[#FFF5F5] hover:text-[#E53E3E] hover:border-[#FED7D7] transition-all">
           <XCircle size={20}/>
        </button>
     </div>
  </div>
);

const HealthProgress = ({ label, value, suffix = '%', inverse = false }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-xs font-bold text-[#000650] uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-[#000DB5] font-mono">{value}{suffix}</span>
    </div>
    <div className="h-2 w-full bg-[#F0F6FE] rounded-full overflow-hidden border border-[#E1EBF9]">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${inverse ? 100 - value : value}%` }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="h-full bg-[#000DB5] rounded-full"
      />
    </div>
  </div>
);

const EntityTable = ({ users }) => (
  <div className="bg-white rounded-[2rem] border border-[#E1EBF9] shadow-sm overflow-hidden">
     <div className="px-10 py-8 border-b border-[#E1EBF9] flex flex-col md:flex-row items-center justify-between gap-6 bg-[#F0F6FE]/30">
        <div>
           <h3 className="text-3xl font-normal text-[#000650] tracking-tight font-syne">Personnel Management</h3>
           <p className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mt-1 font-dm">Unified System Identity Repository</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative flex-grow">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718096]" />
              <input 
                placeholder="Find identity hash..." 
                className="bg-white border border-[#E1EBF9] rounded-xl pl-12 pr-6 py-2.5 text-sm font-medium text-[#000650] outline-none focus:border-[#000DB5] w-full md:w-64 transition-all shadow-sm"
              />
           </div>
           <button className="p-2.5 bg-white border border-[#E1EBF9] rounded-xl text-[#718096] hover:text-[#000DB5] transition-all"><Filter size={20}/></button>
        </div>
     </div>
     <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
           <thead>
              <tr className="bg-[#F0F6FE]/50 text-[#718096] border-b border-[#E1EBF9]">
                 <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Subject Identifier</th>
                 <th className="px-10 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em]">Access Role</th>
                 <th className="px-10 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em]">Verification Status</th>
                 <th className="px-10 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em]">Clinical Ledger Entry</th>
                 <th className="px-10 py-5"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-[#E1EBF9]">
              {users.map((user, i) => (
                 <tr key={user.id} className="hover:bg-[#F0F6FE]/30 transition-all group">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center font-bold text-[#000DB5] text-sm group-hover:border-[#000DB5] transition-colors">
                             {user.username.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-[#000650] mb-0.5">{user.email}</p>
                             <p className="text-[10px] font-mono font-bold text-[#718096]/60 uppercase">{user.username}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                       <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'doctor' ? 'bg-[#F0F6FE] text-[#000DB5]' : 'bg-[#F0FFF4] text-[#38A169]'}`}>
                          {user.role}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                       <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.is_approved ? 'bg-[#38A169]' : 'bg-[#D69E2E]'}`} />
                          <span className={`text-[11px] font-bold uppercase ${user.is_approved ? 'text-[#38A169]' : 'text-[#D69E2E]'}`}>{user.is_approved ? 'Authorized' : 'Pending Review'}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <p className="text-sm font-bold text-[#000650] mb-0.5">{new Date(user.created_at).toLocaleDateString()}</p>
                       <p className="text-[10px] font-bold text-[#718096]/50 uppercase tracking-widest">{new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="p-2 text-[#718096] hover:text-[#000DB5] hover:bg-[#F0F6FE] rounded-lg transition-all"><MoreVertical size={18}/></button>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
     </div>
  </div>
);

const OrganizationGrid = ({ orgs }) => (
  <div className="space-y-12">
     <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border-b border-[#E1EBF9] pb-12">
        <div>
           <h3 className="text-3xl font-normal text-[#000650] tracking-tight font-syne">Node Network Clusters</h3>
           <p className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mt-1 font-dm">Federated Identity Hubs</p>
        </div>
        <button className="btn-pill btn-pill-primary py-3 px-8 flex items-center gap-3">
           <Plus size={20} /> Provision New Hub
        </button>
     </div>
     
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {orgs.map(org => (
           <div key={org.id} className="bg-white rounded-[2.5rem] border border-[#E1EBF9] p-8 shadow-sm group hover:border-[#000DB5] transition-all flex flex-col h-full">
              <div className="flex items-start justify-between mb-10">
                 <div className="w-20 h-20 rounded-2xl bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center shadow-sm p-4 group-hover:bg-white transition-colors">
                    {org.logo_url ? <img src={org.logo_url} alt="" className="w-full h-full object-contain" /> : <Building2 className="text-[#000DB5]/40" size={40}/>}
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <div className={`text-[9px] font-bold uppercase bg-[#F0F6FE] text-[#000DB5] px-3 py-1 rounded-lg border border-[#E1EBF9]`}>
                       {org.is_active ? 'Hub Active' : 'Offline'}
                    </div>
                    <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">{org.organization_type}</span>
                 </div>
              </div>
              
              <div className="mb-10">
                 <h4 className="text-2xl font-bold text-[#000650] leading-none mb-3 group-hover:text-[#000DB5] transition-colors font-syne">{org.name}</h4>
                 <div className="flex items-center gap-2">
                    <Database size={14} className="text-[#718096]" />
                    <p className="text-[11px] font-bold text-[#718096]/70 italic tracking-tight">@{org.email_domain}</p>
                 </div>
              </div>
              
              <div className="mt-auto pt-8 border-t border-[#F0F6FE] flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${org.is_verified ? 'bg-[#38A169]' : 'bg-[#E53E3E]'}`} />
                    <span className="text-[10px] font-bold uppercase text-[#718096] tracking-widest">{org.is_verified ? 'Secured' : 'Unauthorized'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-[#F0F6FE] rounded-xl text-[#000DB5] hover:bg-[#000DB5] hover:text-white transition-all"><Settings size={18}/></button>
                    <button className="p-2.5 bg-[#F0F6FE] rounded-xl text-[#000DB5] hover:bg-[#000DB5] hover:text-white transition-all"><ExternalLink size={18}/></button>
                 </div>
              </div>
           </div>
        ))}
     </div>
  </div>
);

const SystemAuditTrail = () => (
  <div className="bg-white rounded-[3rem] border border-[#E1EBF9] shadow-sm p-12 relative overflow-hidden">
     <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div>
           <h3 className="text-3xl font-normal text-[#000650] tracking-tight font-syne">Cryptographic Audit Ledger</h3>
           <p className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mt-1 font-dm">Full-Spectrum System Event Traceability</p>
        </div>
        <button className="btn-pill btn-pill-secondary py-3 px-8 flex items-center gap-3">
           <RefreshCw size={18} /> Re-verify Identity Sequence
        </button>
     </div>

      <div className="space-y-4 max-w-5xl mx-auto">
        {React.useState(() => [1,2,3,4,5,6,7,8].map(i => {
           const seqId = Math.random().toString(16).substring(2, 6);
           const hash = Math.random().toString(16).substring(2, 24).toUpperCase();
           return { i, seqId, hash };
        }))[0].map(({ i, seqId, hash }) => {
           return (
            <div key={i} className="flex items-center gap-8 p-6 rounded-2xl border border-[#E1EBF9] hover:bg-[#F0F6FE]/50 transition-all group">
               <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-[#E53E3E]' : 'bg-[#000DB5]/40'} group-hover:bg-[#000DB5] transition-all`} />
               <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                     <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${i === 1 ? 'bg-[#FFF5F5] text-[#E53E3E] border-[#FED7D7]' : 'bg-[#F0F6FE] text-[#000DB5] border-[#E1EBF9]'}`}>{i === 1 ? 'SYS_CRITICAL' : i % 2 === 0 ? 'NET_UPLINK' : 'AUTH_EVENT'}</span>
                     <span className="text-sm font-bold text-[#000650] truncate">Diagnostic node synchronization finalized for seq_{seqId}</span>
                  </div>
                  <p className="text-[10px] font-mono font-bold text-[#718096]/40 uppercase tracking-widest">Hash: 0x{hash}</p>
               </div>
               <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-[#000650] mb-1">T-minus {i*4}s</p>
                  <span className="text-[8px] font-bold text-[#718096] uppercase tracking-widest italic">{i % 2 === 0 ? 'Alpha Cluster' : 'Gamma Node'}</span>
               </div>
            </div>
           );
        })}
      </div>
     
     <div className="mt-20 text-center">
        <button className="btn-pill btn-pill-primary py-4 px-12 text-sm flex items-center gap-4 mx-auto">
           <FileSearch size={22} /> Decrypt Full Audit Trace
        </button>
     </div>
  </div>
);

export default AdminDashboard;
