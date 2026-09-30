import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChromeLogo from './ChromeLogo';
import InteractiveTreeDemo from './InteractiveTreeDemo';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  Play, 
  Lock, 
  Laptop 
} from 'lucide-react';

const CWS_URL = 'https://chromewebstore.google.com/detail/ijcnikejbjffhcnblofckaihgchkiged?utm_source=item-share-cb';

export default function Hero() {
  const [viewMode, setViewMode] = useState('interactive');

  return (
    <section
      className="section section-canvas"
      style={{
        paddingTop: '48px',
        paddingBottom: '90px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Refined ambient blur background backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '-180px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '960px',
          height: '620px',
          background: 'radial-gradient(ellipse at center, rgba(201, 228, 246, 0.45) 0%, rgba(240, 250, 255, 0.15) 55%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Hero Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(30px, 6.2vw, 64px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            lineHeight: 1.22,
            letterSpacing: '-1px',
            maxWidth: '920px',
            margin: '0 auto 20px',
            color: 'var(--color-ink)',
          }}
        >
          Turn browser tab chaos into a clean, searchable workspace.
        </motion.h1>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(15.5px, 2vw, 19px)',
            lineHeight: 1.55,
            color: 'var(--color-text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 34px',
            fontWeight: 400,
          }}
        >
          TAB Explorer docks right into Chrome’s side panel. Organize open tabs into Workspaces,
          color-coded Folders, and Links—just like files on your computer.
        </motion.p>

        {/* =========================================================================
            THE BIG, APPARENT, UNMISSABLE "ADD TO CHROME" CTA
            First thing eyes see upon landing! Direct link to Chrome Web Store.
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '18px' }}
        >
          <a
            href={CWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-cta"
            title="Add TAB Explorer to Chrome for free"
            id="hero-add-to-chrome-btn"
          >
            <ChromeLogo size={24} />
            <span>Add to Chrome — It’s Free</span>
            <ArrowRight size={19} strokeWidth={2.4} />
          </a>
        </motion.div>

        {/* Secondary ghost button & micro trust proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '18px',
          }}
        >
          <a href="#how-it-works" className="btn-ghost" style={{ padding: '11px 24px', fontSize: '14.5px' }}>
            <Play size={14} fill="currentColor" />
            <span>See How It Works</span>
          </a>
        </motion.div>

        {/* Trust indicators (NO EMOJIS, crisp modern icons) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          className="hero-trust-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            fontSize: '13.5px',
            color: 'var(--color-text-secondary)',
            marginBottom: '54px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ChromeLogo size={16} />
            <strong style={{ color: 'var(--color-ink)', fontWeight: 600 }}>Chrome Web Store</strong>
          </span>
          <span className="hero-trust-dot" style={{ color: 'var(--color-border)' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#2080FF" />
            <span>100% Local-First Storage</span>
          </span>
          <span className="hero-trust-dot" style={{ color: 'var(--color-border)' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span>No Account Required</span>
          </span>
        </motion.div>

        {/* =========================================================================
            INTERACTIVE DEMO SECTION INTRO
           ========================================================================= */}
        <motion.div
          id="demo"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 36px',
            scrollMarginTop: '100px',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 4.5vw, 36px)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.8px',
              marginBottom: '10px',
              lineHeight: 1.28,
            }}
          >
            Interactive Demo
          </h2>
          <p
            style={{
              fontSize: '14.5px',
              color: '#5B6B79',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Please note that not all functionalities are implemented in this web demo. Certain native browser operations, automatic session tracking, and background tab controls require the installed Chrome extension.
          </p>
        </motion.div>

        {/* =========================================================================
            HERO VISUAL ANCHOR:
            Chrome Browser Window with Docked TAB Explorer Side Panel
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hero-browser-window"
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            borderRadius: '18px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0, 65, 101, 0.14)',
            boxShadow: '0 20px 60px -15px rgba(0, 65, 101, 0.12), 0 0 1px 1px rgba(0, 65, 101, 0.05)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {/* Chrome Browser Window Top Chrome Bar */}
          <div
            className="hero-browser-chrome-bar"
            style={{
              backgroundColor: '#F0FAFF',
              borderBottom: '1px solid #D2E7F5',
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            {/* Window Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#FF5F56', display: 'inline-block' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#FFBD2E', display: 'inline-block' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#27C93F', display: 'inline-block' }} />
            </div>

            {/* Fake Chrome Address / Omni Bar */}
            <div
              className="hero-browser-omnibar"
              style={{
                flex: 1,
                maxWidth: '540px',
                height: '30px',
                backgroundColor: '#FFFFFF',
                borderRadius: '100px',
                border: '1px solid #D2E7F5',
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                fontSize: '12px',
                color: '#5B6B79',
                gap: '8px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              <Lock size={12} color="#10B981" style={{ flexShrink: 0 }} />
              <span style={{ fontWeight: 500, color: '#111827' }}>chrome-extension://</span>
              <span style={{ color: '#004165', textOverflow: 'ellipsis', overflow: 'hidden' }}>tab-explorer/sidepanel.html</span>
            </div>

            {/* View Mode Toggle: Interactive vs Store Screenshot */}
            <div
              className="hero-viewmode-toggle"
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D2E7F5',
                borderRadius: '100px',
                padding: '2px',
                gap: '2px',
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setViewMode('interactive')}
                className="hero-viewmode-btn"
                style={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  backgroundColor: viewMode === 'interactive' ? '#2080FF' : 'transparent',
                  color: viewMode === 'interactive' ? '#FFFFFF' : '#4B5563',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                  border: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <Sparkles size={12} />
                <span>Interactive Panel</span>
              </button>
              <button
                onClick={() => setViewMode('screenshot')}
                className="hero-viewmode-btn"
                style={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  backgroundColor: viewMode === 'screenshot' ? '#2080FF' : 'transparent',
                  color: viewMode === 'screenshot' ? '#FFFFFF' : '#4B5563',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                  border: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <Eye size={12} />
                <span>Real Chrome Screenshot</span>
              </button>
            </div>
          </div>

          {/* Browser Interior: Left Content (Simulated Web Page) + Right (Docked TAB Explorer Side Panel) */}
          {viewMode === 'interactive' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 380px',
                minHeight: '620px',
                backgroundColor: '#FAFCFE',
              }}
              className="hero-browser-grid"
            >
              {/* Left Side: Clean Simulated Active Web Tab */}
              <div
                style={{
                  padding: '40px 48px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRight: '1px solid #E2EBF2',
                  backgroundColor: '#FFFFFF',
                }}
                className="hero-browser-left"
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 12px',
                      borderRadius: '100px',
                      backgroundColor: '#EAF4FA',
                      color: '#004165',
                      fontSize: '12px',
                      fontWeight: 600,
                      marginBottom: '20px',
                    }}
                  >
                    <Laptop size={14} color="#004165" />
                    <span>Active Tab: Machine Learning Research & Papers</span>
                  </div>

                  <h3
                    style={{
                      fontSize: '28px',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      color: '#0F172A',
                      letterSpacing: '-0.6px',
                      marginBottom: '16px',
                      lineHeight: 1.25,
                    }}
                  >
                    Your browsing window stays uncluttered while you research.
                  </h3>

                  <p
                    style={{
                      fontSize: '15px',
                      lineHeight: 1.6,
                      color: '#475569',
                      marginBottom: '28px',
                    }}
                  >
                    TAB Explorer docks seamlessly into Chrome’s native side panel.
                    Interact with the real panel on the right: switch workspaces, expand color-coded folders,
                    or simulate saving current tabs.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '14px',
                    }}
                  >
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        backgroundColor: '#F0FAFF',
                        border: '1px solid #D2E7F5',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#004165', marginBottom: '4px' }}>
                        1-Click Tab Saving
                      </div>
                      <div style={{ fontSize: '12px', color: '#5B6B79' }}>
                        Press <kbd style={{ background: '#FFF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #BCDDF2', fontFamily: 'monospace' }}>Ctrl+Shift+S</kbd> to save all open tabs.
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        backgroundColor: '#F0FAFF',
                        border: '1px solid #D2E7F5',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#004165', marginBottom: '4px' }}>
                        Color-Coded Trees
                      </div>
                      <div style={{ fontSize: '12px', color: '#5B6B79' }}>
                        Organize with the exact 6 signature extension folder colors.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom hint */}
                <div
                  style={{
                    paddingTop: '20px',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#64748B',
                  }}
                >
                  <span>Interactive preview docked to the right</span>
                  <span style={{ color: '#2080FF', fontWeight: 600 }}>Try clicking folders & tabs</span>
                </div>
              </div>

              {/* Right Side: The Interactive TAB Explorer Side Panel Component */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <InteractiveTreeDemo />
              </div>
            </div>
          ) : (
            /* Screenshot view of the real extension running in Chrome */
            <div style={{ position: 'relative', backgroundColor: '#F0FAFF' }}>
              <img
                src="/assets/screenshot-1-overview.png"
                alt="TAB Explorer Side Panel Overview in Chrome"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
                onError={(e) => {
                  e.currentTarget.src = './assets/screenshot-1-overview.png';
                }}
              />
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-browser-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-browser-left {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .hero-browser-omnibar {
            display: none !important;
          }
          .hero-browser-chrome-bar {
            padding: 8px 12px !important;
          }
          .hero-trust-dot {
            display: none !important;
          }
          .hero-trust-row {
            gap: 10px 16px !important;
          }
        }
        @media (max-width: 440px) {
          .hero-viewmode-btn span {
            font-size: 10.5px;
          }
          .hero-viewmode-btn {
            padding: 3px 8px !important;
          }
        }
      `}</style>
    </section>
  );
}
