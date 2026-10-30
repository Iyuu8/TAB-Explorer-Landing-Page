const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');
const OUTPUT_JSON = path.join(POSTS_DIR, 'posts-data.json');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BUILD_DIR = path.join(__dirname, '..', 'build');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const RSS_PATH = path.join(PUBLIC_DIR, 'rss.xml');
const SITE_URL = 'https://tabexplorer.site';
const CWS_URL = 'https://chromewebstore.google.com/detail/tab-explorer/ijcnikejbjffhcnblofckaihgchkiged';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJson(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

// Transform :::slider or <slider> blocks into interactive horizontal image sliders
function transformSliders(content) {
  if (!content) return '';

  const sliderBlockRegex = /(?:^|\n)(?:::+(?:slider|carousel)|<slider\b[^>]*>|<div\s+class=["'](?:image-slider|slider|carousel)["'][^>]*>)\s*([\s\S]*?)\s*(?:::+|<\/slider>|<\/div>)(?:\n|$)/gi;

  let sliderCounter = 0;

  return content.replace(sliderBlockRegex, (match, innerContent) => {
    sliderCounter++;
    const sliderId = `blog-slider-${sliderCounter}`;

    const items = [];
    const mdImgRegex = /!\[(.*?)\]\((.*?)(?:\s+["'](.*?)["'])?\)/g;
    let m;
    while ((m = mdImgRegex.exec(innerContent)) !== null) {
      items.push({
        alt: (m[1] || '').trim(),
        src: (m[2] || '').trim(),
        caption: (m[3] || m[1] || '').trim(),
      });
    }

    if (items.length === 0) {
      const htmlImgRegex = /<img\s+([^>]*?)>/gi;
      let h;
      while ((h = htmlImgRegex.exec(innerContent)) !== null) {
        const attrStr = h[1];
        const srcMatch = attrStr.match(/src=["'](.*?)["']/i);
        const altMatch = attrStr.match(/alt=["'](.*?)["']/i);
        const titleMatch = attrStr.match(/title=["'](.*?)["']/i);
        if (srcMatch) {
          items.push({
            src: srcMatch[1],
            alt: altMatch ? altMatch[1] : '',
            caption: titleMatch ? titleMatch[1] : (altMatch ? altMatch[1] : ''),
          });
        }
      }
    }

    if (items.length === 0) {
      return match;
    }

    const slidesHtml = items
      .map((item, index) => {
        return `
            <div class="blog-slider-slide" data-slide-index="${index}">
              <div class="blog-slider-img-wrap">
                <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" />
              </div>
              ${item.caption ? `<div class="blog-slider-caption">${escapeHtml(item.caption)}</div>` : ''}
            </div>`;
      })
      .join('\n');

    const dotsHtml = items
      .map((_, index) => {
        return `<button type="button" class="blog-slider-dot ${
          index === 0 ? 'active' : ''
        }" data-index="${index}" aria-label="Go to slide ${index + 1}" onclick="window.__blogSliderGoTo && window.__blogSliderGoTo('${sliderId}', ${index})"></button>`;
      })
      .join('\n');

    return `\n
<div class="blog-slider-container" id="${sliderId}" data-active-index="0">
  <div class="blog-slider-viewport">
    ${
      items.length > 1
        ? `<button type="button" class="blog-slider-btn prev" aria-label="Previous slide" onclick="window.__blogSliderPrev && window.__blogSliderPrev('${sliderId}')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>`
        : ''
    }
    <div class="blog-slider-track" id="${sliderId}-track">
${slidesHtml}
    </div>
    ${
      items.length > 1
        ? `<button type="button" class="blog-slider-btn next" aria-label="Next slide" onclick="window.__blogSliderNext && window.__blogSliderNext('${sliderId}')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>`
        : ''
    }
  </div>
  ${
    items.length > 1
      ? `<div class="blog-slider-footer">
    <div class="blog-slider-dots">
${dotsHtml}
    </div>
    <div class="blog-slider-counter"><span class="blog-slider-current">1</span> / ${items.length}</div>
  </div>`
      : ''
  }
</div>\n`;
  });
}

// Simple frontmatter parser
function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: fileContent.trim() };

  const yamlBlock = match[1];
  const content = match[2].trim();
  const data = {};

  yamlBlock.split(/\r?\n/).forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      } else if (val.startsWith('[') && val.endsWith(']')) {
        try {
          val = JSON.parse(val.replace(/'/g, '"'));
        } catch (e) {
          val = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
        }
      }
      data[key] = val;
    }
  });

  return { data, content };
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

// Build Static HTML for a single post
function renderPostStaticMarkup(post) {
  const formattedDate = formatDate(post.date);
  const authorInitial = (post.author || 'T').charAt(0).toUpperCase();

  const tagsHtml = (post.tags || [])
    .map(
      (tag) =>
        `<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 3px 10px; border-radius: 100px; background-color: #EAF4FA; color: var(--color-brand); font-weight: 600;">#${escapeHtml(
          tag
        )}</span>`
    )
    .join(' ');

  return `
    <div class="tab-explorer-app" style="min-height: 100vh; display: flex; flex-direction: column;">
      <!-- Static Universal Header -->
      <header class="site-header" style="position: sticky; top: 0; z-index: 100; width: 100%; background-color: rgba(255, 255, 255, 0.96); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0, 65, 101, 0.08);">
        <div class="container nav-container" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <a href="/" aria-label="TAB Explorer Home" class="brand-link">
            <img src="/assets/logo.png" alt="TAB Explorer Logo" class="brand-logo-img" />
            <span class="brand-wordmark">
              <span style="color: var(--color-brand);">TAB</span> <span style="color: var(--color-ink);">Explorer</span>
            </span>
          </a>
          <nav class="desktop-nav" style="margin: 0 auto;">
            <a href="/#demo" class="nav-link">Interactive Demo</a>
            <a href="/#features" class="nav-link">Features</a>
            <a href="/#how-it-works" class="nav-link">How it works</a>
            <a href="/#showcase" class="nav-link">Interface</a>
            <a href="/#privacy" class="nav-link">Local-First</a>
            <a href="/#faq" class="nav-link">FAQ</a>
            <a href="/blog" class="nav-link" style="color: var(--color-brand); font-weight: 700;">Blog</a>
          </nav>
          <div class="nav-actions" style="display: flex; align-items: center; gap: 12px; margin-left: auto; flex-shrink: 0;">
            <a href="${CWS_URL}" target="_blank" rel="noopener noreferrer" class="btn-primary nav-header-cta" title="Install TAB Explorer on Chrome Web Store">
              <span>Add to Chrome</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Pre-rendered Static Article -->
      <main style="flex: 1;">
        <article style="background-color: #FAFCFE; min-height: 85vh; padding-bottom: 100px;">
          <header style="padding-top: 54px; padding-bottom: 44px; border-bottom: 1px solid #E2EBF2; background-color: #FFFFFF; position: relative;">
            <div class="container" style="max-width: 820px;">
              <!-- Breadcrumb navigation -->
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; font-size: 13px; color: var(--color-text-secondary);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <a href="/" style="color: var(--color-brand); text-decoration: none; font-weight: 500;">Home</a>
                  <span>/</span>
                  <a href="/blog" style="color: var(--color-brand); text-decoration: none; font-weight: 500;">Blog</a>
                  <span>/</span>
                  <span style="color: var(--color-ink); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 280px;">${escapeHtml(
                    post.title
                  )}</span>
                </div>
                <a href="/blog" style="color: var(--color-deep-blue); text-decoration: none; font-weight: 600; font-size: 13px;">← All Articles</a>
              </div>

              <!-- Metadata pills -->
              <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--color-text-secondary); margin-bottom: 16px; flex-wrap: wrap;">
                <span style="padding: 4px 12px; border-radius: 100px; background-color: #EAF4FA; color: var(--color-brand); font-weight: 700; font-size: 12px;">${escapeHtml(
                  post.category
                )}</span>
                <span>${formattedDate}</span>
                <span>•</span>
                <span>${escapeHtml(post.readTime)}</span>
                <span>•</span>
                <span>By ${escapeHtml(post.author)}</span>
              </div>

              <!-- Article Heading -->
              <h1 style="font-size: clamp(28px, 4.8vw, 44px); font-weight: 800; font-family: var(--font-display); letter-spacing: -0.8px; line-height: 1.25; color: var(--color-ink); margin-bottom: 20px;">
                ${escapeHtml(post.title)}
              </h1>

              <!-- Lead Description -->
              <p style="font-size: 18px; line-height: 1.6; color: var(--color-text-secondary); margin-bottom: 24px;">
                ${escapeHtml(post.description)}
              </p>

              <!-- Author row -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 18px; border-top: 1px solid #F1F5F9; flex-wrap: wrap; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--color-brand); color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">
                    ${authorInitial}
                  </div>
                  <div>
                    <div style="font-size: 13px; font-weight: 600; color: var(--color-ink);">${escapeHtml(post.author)}</div>
                    <div style="font-size: 11.5px; color: var(--color-text-secondary);">TAB Explorer Contributor</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <!-- Pre-rendered Markdown HTML Content -->
          <div class="container" style="max-width: 820px; padding-top: 44px;">
            ${
              post.coverImage
                ? `<div class="blog-post-cover-wrapper" style="margin-bottom: 36px; border-radius: 16px; overflow: hidden; border: 1px solid #E2EBF2; box-shadow: 0 8px 30px rgba(0, 65, 101, 0.08); background-color: #F8FAFC;">
                    <img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)}" class="blog-post-cover-img" style="width: 100%; max-height: 480px; object-fit: cover; display: block;" />
                  </div>`
                : ''
            }
            <div class="blog-content-body" style="font-size: 17px; line-height: 1.75; color: #1E293B;">
              ${post.html}
            </div>

            <!-- Tags -->
            ${
              post.tags && post.tags.length > 0
                ? `<div style="display: flex; align-items: center; gap: 8px; margin-top: 44px; padding-top: 24px; border-top: 1px solid #E2EBF2; flex-wrap: wrap;">
                    <span style="font-size: 13px; font-weight: 600; color: var(--color-ink);">Tagged with:</span>
                    ${tagsHtml}
                  </div>`
                : ''
            }

            <!-- Requirement 4: Chrome Web Store CTA Box -->
            <div class="bento-card blog-cta-box" style="margin-top: 56px; margin-bottom: 24px; padding: 36px 32px; background-color: #FAFCFE; border: 1px solid #D2E7F5; border-radius: 20px;">
              <div style="display: flex; align-items: flex-start; gap: 24px; flex-wrap: wrap;">
                <div style="width: 64px; height: 64px; border-radius: 16px; background-color: #FFFFFF; border: 1px solid #D2E7F5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <img src="/assets/icon-128.png" alt="TAB Explorer Logo" style="width: 44px; height: 44px; object-fit: contain;" />
                </div>
                <div style="flex: 1; min-width: 280px;">
                  <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 100px; background-color: #EAF4FA; color: var(--color-brand); font-size: 12px; font-weight: 600; margin-bottom: 10px;">
                    <span>Chrome Side Panel Extension</span>
                  </div>
                  <h3 style="font-size: 22px; font-weight: 800; font-family: var(--font-display); color: var(--color-ink); margin-bottom: 8px;">
                    Tired of browser tab clutter? Try TAB Explorer
                  </h3>
                  <p style="font-size: 14.5px; line-height: 1.55; color: var(--color-text-secondary); margin-bottom: 20px;">
                    Organize open tabs into clean workspaces and color-coded folders directly inside Chrome’s native side panel. 100% local-first, zero telemetry, and free forever.
                  </p>
                  <a href="${CWS_URL}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="display: inline-flex; align-items: center; gap: 10px; padding: 12px 22px; font-size: 14.5px; font-weight: 600; border-radius: 100px; text-decoration: none;">
                    <span>Add to Chrome — It’s Free</span> →
                  </a>
                </div>
              </div>
            </div>

            <!-- Back to blog navigation -->
            <div style="margin-top: 36px; text-align: center;">
              <a href="/blog" style="display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: var(--color-brand); text-decoration: none; padding: 10px 20px; border-radius: 100px; background-color: #FFFFFF; border: 1px solid #D2E7F5;">
                ← Back to all articles
              </a>
            </div>
          </div>
        </article>
      </main>

      <!-- Static Footer -->
      <footer style="border-top: 1px solid #D2E7F5; background-color: #FAFCFE; padding: 50px 0 36px;">
        <div class="container">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="/assets/logo.png" alt="TAB Explorer Logo" style="width: 34px; height: 34px; object-fit: contain;" />
              <span style="font-size: 19px; font-family: var(--font-display); font-weight: 700;">
                <span style="color: var(--color-brand);">TAB</span> <span style="color: var(--color-ink);">Explorer</span>
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap; font-size: 14px; font-weight: 500; color: var(--color-text-secondary);">
              <a href="${CWS_URL}" target="_blank" rel="noopener noreferrer" style="color: var(--color-brand); font-weight: 600;">Chrome Web Store</a>
              <a href="/blog" style="color: var(--color-ink); font-weight: 600; text-decoration: none;">Blog & Guides</a>
              <a href="/#demo">Interactive Demo</a>
              <a href="https://github.com/Iyuu8/TAB-Explorer" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
              <a href="https://github.com/Iyuu8/TAB-Explorer/blob/master/PRIVACY.md" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </div>
          </div>
          <div style="padding-top: 24px; border-top: 1px solid #EAF4FA; font-size: 12.5px; color: var(--color-text-muted);">
            Built by <strong>Benaziza Ayoub</strong> • Released under the MIT License.
          </div>
        </div>
      </footer>

      <!-- Interactive Image Slider Script -->
      <script>
        (function() {
          window.__blogSliderGoTo = function(sliderId, index) {
            var container = document.getElementById(sliderId);
            if (!container) return;
            var track = container.querySelector('.blog-slider-track');
            var slides = container.querySelectorAll('.blog-slider-slide');
            if (!track || !slides || !slides[index]) return;
            track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
            container.setAttribute('data-active-index', index);
            container.querySelectorAll('.blog-slider-dot').forEach(function(dot, i) {
              if (i === index) dot.classList.add('active'); else dot.classList.remove('active');
            });
            var counter = container.querySelector('.blog-slider-current');
            if (counter) counter.textContent = index + 1;
          };

          window.__blogSliderPrev = function(sliderId) {
            var container = document.getElementById(sliderId);
            if (!container) return;
            var current = parseInt(container.getAttribute('data-active-index') || '0', 10);
            var slides = container.querySelectorAll('.blog-slider-slide');
            var next = current > 0 ? current - 1 : slides.length - 1;
            window.__blogSliderGoTo(sliderId, next);
          };

          window.__blogSliderNext = function(sliderId) {
            var container = document.getElementById(sliderId);
            if (!container) return;
            var current = parseInt(container.getAttribute('data-active-index') || '0', 10);
            var slides = container.querySelectorAll('.blog-slider-slide');
            var next = current < slides.length - 1 ? current + 1 : 0;
            window.__blogSliderGoTo(sliderId, next);
          };

          window.__initBlogSliders = function() {
            var sliders = document.querySelectorAll('.blog-slider-container');
            sliders.forEach(function(container) {
              if (container.dataset.initialized) return;
              container.dataset.initialized = 'true';
              var track = container.querySelector('.blog-slider-track');
              var slides = container.querySelectorAll('.blog-slider-slide');
              if (!track || slides.length <= 1) return;

              var timer;
              track.addEventListener('scroll', function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                  var width = track.clientWidth || 1;
                  var newIndex = Math.round(track.scrollLeft / width);
                  if (newIndex >= 0 && newIndex < slides.length) {
                    container.setAttribute('data-active-index', newIndex);
                    container.querySelectorAll('.blog-slider-dot').forEach(function(dot, i) {
                      if (i === newIndex) dot.classList.add('active'); else dot.classList.remove('active');
                    });
                    var counter = container.querySelector('.blog-slider-current');
                    if (counter) counter.textContent = newIndex + 1;
                  }
                }, 50);
              }, { passive: true });
            });
          };

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', window.__initBlogSliders);
          } else {
            window.__initBlogSliders();
          }
        })();
      </script>
    </div>
  `;
}

// Build Static HTML for Blog Index (/blog)
function renderBlogIndexStaticMarkup(posts) {
  const postCardsHtml =
    posts.length === 0
      ? `<div style="text-align: center; padding: 64px 20px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2EBF2;">
           <h3 style="font-size: 19px; font-weight: 700; color: var(--color-ink); margin-bottom: 8px;">No articles published yet</h3>
           <p style="font-size: 14.5px; color: var(--color-text-secondary);">New guides and articles will be published here soon. Stay tuned!</p>
         </div>`
      : posts
          .map((post) => {
            const formattedDate = formatDate(post.date);
            const tagsHtml = (post.tags || [])
              .slice(0, 3)
              .map(
                (tag) =>
                  `<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; padding: 2px 8px; border-radius: 6px; background-color: #F1F5F9; color: #475569;">#${escapeHtml(
                    tag
                  )}</span>`
              )
              .join(' ');

            return `
            <article class="bento-card" style="background-color: #FFFFFF; border: 1px solid #D2E7F5; border-radius: 18px; padding: 32px;">
              ${
                post.coverImage
                  ? `<a href="/blog/${post.slug}" class="blog-card-cover-wrapper" style="display: block; margin-bottom: 20px; border-radius: 12px; overflow: hidden; border: 1px solid #E2EBF2; aspect-ratio: 16 / 9; max-height: 320px; background-color: #F8FAFC; text-decoration: none;">
                      <img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)}" class="blog-card-cover-img" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy" />
                    </a>`
                  : ''
              }
              <div style="display: flex; align-items: center; gap: 12px; font-size: 12.5px; color: var(--color-text-secondary); margin-bottom: 12px; flex-wrap: wrap;">
                <span style="padding: 3px 10px; border-radius: 100px; background-color: #EAF4FA; color: var(--color-brand); font-weight: 600; font-size: 12px;">${escapeHtml(
                  post.category
                )}</span>
                <span>${formattedDate}</span>
                <span>•</span>
                <span>${escapeHtml(post.readTime)}</span>
              </div>
              <h2 style="font-size: clamp(20px, 3.2vw, 26px); font-weight: 800; font-family: var(--font-display); letter-spacing: -0.4px; line-height: 1.3; margin-bottom: 12px;">
                <a href="/blog/${post.slug}" style="color: var(--color-ink); text-decoration: none;">${escapeHtml(
              post.title
            )}</a>
              </h2>
              <p style="font-size: 15px; line-height: 1.6; color: var(--color-text-secondary); margin-bottom: 20px;">
                ${escapeHtml(post.description)}
              </p>
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; padding-top: 16px; border-top: 1px solid #F1F5F9;">
                <div>${tagsHtml}</div>
                <a href="/blog/${post.slug}" style="display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--color-brand); text-decoration: none;">
                  <span>Read Article</span> →
                </a>
              </div>
            </article>
          `;
          })
          .join('\n');

  return `
    <div class="tab-explorer-app" style="min-height: 100vh; display: flex; flex-direction: column;">
      <!-- Static Universal Header -->
      <header class="site-header" style="position: sticky; top: 0; z-index: 100; width: 100%; background-color: rgba(255, 255, 255, 0.96); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0, 65, 101, 0.08);">
        <div class="container nav-container" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <a href="/" aria-label="TAB Explorer Home" class="brand-link">
            <img src="/assets/logo.png" alt="TAB Explorer Logo" class="brand-logo-img" />
            <span class="brand-wordmark">
              <span style="color: var(--color-brand);">TAB</span> <span style="color: var(--color-ink);">Explorer</span>
            </span>
          </a>
          <nav class="desktop-nav" style="margin: 0 auto;">
            <a href="/#demo" class="nav-link">Interactive Demo</a>
            <a href="/#features" class="nav-link">Features</a>
            <a href="/#how-it-works" class="nav-link">How it works</a>
            <a href="/#showcase" class="nav-link">Interface</a>
            <a href="/#privacy" class="nav-link">Local-First</a>
            <a href="/#faq" class="nav-link">FAQ</a>
            <a href="/blog" class="nav-link" style="color: var(--color-brand); font-weight: 700;">Blog</a>
          </nav>
          <div class="nav-actions" style="display: flex; align-items: center; gap: 12px; margin-left: auto; flex-shrink: 0;">
            <a href="${CWS_URL}" target="_blank" rel="noopener noreferrer" class="btn-primary nav-header-cta" title="Install TAB Explorer on Chrome Web Store">
              <span>Add to Chrome</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Pre-rendered Static Blog Home -->
      <main style="flex: 1; background-color: #FAFCFE; min-height: 80vh; padding-bottom: 90px;">
        <section style="padding-top: 64px; padding-bottom: 50px; border-bottom: 1px solid #E2EBF2; background-color: #FFFFFF; position: relative; overflow: hidden;">
          <div class="container" style="position: relative; z-index: 1; max-width: 920px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--color-text-secondary); margin-bottom: 20px; font-weight: 500;">
              <a href="/" style="color: var(--color-brand); text-decoration: none;">Home</a>
              <span>/</span>
              <span style="color: var(--color-ink);">Blog</span>
            </div>
            <h1 style="font-size: clamp(32px, 5.5vw, 52px); font-weight: 800; font-family: var(--font-display); letter-spacing: -1px; color: var(--color-ink); line-height: 1.2; margin-bottom: 16px;">
              TAB Explorer Blog
            </h1>
            <p style="font-size: clamp(16px, 2vw, 19px); color: var(--color-text-secondary); line-height: 1.55; max-width: 680px; margin: 0 0 28px 0;">
              Guides, productivity workflows, and deep dives on local-first browser organization.
            </p>
          </div>
        </section>

        <section style="padding-top: 50px;">
          <div class="container" style="max-width: 920px;">
            <div style="display: flex; flex-direction: column; gap: 24px;">
              ${postCardsHtml}
            </div>
          </div>
        </section>
      </main>

      <!-- Static Footer -->
      <footer style="border-top: 1px solid #D2E7F5; background-color: #FAFCFE; padding: 50px 0 36px;">
        <div class="container">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="/assets/logo.png" alt="TAB Explorer Logo" style="width: 34px; height: 34px; object-fit: contain;" />
              <span style="font-size: 19px; font-family: var(--font-display); font-weight: 700;">
                <span style="color: var(--color-brand);">TAB</span> <span style="color: var(--color-ink);">Explorer</span>
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap; font-size: 14px; font-weight: 500; color: var(--color-text-secondary);">
              <a href="${CWS_URL}" target="_blank" rel="noopener noreferrer" style="color: var(--color-brand); font-weight: 600;">Chrome Web Store</a>
              <a href="/blog" style="color: var(--color-ink); font-weight: 600; text-decoration: none;">Blog & Guides</a>
              <a href="/#demo">Interactive Demo</a>
              <a href="https://github.com/Iyuu8/TAB-Explorer" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
              <a href="https://github.com/Iyuu8/TAB-Explorer/blob/master/PRIVACY.md" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </div>
          </div>
          <div style="padding-top: 24px; border-top: 1px solid #EAF4FA; font-size: 12.5px; color: var(--color-text-muted);">
            Built by <strong>Benaziza Ayoub</strong> • Released under the MIT License.
          </div>
        </div>
      </footer>
    </div>
  `;
}

// Generate pre-rendered static HTML files for /blog and every /blog/<slug>
function prerenderStaticPages(posts) {
  const templatePath = path.join(BUILD_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.log('[Blog Pre-renderer] Notice: build/index.html not found yet. Skipping static HTML generation until build finishes.');
    return;
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');
  console.log('[Blog Pre-renderer] Pre-rendering static HTML pages into build/ directory...');

  // Helper to replace or inject tags cleanly
  function transformHtml(template, options) {
    let html = template;

    // 1. Replace <title>
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(options.title)}</title>`);

    // 2. Replace meta description
    html = html.replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(options.description)}" />`
    );

    // 3. Replace canonical URL
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
      `<link rel="canonical" href="${options.url}" />`
    );

    // 4. Replace Open Graph Tags
    html = html.replace(
      /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:type" content="${options.ogType || 'website'}" />`
    );
    html = html.replace(
      /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:url" content="${options.url}" />`
    );
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(options.title)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(options.description)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:image" content="${options.image || SITE_URL + '/assets/marquee-promo-tile-1400x560.png'}" />`
    );

    // Add article-specific OG tags if provided
    if (options.articleMeta) {
      const extraOg = `
    <meta property="article:published_time" content="${options.articleMeta.publishedTime}" />
    <meta property="article:author" content="${escapeHtml(options.articleMeta.author)}" />
      `;
      html = html.replace(/<meta\s+property="og:image:alt"[^>]*>/i, (match) => `${match}${extraOg}`);
    }

    // 5. Replace Twitter Tags
    html = html.replace(
      /<meta\s+name="twitter:url"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="twitter:url" content="${options.url}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(options.title)}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(options.description)}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="twitter:image" content="${options.image || SITE_URL + '/assets/marquee-promo-tile-1400x560.png'}" />`
    );

    // 6. Replace Schema.org JSON-LD
    const jsonLdString = JSON.stringify(options.jsonLd, null, 2);
    html = html.replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">\n${jsonLdString}\n    </script>`
    );

    // 7. Inject static pre-rendered HTML into <div id="root">
    html = html.replace('<div id="root"></div>', `<div id="root">${options.rootHtml}</div>`);

    return html;
  }

  // A. Pre-render /blog
  const blogDir = path.join(BUILD_DIR, 'blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  const blogIndexJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'TAB Explorer Blog',
    url: `${SITE_URL}/blog`,
    description: 'Practical guides, productivity workflows, and updates from the creators of TAB Explorer for Google Chrome.',
    publisher: {
      '@type': 'Organization',
      name: 'TAB Explorer',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/icon-128.png`,
      },
    },
  };

  const blogIndexHtml = transformHtml(baseHtml, {
    title: 'Blog & Articles — TAB Explorer',
    description: 'Practical guides, tab management workflows, and privacy insights from TAB Explorer.',
    url: `${SITE_URL}/blog`,
    ogType: 'website',
    image: `${SITE_URL}/assets/marquee-promo-tile-1400x560.png`,
    jsonLd: blogIndexJsonLd,
    rootHtml: renderBlogIndexStaticMarkup(posts),
  });

  fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexHtml, 'utf-8');
  fs.writeFileSync(path.join(BUILD_DIR, 'blog.html'), blogIndexHtml, 'utf-8');
  console.log(`[Blog Pre-renderer] Generated static page for /blog (${blogIndexHtml.length} bytes)`);

  // B. Pre-render every /blog/<slug>
  for (const post of posts) {
    const postDir = path.join(blogDir, post.slug);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    const postUrl = `${SITE_URL}/blog/${post.slug}`;
    const coverImageUrl = post.coverImage
      ? (post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage.startsWith('/') ? '' : '/'}${post.coverImage}`)
      : `${SITE_URL}/assets/marquee-promo-tile-1400x560.png`;

    const postJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl,
      },
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Person',
        name: post.author || 'Benaziza Ayoub',
      },
      publisher: {
        '@type': 'Organization',
        name: 'TAB Explorer',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/assets/icon-128.png`,
        },
      },
      image: coverImageUrl,
    };

    const postStaticHtml = transformHtml(baseHtml, {
      title: `${post.title} — TAB Explorer`,
      description: post.description,
      url: postUrl,
      ogType: 'article',
      image: coverImageUrl,
      articleMeta: {
        publishedTime: post.date,
        author: post.author,
      },
      jsonLd: postJsonLd,
      rootHtml: renderPostStaticMarkup(post),
    });

    fs.writeFileSync(path.join(postDir, 'index.html'), postStaticHtml, 'utf-8');
    fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), postStaticHtml, 'utf-8');
    console.log(`[Blog Pre-renderer] Generated static page for /blog/${post.slug} (${postStaticHtml.length} bytes)`);
  }

  // Ensure sitemap and rss are in build/ as well
  if (fs.existsSync(SITEMAP_PATH)) {
    fs.copyFileSync(SITEMAP_PATH, path.join(BUILD_DIR, 'sitemap.xml'));
  }
  if (fs.existsSync(RSS_PATH)) {
    fs.copyFileSync(RSS_PATH, path.join(BUILD_DIR, 'rss.xml'));
  }
}

function buildBlog() {
  console.log('[Blog Builder] Scanning markdown posts in', POSTS_DIR);

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = parseFrontmatter(raw);

    const slug = data.slug || file.replace(/\.md$/, '');
    const title = data.title || slug;
    const date = data.date || new Date().toISOString().slice(0, 10);
    const description = data.description || '';
    const author = data.author || 'Benaziza Ayoub';
    const category = data.category || 'Productivity';
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const readTime = data.readTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`;
    const coverImage = data.coverImage || data.cover || data.image || '';

    // Render markdown to HTML (transforming image sliders first)
    const transformedContent = transformSliders(content);
    const html = marked.parse(transformedContent);

    posts.push({
      slug,
      title,
      date,
      description,
      author,
      category,
      tags,
      readTime,
      coverImage,
      html,
      rawContent: content,
      fileName: file,
    });
  }

  // Sort newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 1. Write posts-data.json for instant React client access
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`[Blog Builder] Wrote ${posts.length} posts to ${OUTPUT_JSON}`);

  // 2. Generate updated public/sitemap.xml
  const today = new Date().toISOString().slice(0, 10);
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  sitemapXml += `  <url>\n    <loc>${SITE_URL}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  sitemapXml += `  <url>\n    <loc>${SITE_URL}/blog</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

  for (const post of posts) {
    sitemapXml += `  <url>\n    <loc>${SITE_URL}/blog/${post.slug}</loc>\n    <lastmod>${post.date || today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  sitemapXml += `</urlset>\n`;

  fs.writeFileSync(SITEMAP_PATH, sitemapXml, 'utf-8');
  console.log(`[Blog Builder] Updated sitemap with ${posts.length + 2} URLs at ${SITEMAP_PATH}`);

  // 3. Generate public/rss.xml
  let rssXml = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
  rssXml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
  rssXml += `<channel>\n`;
  rssXml += `  <title>TAB Explorer Blog</title>\n`;
  rssXml += `  <link>${SITE_URL}/blog</link>\n`;
  rssXml += `  <description>Practical guides, productivity workflows, and updates from the creators of TAB Explorer for Google Chrome.</description>\n`;
  rssXml += `  <language>en-us</language>\n`;
  rssXml += `  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
  rssXml += `  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  for (const post of posts) {
    const postUrl = `${SITE_URL}/blog/${post.slug}`;
    const pubDate = new Date(post.date).toUTCString();
    rssXml += `  <item>\n`;
    rssXml += `    <title><![CDATA[${post.title}]]></title>\n`;
    rssXml += `    <link>${postUrl}</link>\n`;
    rssXml += `    <guid isPermaLink="true">${postUrl}</guid>\n`;
    rssXml += `    <pubDate>${pubDate}</pubDate>\n`;
    rssXml += `    <description><![CDATA[${post.description}]]></description>\n`;
    rssXml += `  </item>\n`;
  }

  rssXml += `</channel>\n`;
  rssXml += `</rss>\n`;

  fs.writeFileSync(RSS_PATH, rssXml, 'utf-8');
  console.log(`[Blog Builder] Wrote RSS feed to ${RSS_PATH}`);

  // 4. If build/ exists with index.html (or if --prerender is passed), pre-render static HTML
  const isPrerenderArg = process.argv.includes('--prerender');
  if (isPrerenderArg || fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
    prerenderStaticPages(posts);
  }
}

buildBlog();
