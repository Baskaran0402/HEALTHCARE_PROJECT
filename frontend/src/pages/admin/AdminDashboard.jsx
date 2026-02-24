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
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../lib/api/admin';
import './AdminDashboard.css';

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
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
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
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminService.approveUser(userId);
      setPendingApprovals(prev => prev.filter(u => u.id !== userId));
      // Refresh stats
      const newStats = await adminService.getSystemStats();
      setStats(newStats);
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    try {
      if (window.confirm('Are you sure you want to reject/deactivate this user?')) {
        await adminService.rejectUser(userId);
        setPendingApprovals(prev => prev.filter(u => u.id !== userId));
      }
    } catch (err) {
      alert('Failed to reject user');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
           <div className="logo-sq">AI</div>
           <span>AdminPanel</span>
        </div>
        
        <nav className="admin-nav">
          <TabItem 
            icon={<Shield size={20}/>} 
            label="Governance" 
            active={activeTab === 'governance'} 
            onClick={() => setActiveTab('governance')} 
          />
          <TabItem 
            icon={<Users size={20}/>} 
            label="User Management" 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
          />
          <TabItem 
            icon={<Building2 size={20}/>} 
            label="Organizations" 
            active={activeTab === 'orgs'} 
            onClick={() => setActiveTab('orgs')} 
          />
          <TabItem 
            icon={<ShieldCheck size={20}/>} 
            label="Audit Logs" 
            active={activeTab === 'logs'} 
            onClick={() => setActiveTab('logs')} 
          />
        </nav>

        <div className="sidebar-footer">
           <button onClick={handleLogout} className="logout-btn">
             <LogOut size={20}/> <span>Logout</span>
           </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
           <div className="header-search">
              <Search size={18}/>
              <input type="text" placeholder="Search across clinical network..." />
           </div>
           <div className="header-actions">
              <button 
                onClick={fetchDashboardData} 
                className={`refresh-btn ${loading ? 'animate-spin' : ''}`}
              >
                <RefreshCw size={20}/>
              </button>
              <div className="notif-box"><Bell size={20}/><span className="dot"></span></div>
              <div className="admin-profile">
                 <div className="ap-info">
                   <p className="ap-name">System Administrator</p>
                   <p className="ap-role">Super Admin • SVCE-ROOT</p>
                 </div>
                 <div className="ap-avatar">SA</div>
              </div>
           </div>
        </header>

        <div className="admin-scroll">
          {activeTab === 'governance' && (
            <>
              <section className="stats-row">
                 <StatCard icon={<Users/>} label="Total Registered" value={stats.totalUsers} trend="+12%" />
                 <StatCard icon={<Activity/>} label="Active Sessions" value={stats.activePatients} trend="+5%" />
                 <StatCard icon={<ShieldCheck/>} label="Verified Practitioners" value={stats.verifiedDoctors} trend="+2 new" />
                 <StatCard icon={<Building2/>} label="Network Centers" value={stats.orgs} trend="Stable" />
              </section>

              <div className="admin-grid">
                 <div className="grid-col main-col">
                    <div className="data-card">
                       <div className="card-header">
                          <h3>Approval Queue</h3>
                          <span className="badge-count">{pendingApprovals.length} Pending</span>
                       </div>
                       <div className="approval-list">
                          {pendingApprovals.length === 0 ? (
                            <div className="empty-state">
                               <CheckCircle size={48} className="text-success m-auto"/>
                               <p>All clear! No pending approvals.</p>
                            </div>
                          ) : (
                            pendingApprovals.map(user => (
                              <ApprovalItem 
                                key={user.id}
                                id={user.id}
                                name={`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username} 
                                role={user.role} 
                                time={new Date(user.created_at).toLocaleTimeString()}
                                onApprove={() => handleApprove(user.id)}
                                onReject={() => handleReject(user.id)}
                              />
                            ))
                          )}
                       </div>
                    </div>
                 </div>

                 <div className="grid-col side-col">
                    <div className="data-card system-health">
                       <h3>System Telemetry</h3>
                       <HealthStat label="API Integrity" value={98} />
                       <HealthStat label="Database Latency" value={12} suffix="ms" inverse />
                       <HealthStat label="AI Model Uptime" value={100} />
                    </div>
                 </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
             <div className="data-card">
                <div className="card-header">
                   <h3>User Management</h3>
                   <input type="text" className="table-search" placeholder="Filter users..." />
                </div>
                <table className="admin-table">
                   <thead>
                      <tr>
                         <th>User</th>
                         <th>Role</th>
                         <th>Status</th>
                         <th>Joined</th>
                         <th>Actions</th>
                      </tr>
                   </thead>
                   <tbody>
                      {allUsers.map(user => (
                         <tr key={user.id}>
                            <td>
                               <div className="user-cell">
                                  <div className="user-avatar">{user.username.substring(0,2).toUpperCase()}</div>
                                  <div>
                                     <p className="font-bold">{user.email}</p>
                                     <p className="text-xs text-slate-500">{user.username}</p>
                                  </div>
                               </div>
                            </td>
                            <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                            <td>
                               <span className={`status-pill ${user.is_approved ? 'active' : 'pending'}`}>
                                  {user.is_approved ? 'Approved' : 'Pending'}
                               </span>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                            <td><button className="p-2 hover:bg-slate-100 rounded-lg"><MoreVertical size={16}/></button></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}

          {activeTab === 'orgs' && (
             <div className="data-card">
                <div className="card-header">
                   <h3>Affiliated Organizations</h3>
                   <button className="view-all">+ Add Network Center</button>
                </div>
                <div className="org-grid">
                   {allOrgs.map(org => (
                      <div key={org.id} className="org-card">
                         <div className="org-icon">
                            {org.logo_url ? <img src={org.logo_url} alt="" /> : <Building2/>}
                         </div>
                         <h4>{org.name}</h4>
                         <p className="text-xs text-slate-500 mb-4">{org.organization_type} • {org.email_domain}</p>
                         <div className="org-meta">
                            <span>{org.is_verified ? 'Verified' : 'Unverified'}</span>
                            <span className="dot"></span>
                            <span>{org.is_active ? 'Active' : 'Offline'}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'logs' && (
             <div className="data-card">
                <div className="card-header">
                   <h3>Audit Logs</h3>
                   <button className="view-all">Export CSV</button>
                </div>
                <p className="text-slate-500 text-sm">Real-time cryptographic audit trail of system events.</p>
                <div className="log-list mt-6">
                   {[1,2,3,4,5].map(i => (
                      <div key={i} className="log-item">
                         <div className="log-dot"></div>
                         <div className="log-msg">
                            <span className="font-bold">SYSTEM_AUTH</span>: User login successful for <span className="text-blue-600">admin@svce.ac.in</span>
                         </div>
                         <div className="log-time">10:42:0{i} AM</div>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

const TabItem = ({ icon, label, active, onClick }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon} <span>{label}</span>
  </div>
);

const StatCard = ({ icon, label, value, trend }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-data">
       <p className="stat-label">{label}</p>
       <h2 className="stat-value">{value}</h2>
       <span className="stat-trend">{trend}</span>
    </div>
  </div>
);

const HealthStat = ({ label, value, suffix = '%', inverse = false }) => (
  <div className="health-stat">
    <div className="flex justify-between mb-1">
      <span>{label}</span>
      <span className="h-val font-black">{value}{suffix}</span>
    </div>
    <div className="h-bar">
      <div 
        className={`h-fill ${value > 80 ? 'bg-success' : 'bg-primary'}`} 
        style={{width: `${inverse ? 100 - value : value}%`}}
      ></div>
    </div>
  </div>
);

const ApprovalItem = ({ id, name, role, time, onApprove, onReject }) => (
  <div className="approval-item">
    <div className="ai-info">
       <p className="ai-name">{name}</p>
       <p className="ai-meta">{role} • <Clock size={12}/> {time}</p>
    </div>
    <div className="ai-actions">
       <button onClick={onApprove} className="btn-approve" title="Approve Access"><CheckCircle size={18}/></button>
       <button onClick={onReject} className="btn-reject" title="Deny Access"><XCircle size={18}/></button>
    </div>
  </div>
);

export default AdminDashboard;
