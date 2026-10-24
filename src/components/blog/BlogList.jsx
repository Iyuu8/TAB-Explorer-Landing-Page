import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, BookOpen, Tag } from 'lucide-react';
import postsData from '../../posts/posts-data.json';
import BlogCTA from './BlogCTA';

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    document.title = 'Blog & Articles — TAB Explorer';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Practical productivity guides, browser tab management workflows, and privacy insights from the TAB Explorer team.'
      );
    }
    window.scrollTo(0, 0);
  }, []);

  // Extract unique categories
  const categories = ['All', ...new Set(postsData.map((p) => p.category).filter(Boolean))];

  // Filter posts
  const filteredPosts = postsData.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ backgroundColor: '#FAFCFE', minHeight: '80vh', paddingBottom: '90px' }}>
      {/* Blog Hero Header */}
      <section
        style={{
          paddingTop: '64px',
          paddingBottom: '50px',
          borderBottom: '1px solid #E2EBF2',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '380px',
            background: 'radial-gradient(ellipse at center, rgba(201, 228, 246, 0.4) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '920px' }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              marginBottom: '20px',
              fontWeight: 500,
            }}
          >
            <Link to="/" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>
              Home
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--color-ink)' }}>Blog</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(32px, 5.5vw, 52px)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px',
              color: 'var(--color-ink)',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}
          >
            TAB Explorer Blog
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.55,
              maxWidth: '680px',
              margin: '0 0 28px 0',
            }}
          >
            Guides, productivity workflows, and deep dives on local-first browser organization.
          </motion.p>

          {/* Search bar & Category chips (shown when posts exist) */}
          {postsData.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '12px',
              }}
            >
              {/* Search Input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#F6FAFD',
                  border: '1px solid #D2E7F5',
                  borderRadius: '100px',
                  padding: '8px 16px',
                  width: '100%',
                  maxWidth: '340px',
                }}
              >
                <Search size={16} color="#5B6B79" />
                <input
                  type="text"
                  placeholder="Search articles or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '13.5px',
                    color: 'var(--color-ink)',
                    width: '100%',
                  }}
                />
              </div>

              {/* Category pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      border: '1px solid',
                      borderColor: selectedCategory === cat ? 'var(--color-brand)' : '#D2E7F5',
                      backgroundColor: selectedCategory === cat ? 'var(--color-brand)' : '#FFFFFF',
                      color: selectedCategory === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
                      padding: '6px 14px',
                      borderRadius: '100px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Posts List Section */}
      <section style={{ paddingTop: '50px' }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          {filteredPosts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2EBF2',
              }}
            >
              <BookOpen size={40} color="#5B6B79" style={{ marginBottom: '16px', opacity: 0.6 }} />
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '8px' }}>
                {postsData.length === 0 ? 'No articles published yet' : 'No articles found'}
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)' }}>
                {postsData.length === 0
                  ? 'New guides and articles will be published here soon. Stay tuned!'
                  : 'Try adjusting your search terms or selecting another category.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {filteredPosts.map((post, idx) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="bento-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D2E7F5',
                    borderRadius: '18px',
                    padding: '32px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Card Meta Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '12.5px',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '100px',
                        backgroundColor: '#EAF4FA',
                        color: 'var(--color-brand)',
                        fontWeight: 600,
                        fontSize: '12px',
                      }}
                    >
                      {post.category}
                    </span>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>

                    <span>•</span>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={13} />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  {/* Title linking to /blog/:slug */}
                  <h2
                    style={{
                      fontSize: 'clamp(20px, 3.2vw, 26px)',
                      fontWeight: 800,
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '-0.4px',
                      lineHeight: 1.3,
                      marginBottom: '12px',
                    }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      style={{
                        color: 'var(--color-ink)',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-brand)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink)')}
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '15px',
                      lineHeight: 1.6,
                      color: 'var(--color-text-secondary)',
                      marginBottom: '20px',
                    }}
                  >
                    {post.description}
                  </p>

                  {/* Tags & Read link row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                      paddingTop: '16px',
                      borderTop: '1px solid #F1F5F9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {post.tags &&
                        post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11.5px',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#F1F5F9',
                              color: '#475569',
                            }}
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--color-brand)',
                        textDecoration: 'none',
                      }}
                    >
                      <span>Read Article</span>
                      <ArrowRight size={15} strokeWidth={2.4} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Bottom callout */}
          <BlogCTA />
        </div>
      </section>
    </div>
  );
}
