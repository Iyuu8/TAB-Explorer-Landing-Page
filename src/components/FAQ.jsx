import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How is TAB Explorer different from standard Chrome bookmarks?',
      a: 'Bookmarks are a flat, buried list in a menu. TAB Explorer treats your browsing like a file system: it stays visible in Chrome’s native side panel, organizes tabs into Workspaces and color-coded Folders, supports 1-click bulk tab captures (Ctrl+Shift+S), and allows non-blocking batch reopening so you never lose research context.',
    },
    {
      q: 'Will opening a folder with 30 tabs freeze or slow down Chrome?',
      a: 'No. TAB Explorer includes a built-in batching mechanism. When you reopen multiple links or an entire workspace, tabs are spawned in throttled increments with a gentle 300ms delay. This prevents memory spikes and keeps your browser completely responsive.',
    },
    {
      q: 'Where is my data stored and do I need to create an account?',
      a: 'No account, login, or email is ever needed. All workspaces, folders, links, and preferences are stored exclusively on your device inside chrome.storage.local. Nothing is ever sent to external cloud servers.',
    },
    {
      q: 'How does Smart Session Restore work?',
      a: 'TAB Explorer keeps a lightweight local snapshot of your open tab URLs in the background. If Chrome terminates unexpectedly, crashes, or is restarted, TAB Explorer detects the difference and displays a 1-click dialog asking if you’d like to restore your lost session.',
    },
    {
      q: 'What keyboard shortcuts are available?',
      a: 'TAB Explorer supports a full suite of desktop-grade shortcuts: Ctrl+A (or Cmd+A) to select all visible items, Shift+Click and Ctrl+Click for range and multi-selection, Delete or Backspace to delete selected tabs or folders, Ctrl+C / Ctrl+X / Ctrl+V to copy, cut, and paste, Ctrl+Z for 50-step persistent undo, F2 to rename inline, Ctrl+Shift+S to open the Save Tabs dialog, Escape to clear selections or close modals, and many other shortcuts designed for seamless keyboard-first productivity.',
    },
    {
      q: 'Can I back up or transfer my workspaces to another computer?',
      a: 'Yes. At the bottom of the side panel, click "Export" to download a clean, structured JSON file of your entire workspace tree. On your new computer or browser profile, simply click "Import" to restore everything in seconds.',
    },
  ];

  return (
    <section id="faq" className="section section-canvas" style={{ paddingTop: '90px', paddingBottom: '100px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: '-0.8px',
              color: 'var(--color-ink)',
              marginBottom: '16px',
            }}
          >
            Frequently Asked Questions
          </h2>

          <p
            style={{
              fontSize: '17px',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Everything you need to know about TAB Explorer and how it works.
          </p>
        </motion.div>

        {/* Accordion list with smooth collapsible animation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="bento-card"
                style={{
                  padding: '22px 26px',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                  borderColor: isOpen ? 'var(--color-line-blue)' : 'var(--color-border)',
                }}
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '17.5px',
                      fontWeight: 600,
                      color: 'var(--color-ink)',
                      lineHeight: 1.4,
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {item.q}
                  </h3>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-mist)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--color-deep-blue)',
                    }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        style={{
                          marginTop: '14px',
                          paddingTop: '14px',
                          borderTop: '1px solid #F1F5F9',
                          fontSize: '15px',
                          lineHeight: 1.6,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
