import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderTree,
  Save,
  RotateCcw,
  Search,
  Undo2,
  CheckCircle2,
  ShieldCheck,
  Star,
  Cpu,
  FileJson
} from 'lucide-react';

export default function Features() {
  const [activeSwatch, setActiveSwatch] = useState('#2f6b3a');
  const [searchMock, setSearchMock] = useState('Claude');

  const swatches = [
    { color: '#2B2B2B', name: 'Obsidian' },
    { color: '#1f3a63', name: 'Navy' },
    { color: '#2f6b3a', name: 'Emerald' },
    { color: '#7a3b2e', name: 'Terracotta' },
    { color: '#5a3b7a', name: 'Amethyst' },
    { color: '#2e6b6b', name: 'Teal' },
  ];

  return (
    <section id="features" className="section section-canvas" style={{ paddingTop: '80px', paddingBottom: '100px' }}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
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
            Everything you expect from a real file manager
          </h2>

          <p
            style={{
              fontSize: '18px',
              color: 'var(--color-text-secondary)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Crafted with thoughtful attention to browser performance, keyboard shortcuts, and strict local-first privacy.
          </p>
        </motion.div>

        {/* Bento Grid Architecture */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
          }}
          className="bento-container"
        >
          {/* ===============================================================
              BENTO 1: Large Span (8 cols) — Workspaces & Nested Hierarchy
             =============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bento-card bento-col-8"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#F0FAFF',
                    border: '1px solid #D2E7F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2080FF',
                  }}
                >
                  <FolderTree size={22} />
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#004165',
                    backgroundColor: '#EAF4FA',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: '1px solid #CDE6F7',
                  }}
                >
                  Workspaces & Folders
                </span>
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.4px', marginBottom: '10px' }}>
                Deep Hierarchies with Custom Color Palettes
              </h3>

              <p style={{ fontSize: '15.5px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '620px' }}>
                Organize tabs into Workspaces and infinite subfolder trees with visual hierarchy guidelines.
                Customize folder colors using the signature 6-tone extension palette and star frequently used folders.
              </p>
            </div>

            {/* Interactive Preview Widget */}
            <div
              style={{
                backgroundColor: '#F8FCFE',
                borderRadius: '14px',
                border: '1px solid #E1EEF6',
                padding: '20px',
              }}
            >
              {/* Palette swatches selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                  Signature Folder Color Palette:
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {swatches.map((s) => (
                    <button
                      key={s.color}
                      onClick={() => setActiveSwatch(s.color)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: s.color,
                        border: activeSwatch === s.color ? '2px solid #2080FF' : '2px solid transparent',
                        boxShadow: activeSwatch === s.color ? '0 0 0 2px #CDE6F7' : 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                      title={s.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sample tree preview */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E2EBF2',
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg viewBox="0 0 16 13" style={{ width: '16px', height: '14px', flexShrink: 0 }}>
                      <path d="M0 2.4C0 1.4 0.8 0.6 1.8 0.6H6L7.4 2H14.2C15.2 2 16 2.8 16 3.8V10.6C16 11.6 15.2 12.4 14.2 12.4H1.8C0.8 12.4 0 11.6 0 10.6V2.4Z" fill="#242424" />
                      <path d="M0 4.2H16V10.6C16 11.6 15.2 12.4 14.2 12.4H1.8C0.8 12.4 0 11.6 0 10.6V4.2Z" fill={activeSwatch} />
                    </svg>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>
                      AI Research & Engineering
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={13} fill="#00054B" color="#00054B" />
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '6px', border: '1px solid #94A3B8', color: '#00054B' }}>
                      4 links
                    </span>
                  </div>
                </div>

                {/* Sub-links */}
                <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '1px solid #7EBCE6', marginLeft: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                    <img src="https://www.google.com/s2/favicons?domain=claude.ai&sz=64" alt="" style={{ width: '13px', height: '13px', borderRadius: '2px' }} />
                    <span>Claude 3.7 Sonnet Reasoning</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                    <img src="https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64" alt="" style={{ width: '13px', height: '13px', borderRadius: '2px' }} />
                    <span>ChatGPT — Canvas Project</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===============================================================
              BENTO 2: Span (4 cols) — 1-Click Tab Capture
             =============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bento-card bento-col-4"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#F0FAFF',
                    border: '1px solid #D2E7F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2080FF',
                  }}
                >
                  <Save size={22} />
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#004165',
                    backgroundColor: '#EAF4FA',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: '1px solid #CDE6F7',
                  }}
                >
                  Instant Capture
                </span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '10px' }}>
                1-Click Tab Capture
              </h3>

              <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Snapshot all tabs currently open in your browser window in Append or Replace mode with a single shortcut.
              </p>
            </div>

            {/* Keyboard shortcut display widget */}
            <div
              style={{
                backgroundColor: '#F8FCFE',
                borderRadius: '14px',
                border: '1px solid #E1EEF6',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                <kbd style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 0 #CBD5E1' }}>
                  Ctrl
                </kbd>
                <span style={{ color: '#94A3B8', fontWeight: 700 }}>+</span>
                <kbd style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 0 #CBD5E1' }}>
                  Shift
                </kbd>
                <span style={{ color: '#94A3B8', fontWeight: 700 }}>+</span>
                <kbd style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 0 #CBD5E1' }}>
                  S
                </kbd>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Append to folder • Replace existing • New folder
              </div>
            </div>
          </motion.div>

          {/* ===============================================================
              BENTO 3: Span (4 cols) — Throttled Batch Reopening
             =============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bento-card bento-col-4"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#F0FAFF',
                    border: '1px solid #D2E7F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2080FF',
                  }}
                >
                  <Cpu size={22} />
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#004165',
                    backgroundColor: '#EAF4FA',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: '1px solid #CDE6F7',
                  }}
                >
                  Performance
                </span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '10px' }}>
                Throttled Batch Reopen
              </h3>

              <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Reopen 20, 50, or 100 links safely. TAB Explorer batches tab spawns in 300ms intervals so Chrome stays buttery smooth.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#F8FCFE',
                borderRadius: '14px',
                border: '1px solid #E1EEF6',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12.5px', color: '#004165', fontWeight: 600 }}>
                Zero Chrome Memory Freezes • Safe batch threshold
              </div>
            </div>
          </motion.div>

          {/* ===============================================================
              BENTO 4: Span (4 cols) — 50-Step Persistent Undo
             =============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bento-card bento-col-4"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#F0FAFF',
                    border: '1px solid #D2E7F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2080FF',
                  }}
                >
                  <Undo2 size={22} />
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#004165',
                    backgroundColor: '#EAF4FA',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: '1px solid #CDE6F7',
                  }}
                >
                  50-Step Undo
                </span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '10px' }}>
                Persistent Undo History
              </h3>

              <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Accidentally delete a folder or move a link? Hit Ctrl+Z to immediately reverse up to 50 operations.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#F8FCFE',
                borderRadius: '14px',
                border: '1px solid #E1EEF6',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                Undo Shortcut
              </span>
              <kbd style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                Ctrl + Z
              </kbd>
            </div>
          </motion.div>

          {/* ===============================================================
              BENTO 5: Span (4 cols) — Smart Session Restore
             =============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bento-card bento-col-4"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#F0FAFF',
                    border: '1px solid #D2E7F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2080FF',
                  }}
                >
                  <RotateCcw size={22} />
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#004165',
                    backgroundColor: '#EAF4FA',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: '1px solid #CDE6F7',
                  }}
                >
                  Crash Resilient
                </span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '10px' }}>
                Smart Session Restore
              </h3>

              <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Background tracker continuously monitors open tabs. If Chrome terminates unexpectedly, 1-click restore brings your session right back.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#F8FCFE',
                borderRadius: '14px',
                border: '1px solid #E1EEF6',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <RotateCcw size={16} color="#2080FF" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12.5px', color: '#004165', fontWeight: 600 }}>
                1-Click Session Recovery Modal
              </span>
            </div>
          </motion.div>

          {/* ===============================================================
              BENTO 6: Span (8 cols) — Cross-Workspace Instant Search
             =============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bento-card bento-col-8"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#F0FAFF',
                    border: '1px solid #D2E7F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2080FF',
                  }}
                >
                  <Search size={22} />
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#004165',
                    backgroundColor: '#EAF4FA',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: '1px solid #CDE6F7',
                  }}
                >
                  Universal Search
                </span>
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.4px', marginBottom: '10px' }}>
                Instant Search Across All Workspaces
              </h3>

              <p style={{ fontSize: '15.5px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '620px' }}>
                Never hunt through multiple workspaces. A single search query traverses every folder and saved link simultaneously with real-time keystroke filtering.
              </p>
            </div>

            {/* Live Search Mock Widget */}
            <div
              style={{
                backgroundColor: '#F8FCFE',
                borderRadius: '14px',
                border: '1px solid #E1EEF6',
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  marginBottom: '12px',
                }}
              >
                <Search size={15} color="#2080FF" />
                <input
                  type="text"
                  value={searchMock}
                  onChange={(e) => setSearchMock(e.target.value)}
                  placeholder="Try searching 'Claude', 'GitHub', 'Figma'..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    flex: 1,
                    fontSize: '13px',
                    color: '#0F172A',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', flexWrap: 'wrap', gap: '6px' }}>
                <span>Found in: <strong>Personal &gt; AI Research &gt; Claude 3.7 Sonnet</strong></span>
                <span style={{ color: '#2080FF', fontWeight: 600 }}>instant match</span>
              </div>
            </div>
          </motion.div>

          {/* ===============================================================
              BENTO 7: Span (4 cols) — 100% Local-First
             =============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bento-card bento-col-4"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#F0FAFF',
                    border: '1px solid #D2E7F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2080FF',
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#004165',
                    backgroundColor: '#EAF4FA',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: '1px solid #CDE6F7',
                  }}
                >
                  Data Ownership
                </span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '10px' }}>
                100% Local-First
              </h3>

              <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Zero external telemetry, zero accounts, and zero cloud tracking. Stored purely on your device with JSON export & import.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#F8FCFE',
                borderRadius: '14px',
                border: '1px solid #E1EEF6',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <FileJson size={18} color="#2080FF" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12.5px', color: '#004165', fontWeight: 600 }}>
                Clean JSON Export & Backup
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .bento-col-8 {
          grid-column: span 8;
        }
        .bento-col-4 {
          grid-column: span 4;
        }
        @media (max-width: 960px) {
          .bento-col-8, .bento-col-4 {
            grid-column: span 12 !important;
          }
          .bento-container {
            gap: 16px !important;
          }
        }
        @media (max-width: 640px) {
          .bento-card {
            padding: 22px 18px !important;
          }
        }
      `}</style>
    </section>
  );
}
