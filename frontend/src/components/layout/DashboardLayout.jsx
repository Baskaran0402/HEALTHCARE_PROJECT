import { useState, useEffect } from 'react'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { NAV_CONFIG } from '../../config/roleAccess'
import useAuthStore from '../../store/authStore'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../ui/Toast'

const ROLE_ACCENT = {
  patient:     '#10b981', // Emerald
  doctor:      '#4f46e5', // Diagnostic Indigo
  institution: '#f59e0b', // Institutional Amber
  super_admin: '#8b5cf6'  // Neural Violet
}

const ROLE_LABEL = {
  patient:     'Patient Portal',
  doctor:      'Clinical Workspace',
  institution: 'Institution Control',
  super_admin: 'Master Control'
}

export default function DashboardLayout({ children }) {
  const { user, logout, setRole } = useAuthStore()
  const { isMobile, isTablet } = useBreakpoint()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToast()

  const role = user?.role || 'patient'
  const accent = ROLE_ACCENT[role]
  const config = NAV_CONFIG[role]

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  // Close sidebar on resize to desktop
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false)
  }, [isMobile])

  // Real-time Critical Risk Notifications
  useEffect(() => {
    let socket = null;
    let isMounted = true;

    if (role === 'doctor' || role === 'admin' || role === 'institution' || role === 'super_admin') {
      const connectTimeout = setTimeout(() => {
        if (!isMounted) return;
        
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;

        // Build the best possible default WebSocket URL
        let defaultWsUrl;
        const apiUrl = import.meta.env.VITE_API_URL;

        if (apiUrl && apiUrl.startsWith('http')) {
          defaultWsUrl = apiUrl.replace(/^http/, 'ws') + '/ws/alerts/institutional_alerts';
        } else {
          const apiPort = window.location.port === '5173' ? '8000' : (window.location.port || (window.location.protocol === 'https:' ? '443' : '80'));
          defaultWsUrl = `${protocol}//${host}:${apiPort}/ws/alerts/institutional_alerts`;
        }

        socket = new WebSocket(import.meta.env.VITE_WS_URL || defaultWsUrl);
        
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'CRITICAL_RISK_ALERT') {
              addToast(
                `CRITICAL ALERT: High-risk detected for ${data.patient_name} (${data.risk_level}). Review required.`,
                'error',
                { duration: 10000 }
              );
            }
          } catch (err) {
            console.error('Alert processing error:', err);
          }
        };
      }, 100);

      return () => {
        isMounted = false;
        clearTimeout(connectTimeout);
        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
          socket.close();
        }
      };
    }
  }, [role, addToast]);

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 mb-1.5 px-2 py-1 ${isTablet && !sidebarOpen && !isMobile ? 'justify-center' : 'justify-start'}`}>
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 border"
          style={{ background: `${accent}15`, borderColor: `${accent}30` }}
        >
          <span className="font-bold text-[0.9rem]" style={{ color: accent }}>A</span>
        </div>
        {(!isTablet || sidebarOpen || isMobile) && (
          <div className="sidebar-label">
            <p className="text-white font-syne font-bold text-[0.95rem] m-0 leading-none">AruviAI</p>
            <p className="font-bold tracking-[0.1em] uppercase m-0 mt-0.5 text-[0.55rem] font-dm" style={{ color: accent }}>Intelligence OS</p>
          </div>
        )}
      </div>

      {/* Role badge */}
      {(!isTablet || sidebarOpen || isMobile) && (
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1.25 rounded-full mx-2 mt-2 mb-3 border"
          style={{ background: `${accent}10`, borderColor: `${accent}25` }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <span className="font-bold tracking-[0.1em] uppercase font-syne text-[0.58rem]" style={{ color: accent }}>
            {ROLE_LABEL[role]}
          </span>
        </div>
      )}

      {/* Simulation shell for super_admin */}
      {(user?.role === 'super_admin' || user?.email === '2022ad0128@svce.ac.in') && (!isTablet || sidebarOpen || isMobile) && (
        <div className="mx-2 mb-5 p-2.5 rounded-xl border border-white/5 bg-white/5">
          <p className="text-white/30 text-[0.5rem] font-extrabold uppercase tracking-[0.08em] mb-2 font-dm">Simulation Shell</p>
          <div className="grid grid-cols-2 gap-1">
            {['patient', 'doctor', 'institution', 'super_admin'].map(r => (
              <button 
                key={r}
                onClick={() => setRole(r)}
                className="px-0.5 py-1.5 rounded-md text-[0.55rem] font-bold capitalize transition-all border outline-none font-dm cursor-pointer"
                style={{
                  background: role === r ? ROLE_ACCENT[r] : 'rgba(255,255,255,0.04)',
                  color: role === r ? '#060d0a' : 'rgba(255,255,255,0.4)',
                  borderColor: role === r ? 'transparent' : 'rgba(255,255,255,0.02)'
                }}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User info */}
      {(!isTablet || sidebarOpen || isMobile) && (
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white/5 rounded-xl mb-5 border border-white/5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: accent }}
          >
            <span className="text-[#060d0a] font-syne font-extrabold text-[0.85rem]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-[0.8rem] font-semibold m-0 whitespace-nowrap overflow-hidden text-ellipsis font-dm">{user?.name || 'User'}</p>
            <p className="text-white/30 text-[0.65rem] m-0 whitespace-nowrap overflow-hidden text-ellipsis font-dm">{user?.email || ''}</p>
          </div>
        </div>
      )}

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-4">
        {config?.sections?.map(section => (
          <div key={section.title} className="mb-4">
            {(!isTablet || sidebarOpen || isMobile) && (
              <p className="text-slate-500 text-[0.6rem] font-black tracking-[0.18em] uppercase px-2.5 mb-2 mt-2 font-dm">
                {section.title}
              </p>
            )}
            {section.items.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                title={isTablet && !sidebarOpen && !isMobile ? item.label : ''}
                className={({isActive}) => `
                  flex items-center px-2.5 py-2.25 rounded-[10px] mb-0.5 no-underline transition-all
                  ${isTablet && !sidebarOpen && !isMobile ? 'justify-center' : 'justify-between'}
                `}
                style={({isActive}) => ({
                  background: isActive ? `${accent}` : 'transparent',
                  color: isActive ? '#0f172a' : '#94a3b8',
                })}
              >
                {({isActive}) => (
                  <>
                    <span className="text-base shrink-0">◈</span>
                    {(!isTablet || sidebarOpen || isMobile) && (
                      <span className={`sidebar-label flex-1 ml-2 text-[0.8rem] tracking-tight font-dm ${isActive ? 'font-bold' : 'font-medium'}`}>
                        {item.label}
                      </span>
                    )}
                    {isActive && (!isTablet || sidebarOpen || isMobile) && (
                      <span 
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: accent }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Neural Heartbeat */}
      {(!isTablet || sidebarOpen || isMobile) && (
        <div className="mt-6 px-3 flex items-center gap-2.5 opacity-40">
           <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: accent }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: accent }}></span>
          </div>
          <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-white font-dm">Neural Heartbeat Nominal</span>
        </div>
      )}

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-white/5">
        <button 
          onClick={handleLogout} 
          className={`flex items-center gap-2 px-2.5 py-2.25 rounded-[10px] bg-transparent border-none cursor-pointer text-white/25 text-[0.82rem] w-full transition-colors min-h-[44px] hover:text-white/50
            ${isTablet && !sidebarOpen && !isMobile ? 'justify-center' : 'justify-start'}
          `}
        >
          <span className="text-lg leading-none">→</span>
          {(!isTablet || sidebarOpen || isMobile) && <span className="sidebar-label ml-2 font-dm font-medium text-[0.75rem] uppercase tracking-wider">De-authorize Session</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="dashboard-layout h-screen flex flex-col md:flex-row w-full overflow-hidden bg-slate-50 relative">
      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 flex flex-col px-3 py-5 glass-dark
          transition-all duration-300 ease-in-out border-r border-white/5
          ${isMobile ? (sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64') : ''}
          ${!isMobile && isTablet ? (sidebarOpen ? 'w-64' : 'w-20') : ''}
          ${!isMobile && !isTablet ? 'w-64' : ''}
        `}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50">
        {/* Mobile top bar */}
        <div className={`
          flex items-center justify-between px-4 py-3 bg-[#060A14] border-b border-[#1a1f33] sticky top-0 z-30
          ${isMobile ? 'flex' : 'hidden'}
        `}>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 flex items-center justify-center shrink-0 rounded-lg bg-white/10 border-none text-white cursor-pointer text-base hover:bg-white/20 transition-colors"
            >
              ☰
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center border"
                style={{ background: `${accent}15`, borderColor: `${accent}30` }}
              >
                <span className="font-bold text-[0.7rem]" style={{ color: accent }}>A</span>
              </div>
              <span className="text-white font-syne font-bold text-[0.95rem]">AruviAI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: accent }}
            >
              <span className="text-[#060d0a] font-syne font-extrabold text-[0.8rem]">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
