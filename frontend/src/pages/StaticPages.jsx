import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Lock, Eye, EyeOff, Key, FileCheck, Globe, Zap, AlertCircle } from 'lucide-react';
import { AruviAILayout } from '../components/ui/AruviAILayout';
import { Card, Badge } from '../components/ui/Card';

const PlaceholderPage = ({ title, description, icon: Icon, badge }) => (
  <AruviAILayout activeTab={title}>
    <div className="dashboard-container">
      <div className="py-20 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-[#0fd68c]/10 rounded-3xl flex items-center justify-center mx-auto text-[#0fd68c] shadow-xl shadow-[#0fd68c]/10 mb-10"
        >
          <Icon size={40} />
        </motion.div>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#0fd68c] font-bold mb-2 font-syne">
            {badge}
          </p>
          <h1 className="font-syne font-black text-5xl text-[#0a0a0f] tracking-[-0.04em] leading-tight">
            {title}<span className="text-[#0fd68c]">.</span>
          </h1>
          <p className="text-[#0a0a0f]/45 text-lg font-dm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-2xl bg-white border border-[#e8ede9] border-dashed flex items-center justify-center">
               <div className="w-12 h-1 gap-1 border-t border-[#e8ede9]" />
            </div>
          ))}
        </div>
      </div>
    </div>

  </AruviAILayout>
);

export const Security = () => (
  <PlaceholderPage 
    title="Security & Compliance"
    description="Institutional-grade cryptographic protocols and data sovereignty controls ensuring 100% HIPAA and ISO 27001 compliance."
    icon={ShieldCheck}
    badge="Institutional Node"
  />
);

export const About = () => (
  <PlaceholderPage 
    title="About AruviAI"
    description="The world's leading decentralized clinical intelligence platform. Bridging the gap between neural innovation and direct patient outcomes."
    icon={Globe}
    badge="The AruviAI Story"
  />
);

export const Docs = () => (
  <PlaceholderPage 
    title="Documentation"
    description="Comprehensive guides for clinicians, developers, and administrators to integrate with the AruviAI clinical lattice."
    icon={FileCheck}
    badge="Developer Hub"
  />
);

export const Contact = () => (
  <PlaceholderPage 
    title="Contact Support"
    description="Direct uplink to our clinical engineering teams for operational support and platform optimization."
    icon={Zap}
    badge="24/7 Priority Support"
  />
);
