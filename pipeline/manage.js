const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STATE_FILE = path.join(__dirname, 'state.json');
const DRAFTS_DIR = path.join(__dirname, 'drafts');
const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');

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

function getStatus() {
  const state = loadState();
  const summary = {
    total: state.topics.length,
    pending: state.topics.filter(t => t.status === 'pending').length,
    drafted: state.topics.filter(t => t.status === 'drafted').length,
    published: state.topics.filter(t => t.status === 'published').length,
    skipped: state.topics.filter(t => t.status === 'skipped').length,
    extraArticles: state.extraArticles ? state.extraArticles.length : 0,
    activeDraft: state.activeDraft
  };
  return { state, summary };
}

function findTopic(state, titleQuery) {
  const q = titleQuery.toLowerCase().trim();
  // exact match first
  let topic = state.topics.find(t => t.title.toLowerCase() === q);
  if (topic) return { topic, isExtra: false };

  // loose contains match
  topic = state.topics.find(t => t.title.toLowerCase().includes(q));
  if (topic) return { topic, isExtra: false };

  // check extra articles
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
    // Custom topic not in list: add to extraArticles without advancing regular list
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
      console.log('Commands: status, next, set-draft, approve, skip');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

module.exports = {
  loadState,
  saveState,
  getStatus,
  findTopic,
  getNextPending,
  setDraft,
  approveDraft,
  skipTopic
};
