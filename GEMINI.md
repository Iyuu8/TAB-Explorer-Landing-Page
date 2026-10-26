# TAB Explorer — Project Instructions & Daily Blog Pipeline

## 1. Daily Blog Pipeline Trigger & Workflow

Whenever the user prompts with **"run the pipeline"** (or related phrases like "write today's article", "pipeline", etc.):
You (the agent) must execute the Daily Blog Writing Pipeline defined in detail in `pipeline/PIPELINE.md`.

### Core Pipeline Directives:
1. **Never use an external API key or scheduler:** You write the articles yourself within the chat.
2. **Sources of Truth:**
   - `pipeline/thing_to_avoid_when_writing.md`: Mandatory writing rules. Avoid all AI clichés, rigid list formats, and banned words (`delve`, `tapestry`, `pivotal`, `in conclusion`, `in today's digital age`, etc.).
   - `pipeline/extension_info.md`: Only source of truth on Tab Explorer features. Never invent or guess any capability or claim.
   - `pipeline/article_topics.md`: 50 topics in fixed publishing order.
   - `pipeline/state.json`: Topic state tracking by title (`pending`, `drafted`, `published`, `skipped`).
3. **Topic Selection Priority:**
   - Priority 1: User explicitly orders a topic in their message. (If not in list, write as custom extra article in `state.json` without advancing list; if in list, mark that entry).
   - Priority 2: Pick first `pending` topic from `article_topics.md` in order, applying user's extra instructions/angle.
   - Priority 3: Never duplicate an existing drafted/published article.
4. **Mandatory Visuals & Asset Prioritization (Avoid Repetitiveness):**
   - **Prioritize Images Outside Assets for General Sections:** For all general concepts, problem framing, study/work setups, and research tips, always prioritize images outside assets (AI-generated illustrations or non-copyrighted/royalty-free web photos from Unsplash, Pexels, Wikimedia, CC0). Never use copyrighted images.
   - **Use Project Assets ONLY When Explicitly Discussing Tab Explorer:** Visuals from `public/assets/` (`screenshot-1-overview.png`, `screenshot-2-organization.png`, `screenshot-3-session-restore.png`, `screenshot-4-customization.png`, `marquee-promo-tile-1400x560.png`, etc.) may only be used when explicitly demonstrating Tab Explorer itself. Never use them for generic points.
   - **Asset Distribution Ceiling (<= 1 per article):** Each article has a maximum budget of at most 1 project asset image (<= 1). An article can use 0 asset images; unused allowance transfers forward to future articles without exceeding the 1-asset ceiling.
   - **Track & Rotate Usage:** Keep count of asset usage in `state.json` (`node pipeline/manage.js asset-stats`). Always pick the least-used asset and never repeat the asset used in the immediately preceding article.
   - Store article-specific images in `public/blog-assets/<slug>/` and link them via standard Markdown: `![Alt Text](/blog-assets/<slug>/filename.png)`.
5. **Draft First:**
   - Save the article in `pipeline/drafts/<slug>.md`.
   - Run verification checks (`node pipeline/verify.js pipeline/drafts/<slug>.md`).
   - Present the title, file name, description, quality check summary, and full article in chat.
   - **Stop and ask for user approval.**
   - **NEVER** move to `src/posts/`, commit, or push to GitHub before the user says "approve" in chat.
6. **Handling User Replies:**
   - **"approve"**: Move draft to `src/posts/<slug>.md` (or run `node pipeline/manage.js approve`), update `state.json`, rebuild via `node scripts/build-blog.js`, commit, and push (`git push origin master`). Report the live URL (`https://tabexplorer.site/blog/<slug>`).
   - **"rewrite"**: Apply feedback, re-verify, show updated version, ask for approval again.
   - **"skip"**: Mark topic as skipped in `state.json`, pick next pending.
   - **"change topic: [text]"**: Switch topic without advancing queue.

## 2. Blog Engine & Static Pre-Rendering Architecture
- **Markdown Source:** Live blog posts live in `src/posts/*.md`.
- **Front Matter Requirements:** `title`, `slug`, `date`, `description`, `author`, `readTime`, `category`, `tags`.
  *Note:* These front matter fields directly populate the static HTML `<title>`, `<meta description>`, canonical `<link>`, Open Graph, Twitter cards, and Schema.org `BlogPosting` JSON-LD at build time.
- **3-Phase Build Process:**
  1. `prebuild`: `node scripts/build-blog.js` compiles `src/posts/posts-data.json`, `public/sitemap.xml`, and `public/rss.xml`.
  2. `build`: `react-scripts build` compiles the React application bundle.
  3. `postbuild`: `node scripts/build-blog.js --prerender` reads the compiled template and writes standalone, pre-rendered static HTML files to `build/blog/index.html` and `build/blog/<slug>/index.html`.
- **Static Serving:** Vercel immediately serves static HTML with HTTP 200 to search engines and social crawlers before client-side hydration.
- **Live Site Domain:** `https://tabexplorer.site`.
