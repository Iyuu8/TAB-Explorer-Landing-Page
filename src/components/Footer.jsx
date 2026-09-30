import React from 'react';

const CWS_URL = 'https://chromewebstore.google.com/detail/ijcnikejbjffhcnblofckaihgchkiged?utm_source=item-share-cb';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #D2E7F5',
        backgroundColor: '#FAFCFE',
        padding: '50px 0 36px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Logo & Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/assets/logo.png"
              alt="TAB Explorer Logo"
              style={{ width: '34px', height: '34px', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.src = './assets/logo.png'; }}
            />
            <span style={{ fontSize: '19px', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.3px' }}>
              <span style={{ color: 'var(--color-brand)' }}>TAB</span>{' '}
              <span style={{ color: 'var(--color-ink)' }}>Explorer</span>
            </span>
          </div>

          {/* Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
            }}
          >
            <a
              href={CWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-brand)', fontWeight: 600 }}
            >
              Chrome Web Store
            </a>
            <a
              href="#demo"
              style={{ transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--color-ink)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-secondary)')}
            >
              Interactive Demo
            </a>
            <a
              href="https://github.com/Iyuu8/TAB-Explorer"
              target="_blank"
              rel="noopener noreferrer"
              style={{ transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--color-ink)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-secondary)')}
            >
              GitHub Repository
            </a>
            <a
              href="https://github.com/Iyuu8/TAB-Explorer/blob/master/PRIVACY.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--color-ink)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-secondary)')}
            >
              Privacy Policy
            </a>
            <a
              href="https://github.com/Iyuu8/TAB-Explorer/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{ transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--color-ink)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-secondary)')}
            >
              Support & Feedback
            </a>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid #EAF4FA',
            fontSize: '12.5px',
            color: 'var(--color-text-muted)',
          }}
        >
          <div>
            Built by <strong>Benaziza Ayoub</strong> • Released under the MIT License.
          </div>
          <div>
            TAB Explorer is an independent extension not affiliated with Google LLC.
          </div>
        </div>
      </div>
    </footer>
  );
}
