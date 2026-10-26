const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STATE_FILE = path.join(__dirname, 'state.json');
const DRAFTS_DIR = path.join(__dirname, 'drafts');
const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');
const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const PROJECT_ASSETS = [
  'screenshot-1-overview.png',
  'screenshot-2-organization.png',
  'screenshot-3-session-restore.png',
  'screenshot-4-customization.png',
  'marquee-promo-tile-1400x560.png',
  'small-promo-tile-440x280.png'
];

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    throw new Error(`State file not found at ${STATE_FILE}`);
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveState(state) {
  state.lastUpdated = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function getAssetSizes() {
  const sizes = {};
  PROJECT_ASSETS.forEach(f => {
    const full = path.join(ASSETS_DIR, f);
    if (fs.existsSync(full)) {
      sizes[f] = fs.statSync(full).size;
    }
  });
  return sizes;
}

function auditAssetUsage() {
  const state = loadState();
  const assetSizes = getAssetSizes();
  const usage = {};

  PROJECT_ASSETS.forEach(asset => {
    usage[asset] = { count: 0, lastUsedArticle: null, usedIn: [] };
  });

  if (!fs.existsSync(POSTS_DIR)) {
    state.assetUsage = usage;
    saveState(state);
    return usage;
  }

  const posts = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  for (const post of posts) {
    const content = fs.readFileSync(path.join(POSTS_DIR, post), 'utf8');
    const slug = post.replace('.md', '');
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      const src = match[1].trim();
      for (const asset of PROJECT_ASSETS) {
        let isMatch = false;
        if (src.includes(asset)) {
          isMatch = true;
        } else if (src.startsWith('/')) {
          const localPath = path.join(PUBLIC_DIR, src.replace(/^\//, ''));
          if (fs.existsSync(localPath) && fs.statSync(localPath).size === assetSizes[asset]) {
            isMatch = true;
          }
        }

        if (isMatch) {
          if (!usage[asset].usedIn.includes(slug)) {
            usage[asset].count++;
            usage[asset].lastUsedArticle = slug;
            usage[asset].usedIn.push(slug);
          }
        }
      }
    }
  }

  state.assetUsage = usage;
  saveState(state);
  return usage;
}

function getAssetStats() {
  const state = loadState();
  const usage = state.assetUsage || auditAssetUsage();

  // Find most recent published post to detect last used assets
  let lastPublishedSlug = null;
  const publishedTopics = (state.topics || []).filter(t => t.status === 'published' && t.publishedDate);
  publishedTopics.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  if (publishedTopics.length > 0) {
    lastPublishedSlug = publishedTopics[0].slug;
  }

  const assetsArray = PROJECT_ASSETS.map(asset => ({
    asset,
    count: usage[asset] ? usage[asset].count : 0,
    usedInLastArticle: usage[asset] ? usage[asset].usedIn.includes(lastPublishedSlug) : false,
    lastUsedArticle: usage[asset] ? usage[asset].lastUsedArticle : null
  }));

  // Sort by count ascending (least used first)
  assetsArray.sort((a, b) => a.count - b.count);

  const recommendedForNext = assetsArray.filter(a => !a.usedInLastArticle);

  return {
    lastPublishedSlug,
    assets: assetsArray,
    recommendedForNext: recommendedForNext.map(a => a.asset),
    maxPerArticle: 1,
    rule: 'Prioritize images outside assets for general sections. Project assets are capped at <= 1 per article and only permitted when explicitly discussing Tab Explorer.'
  };
}

function getStatus() {
  const state = loadState();
  const summary = {
    total: state.topics.length,
    pending: state.topics.filter(t => t.status === 'pending').length,
    drafted: state.topics.filter(t => t.status === 'drafted').length,
    published: state.topics.filter(t => t.status === 'published').length,
    skipped: state.topics.filter(t => t.status === 'skipped').length,
    extraArticles: state.extraArticles ? state.extraArticles.length : 0,
    activeDraft: state.activeDraft,
    assetUsage: state.assetUsage || auditAssetUsage()
  };
  return { state, summary };
}

function findTopic(state, titleQuery) {
  const q = titleQuery.toLowerCase().trim();
  let topic = state.topics.find(t => t.title.toLowerCase() === q);
  if (topic) return { topic, isExtra: false };

  topic = state.topics.find(t => t.title.toLowerCase().includes(q));
  if (topic) return { topic, isExtra: false };

  if (state.extraArticles) {
    const extra = state.extraArticles.find(t => t.title.toLowerCase().includes(q));
    if (extra) return { topic: extra, isExtra: true };
  }

  return { topic: null, isExtra: false };
}

function getNextPending(state) {
  return state.topics.find(t => t.status === 'pending') || null;
}

function setDraft(title, fileName, slug) {
  const state = loadState();
  let found = state.topics.find(t => t.title.toLowerCase() === title.toLowerCase().trim());
  
  if (found) {
    found.status = 'drafted';
    found.fileName = fileName;
    found.slug = slug;
  } else {
    if (!state.extraArticles) state.extraArticles = [];
    found = state.extraArticles.find(t => t.title.toLowerCase() === title.toLowerCase().trim());
    if (found) {
      found.status = 'drafted';
      found.fileName = fileName;
      found.slug = slug;
    } else {
      found = {
        title: title.trim(),
        status: 'drafted',
        fileName,
        slug,
        publishedDate: null,
        isCustom: true
      };
      state.extraArticles.push(found);
    }
  }

  state.activeDraft = {
    title: found.title,
    fileName,
    slug,
    draftPath: path.join('pipeline', 'drafts', fileName)
  };

  saveState(state);
  return found;
}

function approveDraft(fileName) {
  const state = loadState();
  const fileToApprove = fileName || (state.activeDraft ? state.activeDraft.fileName : null);
  
  if (!fileToApprove) {
    throw new Error('No draft file specified and no active draft found in state.json.');
  }

  const srcDraftPath = path.join(DRAFTS_DIR, fileToApprove);
  const destLivePath = path.join(POSTS_DIR, fileToApprove);

  if (!fs.existsSync(srcDraftPath)) {
    throw new Error(`Draft file does not exist at ${srcDraftPath}`);
  }

  // Move file to src/posts/
  fs.copyFileSync(srcDraftPath, destLivePath);
  fs.unlinkSync(srcDraftPath);

  // Update state.json
  const today = new Date().toISOString().slice(0, 10);
  let matched = state.topics.find(t => t.fileName === fileToApprove);
  if (!matched && state.extraArticles) {
    matched = state.extraArticles.find(t => t.fileName === fileToApprove);
  }

  if (matched) {
    matched.status = 'published';
    matched.publishedDate = today;
  }

  state.activeDraft = null;
  saveState(state);

  // Re-audit asset usage
  auditAssetUsage();

  // Run build-blog to update posts-data.json, sitemap.xml, rss.xml, and static HTML pre-render
  console.log('[Pipeline Manage] Running build-blog.js with static pre-render...');
  execSync('node scripts/build-blog.js --prerender', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  return { file: fileToApprove, destLivePath, slug: matched ? matched.slug : fileToApprove.replace(/\.md$/, '') };
}

function skipTopic(titleQuery) {
  const state = loadState();
  const { topic } = findTopic(state, titleQuery);
  if (!topic) {
    throw new Error(`Topic matching "${titleQuery}" not found.`);
  }
  topic.status = 'skipped';
  saveState(state);
  return topic;
}

// CLI handler
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  try {
    if (cmd === 'status') {
      const { summary } = getStatus();
      console.log(JSON.stringify(summary, null, 2));
    } else if (cmd === 'next') {
      const state = loadState();
      const next = getNextPending(state);
      console.log(JSON.stringify(next, null, 2));
    } else if (cmd === 'asset-stats') {
      const stats = getAssetStats();
      console.log(JSON.stringify(stats, null, 2));
    } else if (cmd === 'audit-assets') {
      const audited = auditAssetUsage();
      console.log(JSON.stringify(audited, null, 2));
    } else if (cmd === 'set-draft') {
      const title = args[1];
      const fileName = args[2];
      const slug = args[3];
      if (!title || !fileName || !slug) {
        console.error('Usage: node pipeline/manage.js set-draft "<title>" "<filename.md>" "<slug>"');
        process.exit(1);
      }
      const updated = setDraft(title, fileName, slug);
      console.log('Draft registered:', JSON.stringify(updated, null, 2));
    } else if (cmd === 'approve') {
      const fileName = args[1];
      const res = approveDraft(fileName);
      console.log(`Approved and moved to ${res.destLivePath}. Blog rebuilt.`);
    } else if (cmd === 'skip') {
      const title = args[1];
      if (!title) {
        console.error('Usage: node pipeline/manage.js skip "<title>"');
        process.exit(1);
      }
      const skipped = skipTopic(title);
      console.log(`Topic marked as skipped: "${skipped.title}"`);
    } else {
      console.log('Commands: status, next, asset-stats, audit-assets, set-draft, approve, skip');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

module.exports = {
  PROJECT_ASSETS,
  loadState,
  saveState,
  getStatus,
  findTopic,
  getNextPending,
  setDraft,
  approveDraft,
  skipTopic,
  auditAssetUsage,
  getAssetStats
};
