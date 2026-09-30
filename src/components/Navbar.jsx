import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChromeLogo from './ChromeLogo';
import { Menu, X } from 'lucide-react';

const CWS_URL = 'https://chromewebstore.google.com/detail/ijcnikejbjffhcnblofckaihgchkiged?utm_source=item-share-cb';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isScrolled ? '1px solid rgba(0, 65, 101, 0.08)' : '1px solid transparent',
        transition: 'all 0.25s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Brand Logo & Two-Tone Wordmark */}
        <a
          href="/"
          aria-label="TAB Explorer Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <img
            src="/assets/logo.png"
            alt="TAB Explorer Logo"
            style={{
              width: '42px',
              height: '42px',
              objectFit: 'contain',
              borderRadius: '9px',
            }}
            onError={(e) => {
              e.currentTarget.src = './assets/logo.png';
            }}
          />
          <span
            style={{
              fontSize: '22px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              letterSpacing: '-0.4px',
              lineHeight: 1,
            }}
          >
            <span style={{ color: 'var(--color-brand)' }}>TAB</span>{' '}
            <span style={{ color: 'var(--color-ink)' }}>Explorer</span>
          </span>
        </a>

        {/* Center Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          <a href="#demo" className="nav-link">
            Interactive Demo
          </a>
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How it works
          </a>
          <a href="#showcase" className="nav-link">
            Interface
          </a>
          <a href="#privacy" className="nav-link">
            Local-First
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
        </nav>

        {/* Right CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href={CWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              padding: '11px 22px',
              fontSize: '14.5px',
              fontWeight: 600,
            }}
            title="Install TAB Explorer on Chrome Web Store"
          >
            <ChromeLogo size={18} />
            <span>Add to Chrome</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            style={{
              padding: '8px',
              color: 'var(--color-ink)',
              borderRadius: '8px',
              display: 'none',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            padding: '18px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-ink)', fontWeight: 500, fontSize: '16px' }}
          >
            Interactive Demo
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-ink)', fontWeight: 500, fontSize: '16px' }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-ink)', fontWeight: 500, fontSize: '16px' }}
          >
            How it works
          </a>
          <a
            href="#showcase"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-ink)', fontWeight: 500, fontSize: '16px' }}
          >
            Interface
          </a>
          <a
            href="#privacy"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-ink)', fontWeight: 500, fontSize: '16px' }}
          >
            Local-First
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-ink)', fontWeight: 500, fontSize: '16px' }}
          >
            FAQ
          </a>
        </div>
      )}

      <style>{`
        .nav-link {
          color: var(--color-text-secondary);
          font-size: 15px;
          font-weight: 500;
          transition: color 0.15s ease;
          text-decoration: none;
        }
        .nav-link:hover {
          color: var(--color-brand);
        }
        @media (min-width: 840px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 839px) {
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </motion.header>
  );
}
