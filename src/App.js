import React from 'react';
import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';
import NotFound from './components/NotFound';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="tab-explorer-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Scroll restoration helper */}
      <ScrollToTop />

      {/* Universal Header with Main Navigation & Blog Link */}
      <Navbar />

      {/* Main Routed Content */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
