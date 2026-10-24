const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');
const OUTPUT_JSON = path.join(POSTS_DIR, 'posts-data.json');
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');
const RSS_PATH = path.join(__dirname, '..', 'public', 'rss.xml');
const SITE_URL = 'https://tabexplorer.site';

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
          val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        }
      }
      data[key] = val;
    }
  });

  return { data, content };
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
    const author = data.author || 'TAB Explorer Team';
    const category = data.category || 'Productivity';
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const readTime = data.readTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`;

    // Render markdown to HTML
    const html = marked.parse(content);

    posts.push({
      slug,
      title,
      date,
      description,
      author,
      category,
      tags,
      readTime,
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
}

buildBlog();
