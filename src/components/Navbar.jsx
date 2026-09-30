import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChromeLogo from './ChromeLogo';
import { Menu, X, ChevronRight, ArrowRight } from 'lucide-react';

const CWS_URL = 'https://chromewebstore.google.com/detail/ijcnikejbjffhcnblofckaihgchkiged?utm_source=item-share-cb';

function GithubIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

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

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '#demo', label: 'Interactive Demo' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#showcase', label: 'Interface' },
    { href: '#privacy', label: 'Local-First' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? '1px solid rgba(0, 65, 101, 0.08)' : '1px solid transparent',
          transition: 'all 0.25s ease',
        }}
      >
        <div className="container nav-container">
          {/* Brand Logo & Two-Tone Wordmark */}
          <a
            href="/"
            aria-label="TAB Explorer Home"
            className="brand-link"
          >
            <img
              src="/assets/logo.png"
              alt="TAB Explorer Logo"
              className="brand-logo-img"
              onError={(e) => {
                e.currentTarget.src = './assets/logo.png';
              }}
            />
            <span className="brand-wordmark">
              <span style={{ color: 'var(--color-brand)' }}>TAB</span>{' '}
              <span style={{ color: 'var(--color-ink)' }}>Explorer</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="nav-actions">
            {/* CTA Button — Responsive (compact on tablet, hidden on phone to prevent crowding) */}
            <a
              href={CWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary nav-header-cta"
              title="Install TAB Explorer on Chrome Web Store"
            >
              <ChromeLogo size={18} />
              <span className="nav-cta-text">Add to Chrome</span>
            </a>

            {/* Mobile / Tablet Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger-btn"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              {mobileMenuOpen ? <X size={22} strokeWidth={2.4} /> : <Menu size={22} strokeWidth={2.4} />}
            </button>
          </div>
        </div>

        {/* Mobile Animated Dropdown Drawer & Backdrop */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Dimmed backdrop overlay to dismiss when clicked outside */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-backdrop"
              />

              {/* Drawer Sheet */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="mobile-menu-drawer"
              >
                <div className="mobile-nav-links">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-item"
                    >
                      <span>{link.label}</span>
                      <ChevronRight size={18} className="mobile-nav-chevron" />
                    </a>
                  ))}
                </div>

                {/* Primary Add to Chrome CTA in mobile drawer */}
                <div className="mobile-drawer-cta-wrapper">
                  <a
                    href={CWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary mobile-drawer-cta"
                    title="Install TAB Explorer on Chrome Web Store"
                  >
                    <ChromeLogo size={20} />
                    <span>Add to Chrome — It’s Free</span>
                    <ArrowRight size={17} strokeWidth={2.4} />
                  </a>

                  <div className="mobile-drawer-footer">
                    <a
                      href="https://github.com/Iyuu8/TAB-Explorer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-drawer-sublink"
                    >
                      <GithubIcon size={15} />
                      <span>Open Source on GitHub</span>
                    </a>
                    <span className="mobile-drawer-subbadge">No Account Required</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <style>{`
          .nav-container {
            display: flex;
            align-items: center;
            justifyContent: space-between;
            height: 72px;
            transition: height 0.2s ease;
          }

          .brand-link {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            flex-shrink: 0;
          }

          .brand-logo-img {
            width: 38px;
            height: 38px;
            object-fit: contain;
            border-radius: 9px;
            flex-shrink: 0;
            transition: width 0.2s ease, height 0.2s ease;
          }

          .brand-wordmark {
            font-size: clamp(18px, 4vw, 22px);
            font-family: var(--font-display);
            fontWeight: 700;
            letter-spacing: -0.4px;
            line-height: 1;
            white-space: nowrap;
          }

          .desktop-nav {
            display: none;
            align-items: center;
            gap: 28px;
          }

          .nav-link {
            color: var(--color-text-secondary);
            font-size: 14.5px;
            font-weight: 500;
            transition: color 0.15s ease;
            text-decoration: none;
            white-space: nowrap;
          }

          .nav-link:hover {
            color: var(--color-brand);
          }

          .nav-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
          }

          .nav-header-cta {
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 600;
          }

          .mobile-hamburger-btn {
            display: none;
            width: 42px;
            height: 42px;
            border-radius: 10px;
            border: 1px solid var(--color-border);
            background-color: #FFFFFF;
            color: var(--color-ink);
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            box-shadow: 0 1px 3px rgba(0, 65, 101, 0.06);
            transition: all 0.15s ease;
          }

          .mobile-hamburger-btn:hover {
            background-color: var(--color-mist);
            border-color: var(--color-line-blue);
            color: var(--color-deep-blue);
          }

          .mobile-hamburger-btn:active {
            transform: scale(0.96);
          }

          /* Mobile Menu Overlay & Drawer */
          .mobile-menu-backdrop {
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 98;
          }

          .mobile-menu-drawer {
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            max-height: calc(100vh - 64px);
            overflow-y: auto;
            background-color: #FFFFFF;
            border-bottom: 1px solid var(--color-border);
            box-shadow: 0 16px 36px -8px rgba(0, 65, 101, 0.16);
            padding: 18px 20px 28px;
            z-index: 99;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .mobile-nav-links {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .mobile-nav-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            border-radius: 10px;
            color: var(--color-ink);
            font-size: 15.5px;
            font-weight: 600;
            text-decoration: none;
            transition: background-color 0.15s ease, color 0.15s ease;
          }

          .mobile-nav-item:hover,
          .mobile-nav-item:active {
            background-color: #F0FAFF;
            color: var(--color-brand);
          }

          .mobile-nav-chevron {
            color: var(--color-text-muted);
            transition: transform 0.15s ease, color 0.15s ease;
          }

          .mobile-nav-item:hover .mobile-nav-chevron {
            color: var(--color-brand);
            transform: translateX(2px);
          }

          .mobile-drawer-cta-wrapper {
            padding-top: 14px;
            border-top: 1px solid var(--color-border-subtle);
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .mobile-drawer-cta {
            width: 100%;
            padding: 14px 20px;
            font-size: 15.5px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .mobile-drawer-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12.5px;
            color: var(--color-text-muted);
            padding: 4px 6px 0;
            flex-wrap: wrap;
            gap: 8px;
          }

          .mobile-drawer-sublink {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--color-text-secondary);
            text-decoration: none;
            font-weight: 500;
          }

          .mobile-drawer-sublink:hover {
            color: var(--color-brand);
          }

          .mobile-drawer-subbadge {
            background-color: #EAF4FA;
            color: #004165;
            padding: 2px 8px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 11px;
          }

          /* Breakpoint behaviors */
          @media (min-width: 860px) {
            .desktop-nav {
              display: flex;
            }
            .mobile-hamburger-btn {
              display: none !important;
            }
          }

          @media (max-width: 859px) {
            .desktop-nav {
              display: none !important;
            }
            .mobile-hamburger-btn {
              display: flex !important;
            }
            .nav-container {
              height: 64px;
            }
          }

          /* On mobile phones (< 560px), hide desktop CTA from header to prevent crowding */
          @media (max-width: 559px) {
            .nav-header-cta {
              display: none !important;
            }
            .brand-logo-img {
              width: 33px;
              height: 33px;
            }
            .mobile-menu-backdrop,
            .mobile-menu-drawer {
              top: 64px;
            }
          }

          @media (max-width: 380px) {
            .brand-wordmark {
              font-size: 17px;
            }
          }
        `}</style>
      </motion.header>
    </>
  );
}

