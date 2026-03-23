import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Settings, 
  Bell, Search, ChevronRight, Menu, X, 
  LogOut, User, Shield, HelpCircle, ChevronDown,
  Activity, BarChart3, Database, Globe, Brain
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }: SidebarItemProps) => (
  <Link 
    to={path}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
      active 
        ? 'bg-teal-50 text-teal-700 font-medium border-l-2 border-primary' 
        : 'text-muted-foreground font-medium hover:bg-secondary hover:text-foreground'
    }`}
  >
    <Icon size={20} className={active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'} />
    {!collapsed && <span className="text-sm">{label}</span>}
    
    {collapsed && (
      <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-primary-foreground text-[10px] font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 uppercase tracking-widest">
        {label}
      </div>
    )}
  </Link>
);

interface AruviAILayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

const navGroups = [
  {
    label: 'Clinical Intelligence',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Activity, label: 'Diagnostics', path: '/diagnostics' },
      { icon: Brain, label: 'Brain Tumor', path: '/brain-tumor' },
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      { icon: Users, label: 'Patients', path: '/patients' },
      { icon: Database, label: 'Reports', path: '/reports' },
    ]
  },
  {
    label: 'Resources & Governance',
    items: [
      { icon: Shield, label: 'Security', path: '/security' },
      { icon: HelpCircle, label: 'Documentation', path: '/docs' },
      { icon: Globe, label: 'Network State', path: '/about' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ]
  }
];

export const AruviAILayout = ({ children, activeTab = 'Dashboard' }: AruviAILayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      {/* Sidebar - Desktop */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        className="hidden lg:flex flex-col bg-card border-r border-border z-50 overflow-hidden relative"
      >
        {/* Branding */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-tight font-display">AruviAI</span>
                <span className="text-[10px] text-primary font-semibold tracking-wide font-tamil">அறிவு AI</span>
              </div>
            )}
          </Link>
        </div>

        <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-8">
              {!isSidebarCollapsed && (
                <div className="px-6 mb-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {group.label}
                  </h3>
                </div>
              )}
              <nav className="px-3 space-y-1">
                {group.items.map((item) => (
                  <SidebarItem 
                    key={item.label}
                    {...item}
                    active={location.pathname === item.path || (item.label === activeTab && location.pathname === '/dashboard')}
                    collapsed={isSidebarCollapsed}
                  />
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={14} className="text-muted-foreground" />
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <ChevronRight size={14} className="text-muted-foreground" />
              <span className="text-foreground font-semibold">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search..."
                className="w-64 h-9 pl-10 pr-4 text-sm border border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none bg-background"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-semibold text-muted-foreground bg-secondary rounded border border-border">⌘K</kbd>
            </div>

            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </button>

            <div className="h-6 w-px bg-border mx-2" />

            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">
                <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-primary-foreground">AW</span>
                </div>
                <ChevronDown size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-2xl border border-border shadow-premium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                <div className="px-4 py-3 border-b border-border mb-1">
                  <p className="text-sm font-bold text-foreground">Dr. Alex Wright</p>
                  <p className="text-xs text-muted-foreground">administrator@aruviai.os</p>
                </div>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-all text-left font-medium">
                  <User size={16} /> Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-all text-left font-medium">
                  <Settings size={16} /> Preferences
                </button>
                <div className="h-px bg-border my-1" />
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-all font-bold text-left">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative bg-background">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            />
            
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-80 bg-card shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground tracking-tight font-display">AruviAI</span>
                    <span className="text-[10px] text-primary font-semibold tracking-wide font-tamil">அறிவு AI</span>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:bg-secondary rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 py-6 overflow-y-auto">
                {navGroups.map((group, idx) => (
                  <div key={idx} className="mb-8">
                    <div className="px-6 mb-3">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{group.label}</h3>
                    </div>
                    <nav className="px-3 space-y-1">
                      {group.items.map((item) => (
                        <Link 
                          key={item.label}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                            location.pathname === item.path
                              ? 'bg-teal-50 text-teal-700 font-bold border-l-2 border-primary' 
                              : 'text-muted-foreground font-medium hover:bg-secondary hover:text-foreground'
                          }`}
                        >
                          <item.icon size={20} /> 
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
