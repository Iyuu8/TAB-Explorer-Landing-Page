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

      // Initialize image sliders inside blog post
      window.__blogSliderGoTo = function (sliderId, index) {
        const container = document.getElementById(sliderId);
        if (!container) return;
        const track = container.querySelector('.blog-slider-track');
        const slides = container.querySelectorAll('.blog-slider-slide');
        if (!track || !slides || !slides[index]) return;
        track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
        container.setAttribute('data-active-index', index);
        container.querySelectorAll('.blog-slider-dot').forEach((dot, i) => {
          if (i === index) dot.classList.add('active');
          else dot.classList.remove('active');
        });
        const counter = container.querySelector('.blog-slider-current');
        if (counter) counter.textContent = index + 1;
      };

      window.__blogSliderPrev = function (sliderId) {
        const container = document.getElementById(sliderId);
        if (!container) return;
        const current = parseInt(container.getAttribute('data-active-index') || '0', 10);
        const slides = container.querySelectorAll('.blog-slider-slide');
        const next = current > 0 ? current - 1 : slides.length - 1;
        window.__blogSliderGoTo(sliderId, next);
      };

      window.__blogSliderNext = function (sliderId) {
        const container = document.getElementById(sliderId);
        if (!container) return;
        const current = parseInt(container.getAttribute('data-active-index') || '0', 10);
        const slides = container.querySelectorAll('.blog-slider-slide');
        const next = current < slides.length - 1 ? current + 1 : 0;
        window.__blogSliderGoTo(sliderId, next);
      };

      window.__initBlogSliders = function () {
        const sliders = document.querySelectorAll('.blog-slider-container');
        sliders.forEach((container) => {
          if (container.dataset.initialized) return;
          container.dataset.initialized = 'true';
          const track = container.querySelector('.blog-slider-track');
          const slides = container.querySelectorAll('.blog-slider-slide');
          if (!track || slides.length <= 1) return;

          let timer;
          track.addEventListener(
            'scroll',
            () => {
              clearTimeout(timer);
              timer = setTimeout(() => {
                const width = track.clientWidth || 1;
                const newIndex = Math.round(track.scrollLeft / width);
                if (newIndex >= 0 && newIndex < slides.length) {
                  container.setAttribute('data-active-index', newIndex);
                  container.querySelectorAll('.blog-slider-dot').forEach((dot, i) => {
                    if (i === newIndex) dot.classList.add('active');
                    else dot.classList.remove('active');
                  });
                  const counter = container.querySelector('.blog-slider-current');
                  if (counter) counter.textContent = newIndex + 1;
                }
              }, 50);
            },
            { passive: true }
          );
        });
      };

      const timer = setTimeout(() => {
        if (window.__initBlogSliders) window.__initBlogSliders();
      }, 60);
      return () => clearTimeout(timer);
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
        {/* Cover Image (displayed as the first thing in the article below the title/subtitles/tags) */}
        {post.coverImage && (
          <div className="blog-post-cover-wrapper">
            <img
              src={post.coverImage}
              alt={post.title}
              className="blog-post-cover-img"
            />
          </div>
        )}

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
        .blog-content-body img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          border: 1px solid #E2EBF2;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          margin: 32px auto;
          display: block;
        }
        .blog-content-body figure {
          margin: 32px 0;
          text-align: center;
        }
        .blog-content-body figcaption {
          margin-top: 10px;
          font-size: 13.5px;
          color: var(--color-text-secondary);
          font-style: italic;
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

        /* Cover Image Styling */
        .blog-post-cover-wrapper {
          margin-bottom: 36px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #E2EBF2;
          box-shadow: 0 8px 30px rgba(0, 65, 101, 0.08);
          background-color: #F8FAFC;
        }
        .blog-post-cover-img {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          display: block;
        }

        /* Blog Slider Styling */
        .blog-slider-container {
          margin: 36px 0;
          border-radius: 16px;
          background-color: #F8FAFC;
          border: 1px solid #D2E7F5;
          box-shadow: 0 4px 20px rgba(0, 65, 101, 0.06);
          overflow: hidden;
          position: relative;
          user-select: none;
        }
        .blog-slider-viewport {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .blog-slider-track {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          width: 100%;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        .blog-slider-track::-webkit-scrollbar {
          display: none;
        }
        .blog-slider-slide {
          flex: 0 0 100%;
          width: 100%;
          scroll-snap-align: center;
          scroll-snap-stop: always;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 16px 8px 16px;
          box-sizing: border-box;
        }
        .blog-slider-img-wrap {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          max-height: 480px;
          overflow: hidden;
          border-radius: 10px;
          background-color: #FFFFFF;
          border: 1px solid #E2EBF2;
        }
        .blog-slider-slide img {
          max-width: 100% !important;
          max-height: 460px !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
          display: block !important;
          margin: 0 !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 8px !important;
        }
        .blog-slider-caption {
          margin-top: 10px;
          font-size: 13.5px;
          color: var(--color-text-secondary);
          text-align: center;
          font-weight: 500;
          min-height: 20px;
          padding: 0 12px;
        }
        .blog-slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.92);
          border: 1px solid #D2E7F5;
          color: var(--color-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .blog-slider-btn:hover {
          background-color: #FFFFFF;
          color: var(--color-brand);
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 6px 18px rgba(32, 128, 255, 0.25);
          border-color: var(--color-brand);
        }
        .blog-slider-btn.prev {
          left: 14px;
        }
        .blog-slider-btn.next {
          right: 14px;
        }
        .blog-slider-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px 14px 20px;
          border-top: 1px solid #EAF0F6;
          background-color: #FFFFFF;
        }
        .blog-slider-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .blog-slider-dot {
          width: 8px;
          height: 8px;
          border-radius: 100px;
          background-color: #CBD5E1;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.25s ease;
        }
        .blog-slider-dot:hover {
          background-color: #94A3B8;
        }
        .blog-slider-dot.active {
          width: 24px;
          background-color: var(--color-brand);
        }
        .blog-slider-counter {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary);
          font-variant-numeric: tabular-nums;
        }
        @media (max-width: 640px) {
          .blog-slider-slide {
            padding: 10px 10px 6px 10px;
          }
          .blog-slider-btn {
            width: 32px;
            height: 32px;
          }
          .blog-slider-btn.prev {
            left: 8px;
          }
          .blog-slider-btn.next {
            right: 8px;
          }
        }
      `}</style>
    </article>
  );
}
