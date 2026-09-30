import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HardDrive, Cpu, RefreshCw, Lock } from 'lucide-react';

export default function TrustBar() {
  const trustItems = [
    { icon: <Lock size={15} color="#2080FF" />, label: '100% Private (No Cloud Telemetry)' },
    { icon: <HardDrive size={15} color="#2080FF" />, label: 'Local-First in chrome.storage' },
    { icon: <Cpu size={15} color="#2080FF" />, label: 'Batch Reopening (No Browser Freeze)' },
    { icon: <RefreshCw size={15} color="#2080FF" />, label: '50-Step Persistent Undo' },
    { icon: <ShieldCheck size={15} color="#2080FF" />, label: 'Free & Open Source' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderTop: '1px solid rgba(0, 65, 101, 0.08)',
        borderBottom: '1px solid rgba(0, 65, 101, 0.08)',
        backgroundColor: '#FAFCFE',
        padding: '18px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        {trustItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
