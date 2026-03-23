import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, Zap, Globe, ChevronRight, Mail, Twitter, Linkedin, Github, 
  ShieldCheck, ArrowRight, Dna, Activity, BarChart3, Brain, Heart, Database
} from 'lucide-react';
import { ClinicalBadge } from '@/components/ClinicalComponents';
import Navbar from '@/components/Navbar';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const HomePage = () => {
  return (
    <main className="min-h-screen bg-card font-body selection:bg-primary/10">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-clinical-blue/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
        
        <div className="container relative z-10 max-w-6xl mx-auto px-6">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
            <motion.div variants={item}>
              <ClinicalBadge variant="primary">Clinical Intelligence OS v4.0</ClinicalBadge>
            </motion.div>
            
            <motion.h1 variants={item} className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tight text-foreground font-display leading-[1.1]">
              Knowledge-driven
              <br />
              <span className="text-primary">clinical intelligence.</span>
            </motion.h1>
            
            <motion.p variants={item} className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
              AruviAI (அறிவு AI) delivers explainable, AI-powered multi-disease diagnostic support for Indian healthcare institutions.
            </motion.p>
            
            <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
              <Link to="/diagnostics" className="inline-flex items-center gap-3 px-8 py-4 gradient-brand text-primary-foreground rounded-2xl font-bold text-sm uppercase tracking-wider shadow-glow hover:opacity-90 transition-all">
                <Zap size={18} /> Start Assessment
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-foreground rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-secondary/80 transition-all border border-border">
                View Dashboard <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div 
            variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '99.2%', label: 'Diagnostic Accuracy' },
              { value: '6', label: 'Disease Models' },
              { value: '50K+', label: 'Scans Processed' },
              { value: '<2s', label: 'Inference Time' },
            ].map((stat, i) => (
              <motion.div key={i} variants={item} className="text-center">
                <h3 className="text-4xl md:text-5xl font-extrabold text-primary font-display tracking-tight">{stat.value}</h3>
                <p className="mt-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-16">
            <motion.div variants={item} className="text-center max-w-2xl mx-auto">
              <ClinicalBadge variant="primary">6-Core Diagnostic Engine</ClinicalBadge>
              <h2 className="mt-6 text-4xl md:text-5xl font-bold text-foreground font-display tracking-tight">
                Multi-disease intelligence
              </h2>
              <p className="mt-4 text-lg text-muted-foreground font-medium">
                Advanced ML models covering the most critical disease pathways with explainable AI insights.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: 'Heart Disease', desc: 'Random Forest cardiovascular risk prediction with SHAP-driven feature analysis.', color: 'text-red-500' },
                { icon: Activity, title: 'Diabetes', desc: 'Metabolic risk assessment using logistic regression with biomarker correlation.', color: 'text-primary' },
                { icon: Brain, title: 'Stroke Analysis', desc: 'Cerebrovascular risk scoring based on age, hypertension, and BMI markers.', color: 'text-clinical-blue' },
                { icon: Database, title: 'Kidney Disease', desc: 'Chronic renal function analysis with creatinine and GFR-based predictors.', color: 'text-amber-500' },
                { icon: Shield, title: 'Liver Pathology', desc: 'Hepatology risk scoring with ALT, AST, and bilirubin panel evaluation.', color: 'text-emerald-500' },
                { icon: Dna, title: 'Brain Tumor', desc: 'CNN-based computer vision for MRI/CT scan anomaly detection and classification.', color: 'text-purple-500' },
              ].map((feature, i) => (
                <motion.div key={i} variants={item} className="bg-card rounded-3xl border border-border p-8 shadow-subtle hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group">
                  <div className={`w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-display mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-16">
            <motion.div variants={item} className="text-center max-w-2xl mx-auto">
              <ClinicalBadge variant="info">Protocol Flow</ClinicalBadge>
              <h2 className="mt-6 text-4xl font-bold text-foreground font-display tracking-tight">How AruviAI works</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: '01', title: 'Data Ingestion', desc: 'Clinician enters patient biometrics, lab values, and medical history through our secure diagnostic form.' },
                { step: '02', title: 'Neural Inference', desc: 'The 6-core diagnostic engine processes data in parallel using ONNX-optimized ML models.' },
                { step: '03', title: 'Explainable Report', desc: 'SHAP-powered explanations show exactly why each prediction was made, with automated PDF reports.' },
              ].map((s, i) => (
                <motion.div key={i} variants={item} className="text-center">
                  <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <span className="text-2xl font-bold text-primary-foreground font-mono">{s.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-display mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-foreground rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-clinical-blue rounded-full blur-[100px]" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground font-display tracking-tight mb-6">
                Ready to transform diagnostics?
              </h2>
              <p className="text-lg text-primary-foreground/60 max-w-xl mx-auto mb-10 font-medium">
                Deploy AruviAI at your institution and accelerate clinical decision-making with explainable intelligence.
              </p>
              <Link to="/diagnostics" className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm uppercase tracking-wider shadow-glow hover:opacity-90 transition-all">
                <Zap size={18} /> Start Free Assessment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-16 border-t border-primary-foreground/5">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-16">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-glow">
                  <Dna size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-foreground tracking-tight font-display">AruviAI</h3>
                  <p className="text-[10px] font-bold text-primary-foreground/40 uppercase tracking-widest">Clinical Intelligence OS</p>
                </div>
              </div>
              <p className="text-sm text-primary-foreground/50 leading-relaxed max-w-xs mb-6">
                Accelerating preventative medicine through clinical diagnostic intelligence at institutional scale.
              </p>
              <div className="flex gap-3">
                {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/40 hover:text-primary hover:bg-primary/10 cursor-pointer transition-all">
                    <Icon size={17} />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { title: 'Core Protocol', links: ['Neural Engine', 'Data Ingestion', 'SHAP Audit', 'Clinical Nodes'] },
                { title: 'Collaboration', links: ['Practitioner Hub', 'Hospital Nets', 'Research Labs', 'API Uplink'] },
                { title: 'Compliance', links: ['Privacy Policy', 'HIPAA Shield', 'ISO 27001', 'Terms of Use'] },
              ].map((section, i) => (
                <div key={i}>
                  <h4 className="text-[11px] font-bold text-primary-foreground uppercase tracking-widest mb-5">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors flex items-center gap-1.5 group">
                          {link}
                          <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-primary-foreground/10 pt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-[10px] font-bold text-primary-foreground/40 uppercase tracking-widest">HIPAA Secured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe size={14} className="text-clinical-blue" />
                <span className="text-[10px] font-bold text-primary-foreground/40 uppercase tracking-widest">ISO 27001</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] text-primary-foreground/30">v4.0.2-ALPHA</span>
              <div className="w-px h-3 bg-primary-foreground/10" />
              <p className="text-xs text-primary-foreground/30">© 2026 AruviAI — Clinical Intelligence Platform.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
