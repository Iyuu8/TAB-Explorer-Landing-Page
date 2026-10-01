import React from 'react';
import { motion } from 'framer-motion';
import ChromeLogo from './ChromeLogo';
import { ArrowRight } from 'lucide-react';

const CWS_URL = 'https://chromewebstore.google.com/detail/ijcnikejbjffhcnblofckaihgchkiged?utm_source=item-share-cb';

function GithubIcon({ size = 18 }) {
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

export default function FinalCTA() {
  return (
    <section
      className="section section-canvas"
      style={{
        paddingTop: '110px',
        paddingBottom: '120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Refined ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(201, 228, 246, 0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
        {/* BIGGER, PROMINENT LOGO as requested by the user */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="final-cta-logo-box"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '28px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0, 65, 101, 0.12)',
            boxShadow: '0 16px 40px -10px rgba(0, 65, 101, 0.16)',
            marginBottom: '32px',
          }}
        >
          <img
            src="/assets/logo.png"
            alt="TAB Explorer Logo"
            className="final-cta-logo-img"
            style={{
              objectFit: 'contain',
            }}
            onError={(e) => { e.currentTarget.src = './assets/logo.png'; }}
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(28px, 5.5vw, 48px)',
            fontWeight: 800,
            letterSpacing: '-0.8px',
            color: 'var(--color-ink)',
            marginBottom: '18px',
            lineHeight: 1.25,
            fontFamily: 'var(--font-display)',
          }}
        >
          Ready to reclaim your browser from tab clutter?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(15.5px, 2vw, 18px)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.55,
            maxWidth: '620px',
            margin: '0 auto 40px',
          }}
        >
          Install TAB Explorer directly from the Chrome Web Store in seconds.
          Free forever, zero accounts required, 100% private.
        </motion.p>

        {/* Big Add to Chrome CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href={CWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-cta"
            title="Add TAB Explorer to Chrome"
            data-umami-event="install-click"
            data-umami-event-location="final-cta"
          >
            <ChromeLogo size={24} />
            <span>Add to Chrome — It’s Free</span>
            <ArrowRight size={19} strokeWidth={2.4} />
          </a>

          <a
            href="https://github.com/Iyuu8/TAB-Explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ padding: '16px 28px' }}
          >
            <GithubIcon size={18} />
            <span>View on GitHub</span>
          </a>
        </motion.div>

        <div
          style={{
            marginTop: '32px',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            padding: '0 10px',
          }}
        >
          Compatible with Google Chrome, Brave, Arc, Edge, and any Chromium browser.
        </div>
      </div>

      <style>{`
        .final-cta-logo-box {
          width: 120px;
          height: 120px;
        }
        .final-cta-logo-img {
          width: 92px;
          height: 92px;
        }
        @media (max-width: 640px) {
          .final-cta-logo-box {
            width: 88px;
            height: 88px;
            border-radius: 20px;
            margin-bottom: 24px !important;
          }
          .final-cta-logo-img {
            width: 66px;
            height: 66px;
          }
        }
      `}</style>
    </section>
  );
}
