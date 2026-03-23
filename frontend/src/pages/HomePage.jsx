import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeatureShowcase } from '../components/FeatureShowcase';
import { HowItWorks } from '../components/HowItWorks';
import { Statistics } from '../components/Statistics';
import { Testimonials } from '../components/Testimonials';
import { CTASection } from '../components/CTASection';
import { SymptomChecker } from '../components/SymptomChecker';
import { HealthRiskCards } from '../components/HealthRiskCards';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const openLogin = () => { window.location.href = '/login'; };
  const openDemo = () => { window.location.href = '/demo'; };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="relative">
        <HeroSection onTryAssessment={openDemo} onGetStarted={openLogin} />
        <Statistics />
        <HealthRiskCards />
        <FeatureShowcase />
        <SymptomChecker />
        <HowItWorks />
        <Testimonials />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
};

export default HomePage;
