import React from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint';

const DemoPage = () => {
    const { isMobile, isTablet } = useBreakpoint();

    return (
        <div className="bg-[#060d0a] min-h-screen flex flex-col items-center justify-center py-24 md:py-32 px-4 sm:px-8 md:px-12 relative">

            {/* Nav back */}
            <div className="fixed top-0 left-0 right-0 bg-[#060d0a]/90 backdrop-blur-xl border-b border-[#0fd68c]/10 px-6 md:px-16 py-4 flex items-center justify-between z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0fd68c]/10 border border-[#0fd68c]/25 rounded-xl flex items-center justify-center p-1.5 md:p-2">
                        <span className="text-[#0fd68c] text-sm md:text-base font-black font-[Syne]">A</span>
                    </div>
                    <span className="text-white font-[Syne] font-black text-sm md:text-lg">AruviAI</span>
                </div>
                <a href="/" className="text-white/45 text-xs md:text-sm no-underline flex items-center gap-2 font-[DM_Sans] font-medium hover:text-white transition-colors">
                    ← <span className="hidden sm:inline">Return to Hub</span>
                </a>
            </div>

            <div className="w-full max-w-5xl text-center z-10">
                {/* Tag */}
                <p className="text-[#0fd68c] text-[0.65rem] md:text-xs font-black tracking-[0.15em] uppercase mb-4 md:mb-5 font-[Syne]">
                    ✦ System Walkthrough V4.3.1
                </p>
                <h1 className="text-white font-[Syne] font-black text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] tracking-[-0.04em] leading-[0.92] mb-6 md:mb-8">
                    Application Demo.
                </h1>
                <p className="text-white/40 text-sm sm:text-base md:text-lg mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed font-[DM_Sans]">
                    See the AI diagnostic workflow in action — a complete clinical demonstration showcasing predictive diagnostics and institutional sovereignty.
                </p>

                {/* Video frame */}
                <div className="bg-[#0a1410] border border-[#0fd68c]/15 rounded-3xl overflow-hidden mb-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <div className="bg-[#0fd68c]/5 border-b border-[#0fd68c]/10 px-4 md:px-6 py-4 flex items-center gap-2 md:gap-3">
                        <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full" />
                        <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-500 rounded-full" />
                        <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#0fd68c] rounded-full" />
                        <span className="text-white/35 text-[0.65rem] md:text-xs ml-2 md:ml-3 font-[Syne] tracking-[0.1em] font-bold">SYSTEM_OS_CLINICAL_DEMO_4.MP4</span>
                    </div>
                    {/* Placeholder for video */}
                    <div className="w-full aspect-video bg-[#060d0a] flex items-center justify-center relative">
                         <video controls className="w-full h-full block object-cover">
                            <source src="/demo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-[#0fd68c]/10 rounded-3xl overflow-hidden mb-12">
                    {[
                        { title: 'Clean Interface', desc: 'Hospital-grade UI designed for both patients and healthcare professionals' },
                        { title: 'Patient Data Collection', desc: 'Demographics, vitals, lab values, and medical history in one form' },
                        { title: 'Multi-Disease Analysis', desc: 'Heart, stroke, diabetes, kidney, and liver screened simultaneously' },
                        { title: 'Real-Time ML Predictions', desc: 'Risk scores with stratification levels in under 2 seconds' },
                        { title: 'Clinical-Grade Reports', desc: 'Structured reports with evidence-based recommendations' },
                        { title: 'Explainable Results', desc: 'SHAP transparency showing exactly why each risk was flagged' },
                    ].map((f, i) => (
                        <div key={f.title} className="bg-[#0a1410] p-8 md:p-10 text-left transition-colors hover:bg-[#0fd68c]/5">
                            <div className="w-2.5 h-2.5 bg-[#0fd68c] rounded-full mb-4" />
                            <p className="text-white font-[Syne] font-black text-sm md:text-base mb-3">{f.title}</p>
                            <p className="text-white/45 text-xs md:text-sm leading-relaxed font-[DM_Sans]">{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="/consultation" className="w-full sm:w-auto bg-[#0fd68c] text-[#060d0a] font-[Syne] font-black py-4 px-10 rounded-full no-underline text-xs md:text-sm shadow-[0_20px_40px_rgba(15,214,140,0.2)] hover:scale-105 hover:shadow-[0_20px_40px_rgba(15,214,140,0.3)] transition-all uppercase tracking-widest text-center">
                        Initiate Assessment →
                    </a>
                    <a href="/" className="w-full sm:w-auto border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-[Syne] font-bold py-4 px-10 rounded-full no-underline text-xs md:text-sm transition-all text-center">
                        Return to Hub
                    </a>
                </div>

                {/* Disclaimer */}
                <p className="text-white/15 text-[0.65rem] md:text-xs mt-16 md:mt-24 tracking-[0.05em] leading-[1.8] font-[DM_Sans] max-w-4xl mx-auto uppercase">
                    THIS DEMONSTRATION SHOWS THE COMPLETE HEALTH ASSESSMENT WORKFLOW. ALL RESULTS MUST BE INTERPRETED BY CERTIFIED MEDICAL PROFESSIONALS. THIS IS A SECOND OPINION TOOL TO ASSIST, NOT REPLACE, PROFESSIONAL MEDICAL JUDGMENT AND CLINICAL DISCRETION.
                </p>
            </div>
        </div>
    );
};

export default DemoPage;
