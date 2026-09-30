import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureIntro() {
  return (
    <section
      className="section section-alt"
      style={{
        textAlign: 'center',
        paddingTop: '110px',
        paddingBottom: '110px',
      }}
    >
      <div className="container" style={{ maxWidth: '980px' }}>
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="headline-gradient"
          style={{
            fontSize: 'clamp(32px, 5.8vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.24,
            letterSpacing: '-1px',
            marginBottom: '24px',
            fontFamily: 'var(--font-display)',
          }}
        >
          Your tabs, organized like your actual files.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(17px, 2.2vw, 20px)',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
            maxWidth: '680px',
            margin: '0 auto',
            fontWeight: 400,
          }}
        >
          Stop losing open tabs in a compressed horizontal strip. Group projects into Workspaces,
          nest research in color-coded Folders, and reopen full stacks of tabs in a single click.
        </motion.p>
      </div>
    </section>
  );
}
