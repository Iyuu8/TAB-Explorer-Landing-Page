import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar, Save, Search, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Open Chrome’s Side Panel',
      description:
        'Click the TAB Explorer icon in your browser toolbar. The panel docks directly to the right of your browsing window, remaining visible as you switch tabs.',
      icon: <Sidebar size={26} color="#2080FF" />,
      detail: 'Docks seamlessly without covering page content.',
    },
    {
      num: '02',
      title: 'Save Tabs in 1 Click',
      description:
        'Hit Save Tabs or press Ctrl+Shift+S. Choose an existing folder or create a new one. Save in Append mode to add links, or Replace mode to take a clean snapshot.',
      icon: <Save size={26} color="#2080FF" />,
      detail: 'Internal browser tabs are filtered out automatically.',
    },
    {
      num: '03',
      title: 'Find & Reopen Anytime',
      description:
        'Search across all workspaces with instantaneous filtering. Click any folder or link to open it, throttled in batches so your browser never lags.',
      icon: <Search size={26} color="#2080FF" />,
      detail: 'Throttled batching protects Chrome from RAM spikes.',
    },
  ];

  return (
    <section id="how-it-works" className="section section-alt" style={{ paddingTop: '90px', paddingBottom: '100px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
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
            How TAB Explorer simplifies your browser
          </h2>

          <p
            style={{
              fontSize: '18px',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Three simple steps that replace fragile temporary bookmarks with permanent file-like order.
          </p>
        </motion.div>

        {/* 3 Step Cards with Framer Motion staggered entrance */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
          }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="bento-card step-card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div>
                {/* Step Number + Icon Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '34px',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      color: 'var(--color-line-blue)',
                      letterSpacing: '-1px',
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
                  </span>

                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-mist)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    marginBottom: '14px',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: '15.5px',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '20px',
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Detail note (Clean, no lamp emoji/icon) */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-canvas-alt)',
                  border: '1px solid var(--color-border)',
                  fontSize: '12.5px',
                  color: 'var(--color-deep-blue)',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={15} color="#2080FF" style={{ flexShrink: 0 }} />
                <span>{step.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .step-card {
          padding: 36px 30px;
        }
        @media (max-width: 640px) {
          .step-card {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
