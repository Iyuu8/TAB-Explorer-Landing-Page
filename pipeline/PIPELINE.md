# TAB Explorer — Daily Blog Writing Pipeline Specification

This document defines the automated, agent-operated daily blog writing pipeline for **TAB Explorer** ([tabexplorer.site](https://tabexplorer.site)).

---

## 1. Overview & Architecture

- **Operator:** The AI agent (Antigravity).
- **Execution Mode:** Chat-triggered, zero external API keys, zero external cron/schedulers.
- **Trigger:** Initiated whenever the user sends a message like `"run the pipeline"`, optionally accompanied by extra context, an angle, or a topic instruction.
- **Workflow State:** Tracked continuously across sessions in `pipeline/state.json`.
- **Target Publication Format:** Markdown files (`.md`) compiled via `scripts/build-blog.js` into React client data (`src/posts/posts-data.json`), `public/sitemap.xml`, and `public/rss.xml`, deployed automatically via Git push to Vercel.

---

## 2. Directory & File Structure

```
landing_page/
├── GEMINI.md                            # Workspace rule ensuring pipeline behavior in all chats
├── scripts/
│   └── build-blog.js                   # Parses src/posts/*.md -> posts-data.json, sitemap, rss
├── src/
│   └── posts/                          # LIVE published blog articles (src/posts/*.md)
│       └── posts-data.json             # Generated JSON index of published posts
└── pipeline/
    ├── PIPELINE.md                     # This full pipeline specification
    ├── thing_to_avoid_when_writing.md  # Mandatory anti-AI writing & voice guidelines
    ├── extension_info.md               # The ONLY source of truth for Tab Explorer features
    ├── article_topics.md               # 50 topics in fixed publishing order
    ├── state.json                      # Persistent tracking state (keyed by topic title)
    ├── verify.js                       # Automated linter for banned words & front matter
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
- Follow human-voice guidelines: varied sentence lengths, natural paragraphs, conversational touches, concrete examples.
- Include the primary keyword naturally and address secondary keywords and the specified angle.
- Mention TAB Explorer only where it genuinely fits (typically in a natural concluding section or recommendation), linking to:
  `https://chromewebstore.google.com/detail/tab-explorer/ijcnikejbjffhcnblofckaihgchkiged`

### Step 5: Save as Draft
- Save the completed draft in `pipeline/drafts/<slug>.md`.
- Do **NOT** save into `src/posts/` yet.

### Step 6: Automated & Quality Checks
Before presenting the article, run:
```bash
node pipeline/verify.js pipeline/drafts/<slug>.md
```
Verify:
1. Anti-AI writing check: Zero banned words or clichés (`delve`, `tapestry`, `pivotal`, `in conclusion`, etc.).
2. Fact-checking: Every Tab Explorer feature verified against `pipeline/extension_info.md`.
3. No duplicate slug or title in `src/posts/` or `state.json`.
4. Front matter integrity: all required fields present and valid.
5. Chrome Web Store link present and accurate.

### Step 7: Present in Chat & Request Approval
- Display in chat:
  - Article Title
  - Target File Name & Slug
  - Meta Description
  - Quality checks summary
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
4. Commit and push:
   ```bash
   git add src/posts/<slug>.md src/posts/posts-data.json public/sitemap.xml public/rss.xml pipeline/state.json
   git commit -m "Publish blog post: <Article Title>"
   git push origin master
   ```
5. Confirm completion in chat and provide the live production URL:  
   `https://tabexplorer.site/blog/<slug>`

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

## 7. Article Front Matter & Markdown Standard

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

### Front Matter Schema
| Field | Type | Description |
|---|---|---|
| `title` | String | Clear, engaging title matching or adapting the topic title |
| `slug` | String | URL-safe lowercase alphanumeric slug with hyphens |
| `date` | String | Publication date in `YYYY-MM-DD` |
| `description` | String | 1–2 punchy sentences for SEO and card previews |
| `author` | String | Default: `"Benaziza Ayoub"` |
| `readTime` | String | e.g., `"5 min read"` |
| `category` | String | e.g., `"Productivity"`, `"Study Workflows"`, `"Comparisons"`, `"Guides"` |
| `tags` | Array | 2–5 relevant tags as string array |

---

## 8. Safety & Integrity Rules

- **Zero API Keys:** The agent writes the articles directly in conversation context.
- **Zero Token Extraction:** Never inspect, read, or reuse authentication tokens or secrets.
- **Fact-Lock:** Never fabricate numbers, statistics, benchmarks, or browser compatibility claims. If missing, ask the user.
- **Preserve Documentation:** Never delete comments, code docstrings, or existing blog posts.
