import React, { useEffect } from 'react';
import Hero from './Hero';
import TrustBar from './TrustBar';
import FeatureIntro from './FeatureIntro';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Showcase from './Showcase';
import PrivacyLocalFirst from './PrivacyLocalFirst';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';

export default function LandingPage() {
  useEffect(() => {
    document.title = 'TAB Explorer — The File Explorer for Chrome Tabs';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        "TAB Explorer transforms your browser tabs into a structured, file-explorer-style workspace right inside Chrome's side panel. 100% local, ultra-fast, and free."
      );
    }
  }, []);

  return (
    <>
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
    </>
  );
}
