import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, Check } from 'lucide-react';
import postsData from '../../posts/posts-data.json';
import BlogCTA from './BlogCTA';

export default function BlogPost() {
  const { slug } = useParams();
  const [copied, setCopied] = React.useState(false);

  const post = postsData.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (post) {
      document.title = `${post.title} — TAB Explorer Blog`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', post.description);
      }
    }
  }, [post]);

  if (!post) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', backgroundColor: '#FAFCFE', minHeight: '70vh' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-ink)', marginBottom: '16px' }}>
          Post Not Found
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          The article you are looking for does not exist or may have been moved.
        </p>
        <Link to="/blog" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', padding: '10px 24px' }}>
          <ArrowLeft size={16} />
          <span>Back to All Articles</span>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article style={{ backgroundColor: '#FAFCFE', minHeight: '85vh', paddingBottom: '100px' }}>
      {/* Header Container */}
      <header
        style={{
          paddingTop: '54px',
          paddingBottom: '44px',
          borderBottom: '1px solid #E2EBF2',
          backgroundColor: '#FFFFFF',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '820px' }}>
          {/* Breadcrumb row & Back link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/" style={{ color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 500 }}>
                Home
              </Link>
              <span>/</span>
              <Link to="/blog" style={{ color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 500 }}>
                Blog
              </Link>
              <span>/</span>
              <span style={{ color: 'var(--color-ink)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                {post.title}
              </span>
            </div>

            <Link
              to="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--color-deep-blue)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              <ArrowLeft size={14} />
              <span>All Articles</span>
            </Link>
          </div>

          {/* Badges / Meta */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              marginBottom: '16px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '100px',
                backgroundColor: '#EAF4FA',
                color: 'var(--color-brand)',
                fontWeight: 700,
                fontSize: '12px',
              }}
            >
              {post.category}
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={13} />
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </span>

            <span>•</span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} />
              <span>{post.readTime}</span>
            </span>

            <span>•</span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <User size={13} />
              <span>{post.author}</span>
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(28px, 4.8vw, 44px)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.8px',
              lineHeight: 1.25,
              color: 'var(--color-ink)',
              marginBottom: '20px',
            }}
          >
            {post.title}
          </h1>

          {/* Lead description */}
          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              marginBottom: '24px',
            }}
          >
            {post.description}
          </p>

          {/* Author info & Share button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '18px',
              borderTop: '1px solid #F1F5F9',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-brand)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                {post.author.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>{post.author}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>TAB Explorer Contributor</div>
              </div>
            </div>

            <button
              onClick={handleShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '100px',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2EBF2',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--color-deep-blue)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? <Check size={14} color="#10B981" /> : <Share2 size={14} />}
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Article Body Content */}
      <main className="container" style={{ maxWidth: '820px', paddingTop: '44px' }}>
        <div
          className="blog-content-body"
          dangerouslySetInnerHTML={{ __html: post.html }}
          style={{
            fontSize: '17px',
            lineHeight: 1.75,
            color: '#1E293B',
          }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '44px',
              paddingTop: '24px',
              borderTop: '1px solid #E2EBF2',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>Tagged with:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  backgroundColor: '#EAF4FA',
                  color: 'var(--color-brand)',
                  fontWeight: 600,
                }}
              >
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Requirement 4: End-of-post box linking to Chrome Web Store page */}
        <BlogCTA />

        {/* Back to blog navigation footer */}
        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <Link
            to="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-brand)',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '100px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D2E7F5',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to all articles</span>
          </Link>
        </div>
      </main>

      <style>{`
        .blog-content-body h2 {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--color-ink);
          margin-top: 48px;
          margin-bottom: 18px;
          line-height: 1.3;
        }
        .blog-content-body h3 {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--color-ink);
          margin-top: 32px;
          margin-bottom: 14px;
        }
        .blog-content-body p {
          margin-bottom: 22px;
        }
        .blog-content-body ul, .blog-content-body ol {
          margin-bottom: 24px;
          padding-left: 28px;
        }
        .blog-content-body li {
          margin-bottom: 10px;
        }
        .blog-content-body strong {
          color: var(--color-ink);
          font-weight: 600;
        }
        .blog-content-body blockquote {
          margin: 32px 0;
          padding: 18px 24px;
          background-color: #F0FAFF;
          border-left: 4px solid var(--color-brand);
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: #004165;
        }
        .blog-content-body blockquote p {
          margin: 0;
        }
        .blog-content-body pre {
          background-color: #001E2F;
          color: #E2E8F0;
          padding: 20px;
          border-radius: 12px;
          overflow-x: auto;
          font-size: 13.5px;
          line-height: 1.6;
          margin: 28px 0;
        }
        .blog-content-body code {
          background-color: #EAF4FA;
          color: var(--color-deep-blue);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .blog-content-body pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        .blog-content-body hr {
          border: none;
          border-top: 1px solid #E2EBF2;
          margin: 44px 0;
        }
        .blog-content-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 32px 0;
          font-size: 14.5px;
        }
        .blog-content-body th, .blog-content-body td {
          border: 1px solid #D2E7F5;
          padding: 12px 16px;
          text-align: left;
        }
        .blog-content-body th {
          background-color: #F0FAFF;
          font-weight: 700;
          color: var(--color-ink);
        }
        .blog-content-body td {
          background-color: #FFFFFF;
        }
      `}</style>
    </article>
  );
}
