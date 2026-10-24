import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found — TAB Explorer';
  }, []);

  return (
    <div
      style={{
        padding: '120px 24px',
        textAlign: 'center',
        backgroundColor: '#FAFCFE',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          backgroundColor: '#EAF4FA',
          color: 'var(--color-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          marginBottom: '24px',
        }}
      >
        404
      </div>

      <h1
        style={{
          fontSize: '36px',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          color: 'var(--color-ink)',
          marginBottom: '12px',
          letterSpacing: '-0.6px',
        }}
      >
        Page Not Found
      </h1>

      <p
        style={{
          fontSize: '16px',
          color: 'var(--color-text-secondary)',
          maxWidth: '460px',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}
      >
        The page you are looking for doesn't exist or has been moved. Use the links below to navigate back.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            padding: '11px 22px',
          }}
        >
          <Home size={16} />
          <span>Return to Home</span>
        </Link>

        <Link
          to="/blog"
          className="btn-ghost"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            padding: '11px 22px',
          }}
        >
          <BookOpen size={16} />
          <span>Explore Blog</span>
        </Link>
      </div>
    </div>
  );
}
