# TAB Explorer — Daily Blog Writing Pipeline Specification

This document defines the automated, agent-operated daily blog writing pipeline for **TAB Explorer** ([tabexplorer.site](https://tabexplorer.site)).

---

## 1. Overview & Architecture

- **Operator:** The AI agent (Antigravity).
- **Execution Mode:** Chat-triggered, zero external API keys, zero external cron/schedulers.
- **Trigger:** Initiated whenever the user sends a message like `"run the pipeline"`, optionally accompanied by extra context, an angle, or a topic instruction.
- **Workflow State:** Tracked continuously across sessions in `pipeline/state.json`.
- **Target Publication Format:** Markdown files (`src/posts/*.md`) compiled via `scripts/build-blog.js` and pre-rendered into fully static HTML pages (`build/blog/<slug>/index.html`) deployed automatically via Git push to Vercel.

### Static HTML Pre-Rendering Engine (Built-in)
Every blog post published to `src/posts/` is automatically processed through a 3-phase build pipeline:
1. **Pre-build (`prebuild`):** `node scripts/build-blog.js` scans `src/posts/`, parses Markdown frontmatter, compiles `src/posts/posts-data.json`, updates `public/sitemap.xml`, and generates `public/rss.xml`.
2. **Compile (`build`):** `react-scripts build` bundles React app assets into `build/index.html`.
3. **Static Pre-render (`postbuild` / `--prerender`):** `node scripts/build-blog.js --prerender` transforms `build/index.html` into independent, fully formed static HTML files:
   - `build/blog/index.html` & `build/blog.html` for the `/blog` index.
   - `build/blog/<slug>/index.html` & `build/blog/<slug>.html` for each individual post.

### Pre-Rendered Static Metadata & SEO Tags
Every generated post page contains hardcoded, server-ready HTML head tags and structured data:
- **Page Title:** `<title><post.title> — TAB Explorer</title>`
- **Meta Description:** `<meta name="description" content="<post.description>" />`
- **Canonical URL:** `<link rel="canonical" href="https://tabexplorer.site/blog/<slug>" />`
- **Open Graph Tags:** `og:type` (`article`), `og:site_name`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:secure_url`, `og:image:width` (1400), `og:image:height` (560), `article:published_time`, `article:author`.
- **Twitter Card Tags:** `twitter:card` (`summary_large_image`), `twitter:url`, `twitter:title`, `twitter:description`, `twitter:image`.
- **JSON-LD Schema:** Valid Schema.org `BlogPosting` block with `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, and `image`.
- **Pre-rendered Body:** Complete pre-rendered HTML structure directly inside `<div id="root">`, including universal header, breadcrumb navigation, article body markup, tags list, Chrome Web Store callout box, and site footer.

**Vercel & Search Engine Serving:** When Googlebot, social scrapers (Twitter, LinkedIn, Slack, Facebook), or browsers request `https://tabexplorer.site/blog/<slug>`, Vercel serves the static HTML file immediately with HTTP 200, delivering complete text and metadata before client JavaScript hydrates.

---

## 2. Directory & File Structure

```
landing_page/
├── GEMINI.md                            # Workspace rule ensuring pipeline behavior in all chats
├── .agents/rules/blog-pipeline.md       # Backup workspace agent rule
├── package.json                         # Scripts: prebuild, build (with --prerender), postbuild
├── scripts/
│   └── build-blog.js                   # Dual-role: Markdown compiler & Static HTML pre-renderer
├── src/
│   └── posts/                          # LIVE published blog articles (src/posts/*.md)
│       ├── posts-data.json             # Generated JSON index of published posts
│       └── <slug>.md                   # Markdown source files
├── public/
│   ├── sitemap.xml                     # Auto-updated XML sitemap with all post URLs
│   └── rss.xml                         # Auto-updated RSS 2.0 feed
├── build/                              # Production output directory (created during build)
│   ├── blog/
│   │   ├── index.html                  # Pre-rendered static /blog index
│   │   └── <slug>/
│   │       └── index.html              # Pre-rendered static /blog/<slug> page
│   └── blog.html                       # Fallback static /blog
└── pipeline/
    ├── PIPELINE.md                     # This full pipeline specification
    ├── thing_to_avoid_when_writing.md  # Mandatory anti-AI writing & voice guidelines
    ├── extension_info.md               # The ONLY source of truth for Tab Explorer features
    ├── article_topics.md               # 50 topics in fixed publishing order
    ├── state.json                      # Persistent tracking state (keyed by topic title)
    ├── verify.js                       # Automated linter for banned words & SEO front matter
    ├── manage.js                       # State manager CLI helper
    └── drafts/                         # Staging area for unapproved articles
        └── .gitkeep
```

---

## 3. Core Static Files & Sources of Truth

1. **`pipeline/thing_to_avoid_when_writing.md`**  
   Read fully before writing every single article. Forbids AI clichés, mechanical layouts (no rigid 3-part structures), repetitive list formatting, flat tone, uniform sentence lengths, and banned vocabulary (`delve`, `tapestry`, `pivotal`, `in conclusion`, `in today's digital age`, etc.).

2. **`pipeline/extension_info.md`**  
   The **only** source of truth regarding TAB Explorer's features, version history, keyboard shortcuts, and capabilities.  
   *Rule:* Never invent, extrapolate, or guess any feature, number, or claim. If something is not in this file or provided in the user's message, do not state it.

3. **`pipeline/article_topics.md`**  
   The master list of 50 topics organized in publishing sequence across 7 phases. Each entry includes:
   - Primary keyword
   - Secondary keywords
   - Editorial angle
   - Any `⚠ Confirm first` warnings

4. **`pipeline/state.json`**  
   Tracks topic progress by **title** (not number, preserving integrity if topics are reordered). Tracks:
   - `status`: `"pending"` | `"drafted"` | `"published"` | `"skipped"`
   - `fileName`: Name of the `.md` file (e.g., `scholarship-university-applications-guide.md`)
   - `slug`: URL slug for the article
   - `publishedDate`: Date published (YYYY-MM-DD)
   - `activeDraft`: Currently active draft under review
   - `extraArticles`: List for custom off-list topics ordered by the user

---

## 4. Topic Selection Rules (Strict Priority Order)

When the user triggers the pipeline:

1. **User Ordered Specific Topic (Priority 1):**
   - If the user explicitly orders writing about a specific topic (e.g., `"write about X"` or `"run the pipeline on X"`), write about that topic.
   - **If the topic is NOT in `article_topics.md`:** Write the article anyway. Do **not** advance the main pending topic in the list. Record it in `state.json` under `extraArticles`.
   - **If the topic matches an existing entry in `article_topics.md`:** Use that list entry, match its keywords/angle, and mark that specific entry as drafted in `state.json`.
2. **Standard Queue Progression (Priority 2):**
   - If the user message has no topic order (e.g., just `"run the pipeline"` or provides general angles/updates), choose the **first pending topic** from `article_topics.md` in order. Apply the user's extra instructions/angles to this topic.
3. **Duplicate Prevention (Priority 3):**
   - If the chosen topic already has a draft or published article, stop and notify the user instead of producing a duplicate.

---

## 5. Daily Execution Flow ("run the pipeline")

When the user says `"run the pipeline"`:

### Step 1: Read Guidelines & State
1. Read `pipeline/thing_to_avoid_when_writing.md`.
2. Read `pipeline/extension_info.md`.
3. Read `pipeline/state.json` (or run `node pipeline/manage.js next`).
4. Read the user's message for custom instructions, angles, or updates.

### Step 2: Topic Selection & State Update
- Determine topic based on Section 4 priority rules.
- Mark topic status as `"drafted"` in `pipeline/state.json` (using `node pipeline/manage.js set-draft`).

### Step 3: "Confirm First" Safety Verification
- If the topic entry contains `⚠ Confirm first`, verify every claim about TAB Explorer against `pipeline/extension_info.md`.
- If an essential factual claim is not answered by `extension_info.md` or the user's message, stop and ask the user for confirmation before writing.

### Step 4: Write the Article
- Write the article following the blog's exact front matter and markdown formatting.
- Ensure front matter fields (`title`, `slug`, `date`, `description`, `author`, `readTime`, `category`, `tags`) are completely valid, as they directly feed the static pre-rendering head tags, Open Graph cards, Twitter cards, and Schema.org JSON-LD.
- Follow human-voice guidelines: varied sentence lengths, natural paragraphs, conversational touches, concrete examples.
- Include the primary keyword naturally and address secondary keywords and the specified angle.
- **Mandatory Visuals (Every article must include pictures):**
  - **For Tab Explorer:**
    1. **Project Assets:** High-resolution screenshots already in `public/assets/` (`screenshot-1-overview.png`, `screenshot-2-organization.png`, `screenshot-3-session-restore.png`, `screenshot-4-customization.png`, `marquee-promo-tile-1400x560.png`, `small-promo-tile-440x280.png`).
    2. **Actual Screenshots:** Real screenshots of the extension's sidepanel or full-page view captured directly from the extension UI.
  - **For General Information & Concepts:**
    3. **AI-Generated Images OR Non-Copyrighted Internet Images:**
       - Use AI-generated illustrations/diagrams, OR
       - Use royalty-free, public domain, or open-licensed photos from the internet (e.g., Unsplash, Pexels, Wikimedia Commons). **Strict rule:** Internet images must NEVER be copyrighted, watermarked, or unlicensed.
  - **Storage & Linking:** Save article-specific images into `public/blog-assets/<slug>/` so they deploy statically with the site, and embed them via standard Markdown: `![Descriptive Alt Text](/blog-assets/<slug>/filename.png)`. Always provide descriptive alt text.
- Mention TAB Explorer only where it genuinely fits (typically in a natural concluding section or recommendation), linking to:
  `https://chromewebstore.google.com/detail/tab-explorer/ijcnikejbjffhcnblofckaihgchkiged`

### Step 5: Save as Draft
- Save the completed draft in `pipeline/drafts/<slug>.md`.
- Save any newly generated or downloaded image files into `public/blog-assets/<slug>/`.
- Do **NOT** save the markdown post into `src/posts/` yet.

### Step 6: Automated & Quality Checks
Before presenting the article, run:
```bash
node pipeline/verify.js pipeline/drafts/<slug>.md
```
Verify:
1. Anti-AI writing check: Zero banned words or clichés (`delve`, `tapestry`, `pivotal`, `in conclusion`, etc.).
2. Fact-checking: Every Tab Explorer feature verified against `pipeline/extension_info.md`.
3. Visuals check: Contains relevant pictures from the 3 allowed sources with verified non-broken paths and descriptive alt text.
4. No duplicate slug or title in `src/posts/` or `state.json`.
5. Front matter integrity: all required fields present, date format valid (`YYYY-MM-DD`), description suitable for search snippets (120-160 chars recommended), valid JSON-LD serialization.
6. Chrome Web Store link present and accurate.

### Step 7: Present in Chat & Request Approval
- Display in chat:
  - Article Title
  - Target File Name & Slug
  - Meta Description
  - Quality checks summary (verifier output & manual confirmation)
  - The full markdown article
- Stop and explicitly ask the user for approval.
- **NEVER** publish, move to `src/posts/`, commit, or push before user gives explicit approval in chat.

---

## 6. User Feedback & Post-Review Protocols

Depending on how the user responds in chat:

### If user says "approve":
1. Move the draft from `pipeline/drafts/<slug>.md` to `src/posts/<slug>.md` (or run `node pipeline/manage.js approve`).
2. Update `pipeline/state.json`: mark topic status as `"published"`, record `publishedDate`.
3. Rebuild blog assets:
   ```bash
   node scripts/build-blog.js
   ```
   *(If `build/index.html` exists locally, this also automatically updates the static pre-rendered HTML in `build/blog/<slug>/index.html`.)*
4. Commit and push:
   ```bash
   git add src/posts/<slug>.md src/posts/posts-data.json public/sitemap.xml public/rss.xml pipeline/state.json
   git commit -m "Publish blog post: <Article Title>"
   git push origin master
   ```
5. Confirm completion in chat and provide the live production URL:  
   `https://tabexplorer.site/blog/<slug>`  
   *(Vercel automatically triggers `npm run build`, which runs `prebuild`, compiles the React app, and executes `postbuild: node scripts/build-blog.js --prerender` to serve the static HTML immediately with HTTP 200.)*

### If user says "rewrite" [with feedback] or "rewrite <topic/file>":
1. Apply user feedback and rewrite the article.
2. If working on a draft, update `pipeline/drafts/<slug>.md`.
3. If working on an already published article, edit `src/posts/<slug>.md`, rebuild via `node scripts/build-blog.js`, but only commit and push after user re-approves.
4. Run `pipeline/verify.js`, present the new version in chat, and ask for approval again.

### If user says "skip":
1. Mark the topic as `"skipped"` in `pipeline/state.json` (or `node pipeline/manage.js skip "<title>"`).
2. Immediately identify and pick the next pending topic in `article_topics.md` order.

### If user says "change topic: [text]":
1. Switch to the user's requested topic immediately without advancing the queue in `article_topics.md`.
2. Follow the writing and review flow for the new topic.

---

## 7. Article Front Matter & Pre-Rendering Schema Mapping

Every article must match this exact format:

```markdown
---
title: "How to Organize University and Scholarship Applications in Your Browser"
slug: "organize-university-scholarship-applications-browser"
date: "2026-10-24"
description: "A practical guide to organizing messy university and scholarship portals into a clean, stress-free browser workspace."
author: "Benaziza Ayoub"
readTime: "5 min read"
category: "Productivity"
tags: ["Chrome Tabs", "Study Workflows", "Organization"]
---

[Article content in clean Markdown...]
```

### Front Matter to Static HTML Head & SEO Mapping
| Markdown Field | Type | Injected Static HTML Output |
|---|---|---|
| `title` | String | `<title><title> — TAB Explorer</title>`, `og:title`, `twitter:title`, JSON-LD `headline`, `<h1>` heading |
| `slug` | String | Path `/blog/<slug>`, canonical `<link rel="canonical" href="https://tabexplorer.site/blog/<slug>" />`, `og:url`, `twitter:url`, JSON-LD `@id` |
| `date` | String (`YYYY-MM-DD`) | `article:published_time`, JSON-LD `datePublished` & `dateModified`, header date display |
| `description` | String | `<meta name="description">`, `og:description`, `twitter:description`, JSON-LD `description`, lead paragraph `<p>` |
| `author` | String | `article:author`, JSON-LD `author.name` (default: `"Benaziza Ayoub"`), author card display |
| `readTime` | String | Header metadata badge (e.g., `"5 min read"`) |
| `category` | String | Category pill badge (e.g., `"Productivity"`, `"Guides"`) |
| `tags` | Array of Strings | Tag badges at the bottom of the article |

---

## 8. Safety & Integrity Rules

- **Zero API Keys:** The agent writes the articles directly in conversation context.
- **Zero Token Extraction:** Never inspect, read, or reuse authentication tokens or secrets.
- **Fact-Lock:** Never fabricate numbers, statistics, benchmarks, or browser compatibility claims. If missing, ask the user.
- **Strictly Non-Copyrighted Images:** Any pictures sourced from the internet must be verified free of copyright (e.g., Unsplash, Pexels, Wikimedia Commons, CC0 public domain). Never embed copyrighted or watermarked imagery.
- **Preserve Documentation:** Never delete comments, code docstrings, or existing blog posts.
