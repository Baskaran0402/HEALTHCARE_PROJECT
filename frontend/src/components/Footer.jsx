import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, ShieldCheck, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';

const sections = [
  {
    title: 'Platform',
    links: [
      { label: 'Diagnostics', to: '/diagnostics' },
      { label: 'Brain Tumor Detection', to: '/brain-tumor' },
      { label: 'Consultation', to: '/consultation' },
      { label: 'Find Doctors', to: '/find-doctors' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Documentation', to: '/docs' },
      { label: 'Contact', to: '/contact' },
      { label: 'Security', to: '/security' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/security' },
      { label: 'Terms of Use', to: '/security' },
      { label: 'HIPAA Compliance', to: '/security' },
      { label: 'Data Processing', to: '/security' },
    ],
  },
];

const socials = [
  { label: 'Twitter', path: 'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.28 0-.54-.03-.8-.08.54 1.69 2.11 2.95 3.96 2.99-1.45 1.13-3.27 1.8-5.25 1.8-.34 0-.68-.02-1.01-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' },
  { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { label: 'GitHub', path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' },
  { label: 'Email', path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
];

const Footer = () => {
  const { isMobile } = useBreakpoint();

  return (
    <footer className="bg-[#060d0a] relative overflow-hidden">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#0fd68c]/20 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 py-16 md:py-20">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
                <Brain className="w-5 h-5 text-[#0fd68c]" />
              </div>
              <div>
                <span className="font-syne font-extrabold text-white text-[1.25rem] tracking-[-0.04em]">
                  AruviAI
                </span>
                <p className="text-[8px] uppercase tracking-[0.25em] font-dm font-medium text-white/25">
                  Clinical Intelligence OS
                </p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed max-w-xs font-dm font-light text-white/35">
              Accelerating preventative medicine through explainable AI diagnostics.
              Built for clinicians. Accessible to everyone.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {socials.map(s => (
                <motion.a key={s.label} href="#" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors border-none bg-white/5 cursor-pointer hover:bg-[#0fd68c]/15 group"
                  aria-label={s.label}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" className="fill-white/40 group-hover:fill-white/80">
                    <path d={s.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16">
            {sections.map(section => (
              <div key={section.title} className="space-y-5 flex flex-col items-center md:items-start text-center md:text-left">
                <h4 className="text-[10px] uppercase tracking-[0.25em] font-dm font-semibold text-white/25">
                  {section.title}
                </h4>
                <ul className="space-y-3 p-0 list-none">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link to={link.to}
                        className="text-sm flex items-center justify-center md:justify-start gap-1.5 group transition-colors no-underline font-dm font-normal text-white/40 hover:text-white"
                      >
                        {link.label}
                        {!isMobile && (
                          <ArrowRight size={11} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#0fd68c]" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Certifications */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#0fd68c]/50" />
                <span className="text-[10px] uppercase tracking-widest font-dm font-semibold text-white/25">
                  HIPAA
                </span>
              </div>
              <div className="w-px h-3 bg-white/5" />
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#3b82f6]/50" />
                <span className="text-[10px] uppercase tracking-widest font-dm font-semibold text-white/25">
                  ISO 27001
                </span>
              </div>
              <div className="w-px h-3 bg-white/5" />
              <span className="text-[10px] tracking-wider font-mono font-medium text-white/15">
                v4.2.0
              </span>
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-2 text-[11px] text-white/20">
              <span>© 2026 AruviAI</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                Built with <Heart size={10} className="text-red-500/40" /> in India
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
