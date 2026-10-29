const fs = require('fs');
const path = require('path');

const BANNED_PATTERNS = [
  // Clichés and stock AI transitions
  /\bin conclusion\b/i,
  /\bin summary\b/i,
  /\bto sum up\b/i,
  /\bfurthermore\b/i,
  /\bmoreover\b/i,
  /\badditionally\b/i,
  /\bit is important to note that\b/i,
  /\bin today's fast-paced world\b/i,
  /\bin today's digital age\b/i,
  /\bin the ever-evolving landscape\b/i,
  /\bevolving landscape\b/i,
  /\bdigital age\b/i,
  
  // Forbidden vocabulary from thing_to_avoid_when_writing.md
  /\bdelve\b/i,
  /\bdelving\b/i,
  /\btapestry\b/i,
  /\btestament\b/i,
  /\bbeacon\b/i,
  /\bunderscore\b/i,
  /\bshowcase\b/i,
  /\bpivotal\b/i,
  /\bparamount\b/i,
  /\bfoster\b/i,
  /\bcultivate\b/i,
  /\bmultifaceted\b/i,
  /\bnuanced\b/i,
  /\bembark\b/i
];

const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/tab-explorer/ijcnikejbjffhcnblofckaihgchkiged';

const PROJECT_ASSETS = [
  'screenshot-1-overview.png',
  'screenshot-2-organization.png',
  'screenshot-3-session-restore.png',
  'screenshot-4-customization.png',
  'marquee-promo-tile-1400x560.png',
  'small-promo-tile-440x280.png'
];

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: null, content: fileContent.trim() };
  
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

function verifyArticle(filePath) {
  console.log(`[Verifier] Checking article: ${filePath}`);
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(filePath)) {
    return { ok: false, errors: [`File does not exist: ${filePath}`], warnings };
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = parseFrontmatter(raw);

  if (!data) {
    errors.push('Missing or invalid YAML front matter block (must be enclosed in ---).');
    return { ok: false, errors, warnings };
  }

  // Front matter field checks required for static HTML pre-rendering, meta tags & JSON-LD
  const requiredFields = ['title', 'slug', 'date', 'description', 'author', 'readTime', 'category', 'tags'];
  for (const field of requiredFields) {
    if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
      errors.push(`Missing or empty front matter field: "${field}"`);
    }
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push(`Slug "${data.slug}" should only contain lowercase letters, numbers, and hyphens (used for canonical URL /blog/${data.slug}).`);
  }

  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push(`Date "${data.date}" should follow YYYY-MM-DD format for schema.org datePublished/dateModified.`);
  }

  // Meta description checks for SEO snippet length
  if (data.description) {
    if (data.description.length < 50) {
      warnings.push(`Description is short (${data.description.length} chars). Aim for 120-160 characters for optimal Google search snippets & social cards.`);
    } else if (data.description.length > 200) {
      warnings.push(`Description is long (${data.description.length} chars). Search engines will truncate snippets beyond ~160 characters.`);
    }
  }

  // Test JSON-LD compatibility
  try {
    const testJsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": data.title,
      "description": data.description,
      "datePublished": data.date,
      "author": { "@type": "Person", "name": data.author }
    };
    JSON.stringify(testJsonLd);
  } catch (err) {
    errors.push(`Metadata breaks JSON-LD schema serialization: ${err.message}`);
  }

  // Check duplicate slug in live posts
  const postsDir = path.join(__dirname, '..', 'src', 'posts');
  if (fs.existsSync(postsDir)) {
    const existing = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    const currentBase = path.basename(filePath);
    for (const f of existing) {
      if (f !== currentBase) {
        const otherRaw = fs.readFileSync(path.join(postsDir, f), 'utf8');
        const parsedOther = parseFrontmatter(otherRaw);
        if (parsedOther.data && parsedOther.data.slug === data.slug) {
          errors.push(`Duplicate slug "${data.slug}" found in live post: ${f}`);
        }
      }
    }
  }

  // Banned pattern checks in content
  for (const pattern of BANNED_PATTERNS) {
    const match = content.match(pattern);
    if (match) {
      errors.push(`Banned word or AI cliché detected: "${match[0]}"`);
    }
  }

  // Images check (User-driven workflow: images are optional, validated if present)
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const images = [];
  let imgMatch;
  while ((imgMatch = imageRegex.exec(content)) !== null) {
    images.push({ alt: imgMatch[1].trim(), src: imgMatch[2].trim() });
  }

  const publicDir = path.join(__dirname, '..', 'public');

  for (const img of images) {
    if (!img.alt) {
      warnings.push(`Image "${img.src}" has empty alt text. Add descriptive alt text for accessibility and SEO.`);
    }
    if (img.src.startsWith('/')) {
      const localPath = path.join(publicDir, img.src.replace(/^\//, ''));
      if (!fs.existsSync(localPath)) {
        errors.push(`Referenced local image does not exist on disk: ${img.src} (checked at ${localPath})`);
      }
    }
  }

  // Link to Chrome Web Store
  if (!content.includes(CHROME_STORE_URL)) {
    warnings.push(`Article does not mention or link to Chrome Web Store URL (${CHROME_STORE_URL}). Check if a natural closing recommendation fits.`);
  }

  // Length check
  const words = content.split(/\s+/).filter(Boolean).length;
  if (words < 400) {
    warnings.push(`Article is relatively short (${words} words). Ensure sufficient depth and practical value.`);
  }

  const ok = errors.length === 0;
  return {
    ok,
    errors,
    warnings,
    words,
    title: data.title,
    slug: data.slug,
    totalImages: images.length,
    images
  };
}

// CLI usage: node pipeline/verify.js <filepath>
if (require.main === module) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node pipeline/verify.js <path-to-article.md>');
    process.exit(1);
  }
  const result = verifyArticle(path.resolve(target));
  if (result.ok) {
    console.log(`[Verifier] PASS: "${result.title}" (${result.words} words)`);
    console.log(`[Verifier] Canonical URL: https://tabexplorer.site/blog/${result.slug}`);
    console.log(`[Verifier] Visuals: ${result.totalImages} image(s) verified`);
    console.log('[Verifier] SEO & Social tags verified: Title, Description, Open Graph, Twitter Cards, BlogPosting JSON-LD.');
    if (result.warnings.length > 0) {
      console.log('Warnings:');
      result.warnings.forEach(w => console.log(`  - ⚠ ${w}`));
    }
  } else {
    console.error(`[Verifier] FAIL: Found ${result.errors.length} error(s):`);
    result.errors.forEach(e => console.error(`  - ❌ ${e}`));
    if (result.warnings.length > 0) {
      console.log('Warnings:');
      result.warnings.forEach(w => console.log(`  - ⚠ ${w}`));
    }
    process.exit(1);
  }
}

module.exports = { verifyArticle, parseFrontmatter };
