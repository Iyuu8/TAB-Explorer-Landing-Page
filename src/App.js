import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import FeatureIntro from './components/FeatureIntro';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Showcase from './components/Showcase';
import PrivacyLocalFirst from './components/PrivacyLocalFirst';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="tab-explorer-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation Bar */}
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* Hero Section with Prominent Add to Chrome CTA & Interactive Mockup */}
        <Hero />

        {/* Technical Trust Bar */}
        <TrustBar />

        {/* Signature Brand Gradient Display Headline */}
        <FeatureIntro />

        {/* Bento Grid Architecture with Interactive Feature Previews */}
        <Features />

        {/* How It Works 3-Step Section */}
        <HowItWorks />

        {/* Product Showcase with Store Screenshots */}
        <Showcase />

        {/* Local-First Data Autonomy Section */}
        <PrivacyLocalFirst />

        {/* Practical Answers to Real Questions */}
        <FAQ />

        {/* Final Add to Chrome CTA with enlarged logo */}
        <FinalCTA />
      </main>

      {/* Minimalist Footer */}
      <Footer />
    </div>
  );
}
