import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Brain, Bell, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import useAuthStore from '../store/authStore';
import SignupModal from './SignupModal';
import { useBreakpoint } from '../hooks/useBreakpoint';

const Navbar = () => {
    const { isMobile } = useBreakpoint();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { label: 'Home', path: '/' },
        { label: 'Diagnostics', path: '/diagnostics' },
        { label: 'Analytics', path: '/analytics' },
        { label: 'Documentation', path: '/docs' },
    ];

    const handleLogout = async () => {
        await logout();
        setProfileOpen(false);
        navigate('/');
    };

    const getInitials = () => {
        if (!user) return '??';
        const first = user.first_name || user.username || '';
        const last = user.last_name || '';
        if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
        return first.substring(0, 2).toUpperCase();
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between ${isMobile ? 'px-5 py-[14px] h-[70px]' : 'px-12 py-[18px] h-[88px]'} ${scrolled ? 'bg-white/88' : 'bg-[#f7f9f8]/88'} backdrop-blur-2xl border-b border-[#0a0a0f]/5 transition-all duration-300`}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group no-underline">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[15deg] bg-[#0a0a0f]"
                    >
                        <Brain className="w-5 h-5 text-[#0fd68c]" />
                    </div>
                    <span
                        className="text-xl tracking-[-0.04em] font-syne font-black text-[#0a0a0f]"
                    >
                        AruviAI<span className="text-[#0fd68c]">.</span>
                    </span>
                </Link>

                {/* Nav links — hide on mobile */}
                {!isMobile && (
                    <ul className="flex gap-8 list-none m-0 p-0">
                        {links.map(link => {
                            const isActive = location.pathname === link.path;
                            return (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`relative text-[10px] font-bold uppercase tracking-[0.12em] transition-colors font-syne no-underline ${isActive ? 'text-[#0fd68c]' : 'text-[#0a0a0f]/40'}`}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-underline"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#0fd68c]"
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Right side */}
                <div className="flex items-center gap-2.5">
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-4">
                            {!isMobile && (
                                <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0a0a0f]/5 hover:bg-[#0a0a0f]/10 transition-colors border-none cursor-pointer">
                                    <Bell size={18} className="text-[#0a0a0f]/40" />
                                </button>
                            )}

                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full bg-white border border-[#e8ede9] shadow-sm hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] bg-[#0a0a0f] text-[#0fd68c] font-syne font-black"
                                    >
                                        {getInitials()}
                                    </div>
                                    <ChevronDown size={14} className={`text-[#0a0a0f]/30 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                            className="absolute right-0 top-full mt-3 w-[calc(100vw-40px)] max-w-[280px] sm:w-64 bg-white border border-[#e8ede9] rounded-[20px] shadow-2xl overflow-hidden z-50 p-2"
                                        >
                                            <div className="p-4 border-b border-[#e8ede9] mb-1">
                                                <p className="text-sm font-black font-syne m-0">
                                                    {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
                                                </p>
                                                <p className="text-[10px] uppercase font-bold tracking-widest mt-1 text-[#0fd68c]">{user.role || 'patient'}</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Link to="/settings" onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#0a0a0f]/60 hover:text-[#0a0a0f] hover:bg-[#f7f9f8] transition-all no-underline font-syne"
                                                >
                                                    <Settings size={16} /> Platform Settings
                                                </Link>
                                                <Link to={user.role === 'patient' ? '/patient/dashboard' : '/dashboard'} onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#0a0a0f]/60 hover:text-[#0a0a0f] hover:bg-[#f7f9f8] transition-all no-underline font-syne"
                                                >
                                                    <User size={16} /> Personal Control
                                                </Link>
                                            </div>
                                            <div className="mt-1 pt-1 border-t border-[#e8ede9]">
                                                <button onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all border-none cursor-pointer text-left font-syne"
                                                >
                                                    <LogOut size={16} /> Terminate Session
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <>
                            {!isMobile && (
                                <Link to="/login"
                                    className="px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-colors font-syne text-[#0a0a0f]/40 no-underline"
                                >
                                    Sign In
                                </Link>
                            )}
                            {!isMobile && (
                                <button
                                    onClick={() => setShowSignup(true)}
                                    className="px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg shadow-[#0fd68c]/20 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer font-syne bg-[#0a0a0f] text-[#0fd68c] border-none"
                                >
                                    GET STARTED
                                </button>
                            )}
                        </>
                    )}

                    {/* Mobile: hamburger only */}
                    {isMobile && (
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="bg-[#0a0a0f] border-none text-[#0fd68c] w-9 h-9 rounded-lg cursor-pointer flex items-center justify-center text-base">
                            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    )}
                </div>

                {/* Mobile dropdown menu */}
                <AnimatePresence>
                    {isMobile && mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 right-0 bg-[#060d0a] border-b border-[#0fd68c]/10 px-5 py-4 flex flex-col gap-1 z-[100]"
                        >
                            {links.map(link => (
                                <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className="text-white/60 text-sm py-3 px-2 no-underline border-b border-white/5 font-dm">{link.label}</Link>
                            ))}
                            {!isAuthenticated && (
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#0fd68c] text-sm py-3 px-2 no-underline font-syne font-bold">Sign In →</Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
        </>
    );
};

export default Navbar;
