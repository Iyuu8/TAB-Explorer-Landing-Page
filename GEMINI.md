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
4. **Draft First:**
   - Save the article in `pipeline/drafts/<slug>.md`.
   - Run verification checks (`node pipeline/verify.js pipeline/drafts/<slug>.md`).
   - Present the title, file name, description, quality check summary, and full article in chat.
   - **Stop and ask for user approval.**
   - **NEVER** move to `src/posts/`, commit, or push to GitHub before the user says "approve" in chat.
5. **Handling User Replies:**
   - **"approve"**: Move draft to `src/posts/<slug>.md` (or run `node pipeline/manage.js approve`), update `state.json`, rebuild via `node scripts/build-blog.js`, commit, and push (`git push origin master`). Report the live URL (`https://tabexplorer.site/blog/<slug>`).
   - **"rewrite"**: Apply feedback, re-verify, show updated version, ask for approval again.
   - **"skip"**: Mark topic as skipped in `state.json`, pick next pending.
   - **"change topic: [text]"**: Switch topic without advancing queue.

## 2. Blog Engine Details
- Live blog posts live in: `src/posts/*.md`.
- Front matter fields: `title`, `slug`, `date`, `description`, `author`, `readTime`, `category`, `tags`.
- Pre-build script: `node scripts/build-blog.js` (compiles to `src/posts/posts-data.json`, `public/sitemap.xml`, and `public/rss.xml`).
- Live site domain: `https://tabexplorer.site`.
