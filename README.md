# TAB Explorer — Landing Page & Blog

Official website for **TAB Explorer**, the file-explorer-style tab manager extension for Google Chrome.

- **Live Production Domain:** [https://tabexplorer.site](https://tabexplorer.site)
- **Blog:** [https://tabexplorer.site/blog](https://tabexplorer.site/blog)
- **RSS Feed:** [https://tabexplorer.site/rss.xml](https://tabexplorer.site/rss.xml)
- **Chrome Web Store:** [TAB Explorer Extension](https://chromewebstore.google.com/detail/tab-explorer/ijcnikejbjffhcnblofckaihgchkiged)
- **Extension Repository:** [https://github.com/Iyuu8/TAB-Explorer](https://github.com/Iyuu8/TAB-Explorer)

---

## Tech Stack & Architecture

- **Framework:** React 19 + Create React App (`react-scripts 5.0.1`)
- **Routing:** React Router (`/` for landing page, `/blog` for blog home, `/blog/:slug` for individual posts)
- **Blog Engine:** Markdown-based (`src/posts/*.md`) compiled with `marked` via automated pre-build script (`scripts/build-blog.js`)
- **Styling:** Custom CSS variables, glassmorphic design tokens, matching typography (`Sora` + `Instrument Sans`)
- **Animations:** Framer Motion
- **Icons:** Lucide React & Custom SVG Chrome / Brand Assets
- **SEO & Syndication:** Dynamic page titles & meta descriptions, `sitemap.xml`, and RSS 2.0 feed (`rss.xml`)
- **Hosting & Deployment:** Vercel SPA deployment (`vercel.json`) with automated Git push integration

---

## How to Add a New Blog Post

Adding a new blog post is as simple as creating a new `.md` file inside `src/posts/`:

1. Create `src/posts/my-new-post.md`:
   ```markdown
   ---
   title: "My Post Title"
   slug: "my-post-title"
   date: "2026-10-24"
   description: "A short 1-2 sentence summary for search engines and card previews."
   author: "Benaziza Ayoub"
   readTime: "4 min read"
   category: "Productivity"
   tags: ["Chrome Tabs", "Workflows"]
   ---

   Your content in standard Markdown here...
   ```
2. Run `npm start` or `npm run build`:
   The pre-build script automatically indexes your post, parses the Markdown, updates `public/sitemap.xml`, and rebuilds `public/rss.xml`.

---

## Available Scripts

### `npm start`
Runs the automated blog build script and starts the development server at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Compiles all Markdown posts, generates `posts-data.json`, updates `sitemap.xml` and `rss.xml`, and produces an optimized production bundle in the `build/` directory.

### `npm run build:blog`
Runs only the blog generator script without starting or building the entire React app.

---

## How to Deploy to Production

Because your project is connected to GitHub and hosted on Vercel:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Add blog feature and articles"
   ```
2. Push to GitHub:
   ```bash
   git push origin master
   ```
3. Vercel automatically detects the push to `master`, runs `npm run build` (which automatically executes `prebuild` to compile Markdown and generate `sitemap.xml` and `rss.xml`), and deploys the update to [tabexplorer.site](https://tabexplorer.site).
