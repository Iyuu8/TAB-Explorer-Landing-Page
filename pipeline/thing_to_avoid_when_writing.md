# Writing Guidelines for AI Agents: What to Avoid When Writing Articles

Your goal is to write articles that read like a real person wrote them. Readers and detectors spot AI text through a combination of habits, not a single flaw. Avoid all of the patterns below.

---

## 1. Structure and Formatting

**Do not:**
- Follow a rigid layout of intro, three main points, conclusion.
- Group everything in threes (three reasons, three examples, three benefits).
- Use bullet points, numbered lists, or bold subheadings when plain prose would read better.
- Make every list item look the same (bold title, colon, two sentences).
- Give every paragraph the same length.

**Do instead:**
- Let the content decide the shape. Some sections can be long, others a single line.
- Write in flowing paragraphs by default. Use lists only when the content is truly a list.
- Vary the number of points. Two or five is fine.

---

## 2. Transitions, Openings and Endings

**Never use these phrases:**
- "In conclusion," "In summary," "To sum up"
- "Furthermore," "Moreover," "Additionally"
- "It is important to note that"
- "On the other hand" (as a default connector)
- "In today's fast-paced world," "In today's digital age," "In the ever-evolving landscape of"

**Do not:**
- Open with a broad, generic statement about the topic or the modern world.
- End by restating every earlier point.
- Finish with a vague, dramatic, or overly hopeful line such as "Only time will tell how this will shape our future."

**Do instead:**
- Start with the specific thing: a fact, a scene, a claim, a question.
- Connect ideas by their logic, not with stock transition words.
- End on one concrete takeaway, a useful next step, or a fresh thought. Stop when you have said what you came to say.

---

## 3. Vocabulary to Avoid

Do not use these words and phrases unless the topic truly demands them:

| Avoid | Avoid | Avoid |
|---|---|---|
| delve / delve into | tapestry / rich tapestry | testament / is a testament to |
| beacon | underscore | highlight |
| showcase | crucial | pivotal |
| paramount | vital | foster |
| cultivate | evolving landscape | digital age |
| multifaceted | nuanced | embark |

**Do instead:** pick plain, specific words. Say "look at" instead of "delve into." Say "important" or just explain why it matters instead of "pivotal."

---

## 4. Tone

**Do not:**
- Keep the same polite, neutral, cautious tone from start to finish.
- Write with zero personality, idioms, or conversational touches.
- Avoid contractions or follow grammar so strictly that the text sounds stiff.

**Do instead:**
- Use a real voice. Pick a tone that fits the audience and keep it human.
- Use contractions, idioms, and natural phrasing where they fit.
- Allow humor, irony, or a light self-aware remark when appropriate.

---

## 5. Sentence Rhythm

**Do not:**
- Write sentences that are all about the same length (the 15 to 25 word trap).
- Pick the most predictable word or phrase every time.

**Do instead:**
- Mix short sentences with long ones. A very short sentence can land a point.
- Vary sentence openings and syntax.
- Choose the unexpected but accurate word over the safe one.

---

## 6. Depth and Content

**Do not:**
- Stay at surface level with broad generalities everyone already knows.
- Hedge on every opinion ("While some argue X, others believe Y," "It depends on various factors," "Both perspectives have valid points").
- Repeat the same idea in different words to fill space or hit a word count.
- State facts, statistics, quotes, or citations you cannot verify. Never invent them.
- Assume old information is still current. Check dates and recent events.

**Do instead:**
- Use precise, niche examples and concrete details.
- Take a clear stance when the evidence supports one. If a topic is truly split, say exactly where and why.
- Make each paragraph add something new.
- Cite only real, checkable sources. If you are unsure, leave it out or say you are unsure.

---

## 7. Human Elements

**Do not:**
- Write text with no personal angle, anecdote, or sensory detail.
- Make the writing so polished that it feels sterile.

**Do instead:**
- Include real experience, observations, or specific scenes when the context provides them. Do not fabricate personal stories.
- Let natural quirks show: a casual aside, an informal phrase, an imperfect but human rhythm.

---

## 8. Images and Visuals (Mandatory Requirement & Prioritization)

Every blog post must include pictures to illustrate workflows, anchor concepts, and avoid walls of pure text. To keep the blog fresh and avoid repetitive visual fatigue across articles, follow this strict prioritization:

**1. Prioritize Images Outside Assets for General Sections:**
- For all introductory context, problem statements, study setups, research workflows, productivity concepts, and comparisons, **always prioritize images outside assets**:
  - **Non-Copyrighted Web Images:** High-quality, royalty-free photos taken directly from the internet (Unsplash, Pexels, Wikimedia Commons, CC0 public domain). **Strict rule:** Images from the internet must NEVER be copyrighted, watermarked, or unlicensed.
  - **AI-Generated Concept Visuals:** Custom illustrations or diagrams generated specifically for the article.
  - **New Workstation/Browser Screenshots:** Fresh captures of research workflows or web portals.

**2. Use Project Assets ONLY When Explicitly Discussing Tab Explorer:**
- Existing project assets from `public/assets/` (`screenshot-1-overview.png`, `screenshot-2-organization.png`, `screenshot-3-session-restore.png`, `screenshot-4-customization.png`, `marquee-promo-tile-1400x560.png`, `small-promo-tile-440x280.png`) may **only** be used when explicitly demonstrating or discussing Tab Explorer itself.
- **Do not** use project assets to illustrate generic concepts, problems, or non-Tab Explorer sections.
- If Tab Explorer is only mentioned in a brief closing recommendation/call-to-action paragraph, use **zero** asset images.

**3. Asset Distribution Rules (Max Ceiling $\le 1$, Anti-Repetition):**
- **Maximum Ceiling ($\le 1$):** Each article has a maximum budget of **at most 1 project asset image**.
- **Not a mandatory target:** An article can use 0 asset images. If an article uses 0, that unused allowance transfers forward to future articles, but **no single article may ever use more than 1 asset image**.
- **Rotation by Usage Count:** Always consult `state.json` (`node pipeline/manage.js asset-stats`) and pick the **least-used** asset that fits the specific feature discussed.
- **No Consecutive Repetition:** Never use the same project asset that was used in the immediately preceding published article.

**Formatting & Delivery:**
- Insert with standard Markdown: `![Descriptive Alt Text](/assets/... or /blog-assets/<slug>/...)`
- Always write specific, descriptive alt text for accessibility and image SEO.
- Store article-specific downloaded or generated images in `public/blog-assets/<slug>/` so they deploy cleanly with the static site.

---

## Final Checklist

Before you finish, check your draft:

1. Does it use any banned word (delve, tapestry, pivotal, and so on)?
2. Do the paragraphs and lists look too uniform?
3. Is the tone flat and hedging on every opinion?
4. Are the sentences all about the same length?
5. Does it open or close with a cliché like "In today's digital age" or "In conclusion"?
6. Is every fact, quote, and statistic real and verifiable?
7. Does each paragraph say something the previous one did not?
8. Does the article include pictures prioritizing images outside assets for general sections?
9. Are project assets used strictly when explicitly discussing Tab Explorer, capped at $\le 1$ max, and not repeated from the previous article?

If any answer to 1–5 is yes, or to 6–9 is no, rewrite or fix that part before delivering.
