import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HardDrive, EyeOff, FileJson } from 'lucide-react';

export default function PrivacyLocalFirst() {
  const pillars = [
    {
      icon: <HardDrive size={24} color="#2080FF" />,
      title: 'Stored On-Device',
      desc: 'All workspaces, folder structures, and saved tab links are persisted exclusively in chrome.storage.local on your computer.',
    },
    {
      icon: <EyeOff size={24} color="#2080FF" />,
      title: 'Zero Tracking Telemetry',
      desc: 'No analytics, no cookies, no page-content reading, and zero network calls to third-party databases. Complete privacy by design.',
    },
    {
      icon: <FileJson size={24} color="#2080FF" />,
      title: 'Portable JSON Backup',
      desc: 'Export your entire library to a human-readable JSON backup anytime. Import it onto any browser or workstation in one second.',
    },
    {
      icon: <ShieldCheck size={24} color="#2080FF" />,
      title: 'Open Source MIT',
      desc: 'Inspect the code yourself on GitHub. Transparent, auditable, and built for people who care about data autonomy.',
    },
  ];

  return (
    <section id="privacy" className="section section-alt" style={{ paddingTop: '90px', paddingBottom: '100px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: '-0.8px',
              color: 'var(--color-ink)',
              marginBottom: '16px',
            }}
          >
            Your browser data belongs entirely to you.
          </h2>

          <p
            style={{
              fontSize: '18px',
              color: 'var(--color-text-secondary)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Unlike cloud-based bookmark managers, TAB Explorer never asks you to create an account,
            never pings a remote server, and never sells your data.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bento-card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '32px 28px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-mist)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  border: '1px solid var(--color-border)',
                }}
              >
                {pillar.icon}
              </div>

              <h3
                style={{
                  fontSize: '19px',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  marginBottom: '10px',
                  letterSpacing: '-0.3px',
                }}
              >
                {pillar.title}
              </h3>

              <p
                style={{
                  fontSize: '14.5px',
                  lineHeight: 1.6,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
