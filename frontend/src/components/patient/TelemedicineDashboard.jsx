import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Video, 
  Clock, 
  CreditCard, 
  ChevronRight, 
  Activity, 
  Bell, 
  MoreVertical,
  Search,
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  TrendingUp,
  MapPin,
  Plus,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PrescriptionView from './PrescriptionView';
import SOSButton from '../emergency/SOSButton';
import './TelemedicineDashboard.css';

const TelemedicineDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(2);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  // Mock data for enterprise demo
  const appointments = [
    {
      id: 'apt-1',
      doctor_name: 'Arjun Reddy',
      specialization: 'Cardiologist',
      time: 'Today, 2:30 PM',
      type: 'video',
      status: 'Ready',
      meeting_link: 'https://meet.jit.si/AIDoc-ArjunReddy',
      fee: 50.00
    },
    {
      id: 'apt-2',
      doctor_name: 'Sarah Williams',
      specialization: 'Neurologist',
      time: 'Tomorrow, 10:00 AM',
      type: 'in-person',
      status: 'Scheduled',
      fee: 65.00
    }
  ];

  const vitals = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', trend: '+2%', color: 'var(--primary)' },
    { label: 'Blood Pressure', value: '120/80', unit: 'mmhg', trend: 'Stable', color: 'var(--success)' },
    { label: 'Blood Glucose', value: '98', unit: 'mg/dl', trend: '-5%', color: 'var(--secondary)' },
    { label: 'Body Weight', value: '74.5', unit: 'kg', trend: '+0.2%', color: 'var(--text-main)' }
  ];

  const prescription = {
    id: 'RX-99281',
    doctor_name: 'Arjun Reddy',
    created_at: new Date().toISOString(),
    medicines: [
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (Night)', duration: '30 Days' },
      { name: 'Aspirin', dosage: '75mg', frequency: 'After breakfast', duration: '90 Days' }
    ],
    notes: 'Patient shows signs of elevated LDL. Monitor cardiovascular activity closely and report any chest tightness immediately.',
    digital_signature: 'sha256:8f4c2e1a9d3b5c7e4f6a8b0d2c4e6f8a'
  };

  return (
    <div className="enterprise-app">
      {/* Sidebar Navigation */}
      <aside className={`enterprise-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
           <div className="logo-box">AI</div>
           {isSidebarOpen && <span className="logo-text">CarePortal</span>}
        </div>

        <nav className="sidebar-nav">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<Calendar size={20} />} label="Appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<FileText size={20} />} label="Medical Records" active={activeTab === 'records'} onClick={() => setActiveTab('records')} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<MessageSquare size={20} />} label="Messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} collapsed={!isSidebarOpen} count={3} />
          <SidebarItem icon={<Users size={20} />} label="Find Specialists" active={activeTab === 'find'} onClick={() => navigate('/find-doctors')} collapsed={!isSidebarOpen} />
        </nav>

        <div className="sidebar-footer">
          <SidebarItem icon={<Settings size={20} />} label="Settings" collapsed={!isSidebarOpen} />
          <SidebarItem icon={<LogOut size={20} />} label="Logout" collapsed={!isSidebarOpen} onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="enterprise-main">
        {/* Top bar */}
        <header className="main-header glass">
          <div className="header-left">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="toggle-btn">
                <MoreVertical size={20} />
             </button>
             <div className="search-box glass">
                <Search size={18} />
                <input type="text" placeholder="Search records, doctors, or results..." />
             </div>
          </div>
          
          <div className="header-right">
             <div className="notification-btn">
                <Bell size={20} />
                {notifications > 0 && <span className="noti-badge">{notifications}</span>}
             </div>
             <div className="user-profile" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
                <div className="user-info">
                   <p className="user-name">{user?.username || 'John Doe'}</p>
                   <p className="user-role">Patient • Organization ID: SVCE-01</p>
                </div>
                <div className="user-avatar">
                   {user?.username?.substring(0,2).toUpperCase() || 'JD'}
                </div>
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="content-container">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="dashboard-content"
            >
              {activeTab === 'overview' && (
                <>
                  <div className="welcome-banner">
                    <div className="banner-text">
                       <h1 className="gradient-text">Good morning, {user?.username?.split(' ')[0] || 'John'}</h1>
                       <p>You have a video consultation scheduled with Dr. Arjun Reddy for 2:30 PM today.</p>
                       <button className="banner-cta">View Details <ArrowRight size={16} /></button>
                    </div>
                    <div className="banner-visual">
                       {/* SVG Abstract pattern */}
                       <div className="abstract-circle"></div>
                    </div>
                  </div>

                  {/* Vitals Grid */}
                  <div className="vitals-grid">
                    {vitals.map((vital, i) => (
                      <div key={i} className="vital-card enterprise-card">
                         <div className="vital-header">
                            <span className="vital-label">{vital.label}</span>
                            <TrendingUp size={16} className={vital.trend.startsWith('+') ? 'text-danger' : 'text-success'} />
                         </div>
                         <div className="vital-body">
                            <span className="vital-value">{vital.value}</span>
                            <span className="vital-unit">{vital.unit}</span>
                         </div>
                         <div className="vital-footer">
                            <span className="vital-trend">{vital.trend} from last week</span>
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="two-col-grid">
                    {/* Appointments Card */}
                    <div className="appointment-section enterprise-card">
                       <div className="section-header">
                          <h2 className="section-title">Schedule Overview</h2>
                          <button className="btn-icon-plus"><Plus size={18} /></button>
                       </div>
                       <div className="appointment-list">
                          {appointments.map((apt, i) => (
                             <div key={i} className="apt-row">
                                <div className="apt-info">
                                   <div className={`apt-icon ${apt.type}`}>
                                      {apt.type === 'video' ? <Video size={20} /> : <MapPin size={20} />}
                                   </div>
                                   <div>
                                      <p className="apt-doctor">Dr. {apt.doctor_name}</p>
                                      <p className="apt-specialty">{apt.specialization}</p>
                                   </div>
                                </div>
                                <div className="apt-time">{apt.time}</div>
                                <div className="apt-actions">
                                   <span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
                                   {apt.status === 'Ready' && (
                                      <button className="btn-call" onClick={() => window.open(apt.meeting_link, '_blank')}>Join</button>
                                   )}
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Prescription Card */}
                    <div className="prescription-section">
                       <PrescriptionView prescription={prescription} />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'appointments' && (
                <div className="enterprise-card h-full flex items-center justify-center p-20 text-center">
                   <div>
                      <Calendar size={64} className="text-slate-200 mx-auto mb-6" />
                      <h2 className="text-2xl font-black text-slate-800 uppercase">Scheduling System</h2>
                      <p className="text-slate-500 mt-2">Manage all your upcoming and past consultations here.</p>
                      <button className="btn-primary mt-8">Schedule New Session</button>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global SOS Button floating */}
      <div className="sos-fab">
          <SOSButton patientId={user?.id || 'demo-pat'} />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick, collapsed, count }) => (
  <button className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
    <div className="icon-wrapper">{icon}</div>
    {!collapsed && (
      <>
        <span className="item-label">{label}</span>
        {count && <span className="item-count">{count}</span>}
      </>
    )}
    {active && !collapsed && <div className="active-indicator"></div>}
  </button>
);

export default TelemedicineDashboard;
