import React from 'react';
import ChromeLogo from '../ChromeLogo';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CWS_URL = 'https://chromewebstore.google.com/detail/tab-explorer/ijcnikejbjffhcnblofckaihgchkiged';

export default function BlogCTA() {
  return (
    <div
      className="bento-card blog-cta-box"
      style={{
        marginTop: '56px',
        marginBottom: '24px',
        padding: '36px 32px',
        backgroundColor: '#FAFCFE',
        border: '1px solid #D2E7F5',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient gradient highlight */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(32, 128, 255, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '24px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* App Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D2E7F5',
            boxShadow: '0 8px 24px -6px rgba(0, 65, 101, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img
            src="/assets/icon-128.png"
            alt="TAB Explorer Logo"
            style={{ width: '44px', height: '44px', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.src = './assets/icon-128.png'; }}
          />
        </div>

        {/* Text Content */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '100px',
              backgroundColor: '#EAF4FA',
              color: 'var(--color-brand)',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '10px',
            }}
          >
            <span>Chrome Side Panel Extension</span>
          </div>

          <h3
            style={{
              fontSize: '22px',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-ink)',
              letterSpacing: '-0.4px',
              lineHeight: 1.3,
              marginBottom: '8px',
            }}
          >
            Tired of browser tab clutter? Try TAB Explorer
          </h3>

          <p
            style={{
              fontSize: '14.5px',
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              marginBottom: '20px',
            }}
          >
            Organize open tabs into clean workspaces and color-coded folders directly inside Chrome’s native side panel. 100% local-first, zero telemetry, and free forever.
          </p>

          {/* CTA Button & Trust Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href={CWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 22px',
                fontSize: '14.5px',
                fontWeight: 600,
                borderRadius: '100px',
                boxShadow: '0 6px 20px -4px rgba(32, 128, 255, 0.4)',
                textDecoration: 'none',
              }}
              data-umami-event="install-click"
              data-umami-event-location="blog-post-footer"
            >
              <ChromeLogo size={18} />
              <span>Add to Chrome — It’s Free</span>
              <ArrowRight size={16} strokeWidth={2.4} />
            </a>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '12.5px',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#2080FF" />
                <span>100% Private</span>
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} color="#10B981" />
                <span>No Account Required</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
