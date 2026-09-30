import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, RotateCcw, Search, Sparkles, Check } from 'lucide-react';

export default function Showcase() {
  const [activeTab, setActiveTab] = useState(0);

  const screens = [
    {
      id: 'overview',
      label: 'Side Panel Docked',
      icon: <Layers size={16} />,
      title: 'Seamlessly Integrated with Chrome',
      subtitle: 'TAB Explorer stays docked alongside whatever you are browsing. No popups that disappear when you click outside.',
      image: '/assets/screenshot-1-overview.png',
      highlights: [
        'Chrome native side panel integration',
        'Works across all browser windows',
        'Quick-action toolbar always accessible',
      ],
    },
    {
      id: 'organization',
      label: 'Workspaces & Tree',
      icon: <Sparkles size={16} />,
      title: 'Organize by Workspaces, Folders & Smart Favicons',
      subtitle: 'Create independent workspaces for distinct contexts. Auto-detects icons for major platforms like ChatGPT, Claude, GitHub, and Notion.',
      image: '/assets/screenshot-2-organization.png',
      highlights: [
        '6 signature folder colors',
        'Automatic smart favicons & fallbacks',
        'Star folders to pin to top',
      ],
    },
    {
      id: 'restore',
      label: 'Session Restore',
      icon: <RotateCcw size={16} />,
      title: 'Smart Tab Capture & 1-Click Session Restore',
      subtitle: 'Never lose a research session again. Capture current windows in Append or Replace mode, and restore previous tabs on crash recovery.',
      image: '/assets/screenshot-3-session-restore.png',
      highlights: [
        'Automatic background session snapshots',
        'Append or Replace save modes',
        'Ctrl+Shift+S instant keyboard shortcut',
      ],
    },
    {
      id: 'search',
      label: 'Instant Search',
      icon: <Search size={16} />,
      title: 'Instant Cross-Workspace Search',
      subtitle: 'One unified search bar filters folders and links across all workspaces simultaneously in real-time.',
      image: '/assets/screenshot-4-customization.png',
      highlights: [
        'Searches across all workspaces',
        'Real-time keystroke filtering',
        'Shows full folder ancestry paths',
      ],
    },
  ];

  const current = screens[activeTab];

  return (
    <section id="showcase" className="section section-canvas" style={{ paddingTop: '90px', paddingBottom: '100px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: 'var(--color-ink)',
              marginBottom: '16px',
            }}
          >
            Explore the interface in detail
          </h2>

          <p
            style={{
              fontSize: '18px',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto 32px',
            }}
          >
            Every pixel was designed specifically for Chrome’s side panel: compact, responsive, and familiar.
          </p>

          {/* Tab Switcher Pills */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-mist)',
              border: '1px solid var(--color-border)',
              borderRadius: '100px',
              padding: '4px',
              gap: '4px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {screens.map((item, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    backgroundColor: isActive ? 'var(--color-action)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--color-ink)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? 'var(--shadow-cta-glow)' : 'none',
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Showcase Stage */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bento-card"
          style={{
            backgroundColor: '#FAFCFE',
            border: '1px solid var(--color-border)',
            padding: '36px',
            borderRadius: '22px',
          }}
        >
          {/* Header Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '28px',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <h3
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px',
                }}
              >
                {current.title}
              </h3>
              <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {current.subtitle}
              </p>
            </div>

            {/* Highlights pill tags (No emojis, clean check icon) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {current.highlights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '13px',
                    color: '#004165',
                    backgroundColor: '#EAF4FA',
                    border: '1px solid #CDE6F7',
                    padding: '5px 12px',
                    borderRadius: '100px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={14} color="#2080FF" strokeWidth={2.5} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshot Display Frame */}
          <div
            style={{
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid #D2E7F5',
              boxShadow: '0 16px 40px -15px rgba(0, 65, 101, 0.12)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <img
              src={current.image}
              alt={current.title}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                transition: 'opacity 0.25s ease',
              }}
              onError={(e) => {
                e.currentTarget.src = `.${current.image}`;
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
