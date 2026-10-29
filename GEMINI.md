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
4. **User-Driven Images Workflow (Agent Writes Without Images):**
   - The agent writes the article text cleanly **without images**. Do not insert images, screenshots, or visual placeholders automatically.
   - The user decides whether and where to add images after reviewing the text draft.
5. **Draft First & Present Choices:**
   - Save the article in `pipeline/drafts/<slug>.md`.
   - Run verification checks (`node pipeline/verify.js pipeline/drafts/<slug>.md`).
   - Present the title, file name, description, quality check summary, and full article in chat.
   - **Stop and ask the user for their decision:**
     - **"approve"**: Publish the article immediately as-is without adding images.
     - **"add images"**: Reply with images and descriptions of where they should be placed.
     - **"rewrite"**: Reply with feedback to rewrite or refine the text.
     - **"skip"**: Mark topic as skipped in `state.json` and pick the next pending topic.
     - **"change topic: [text]"**: Switch to a different topic without advancing the list.
   - **NEVER** move to `src/posts/`, commit, or push to GitHub before the user says "approve" in chat.
6. **Handling User Replies:**
   - **"approve"**: Move draft to `src/posts/<slug>.md` (or run `node pipeline/manage.js approve`), update `state.json`, rebuild via `node scripts/build-blog.js`, commit, and push (`git push origin master`). Report the live URL (`https://tabexplorer.site/blog/<slug>`). Publishes the article as-is without images if none were added.
   - **"add images"** (with user's images & placement descriptions):
     - Place/save images in `public/blog-assets/<slug>/<filename>` (if local/new).
     - Insert each image into `pipeline/drafts/<slug>.md` at the designated positions using standard Markdown (`![Alt Text](/blog-assets/<slug>/filename.png)`).
     - Re-run `node pipeline/verify.js pipeline/drafts/<slug>.md`.
     - Present the updated draft with images in chat and ask for decision ("approve" to publish, or further edits).
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
